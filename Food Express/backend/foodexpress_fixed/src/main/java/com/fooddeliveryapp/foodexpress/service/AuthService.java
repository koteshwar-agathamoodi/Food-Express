package com.fooddeliveryapp.foodexpress.service;

import com.fooddeliveryapp.foodexpress.dto.AuthRequest;
import com.fooddeliveryapp.foodexpress.dto.AuthResponse;
import com.fooddeliveryapp.foodexpress.dto.RegisterRequest;
import com.fooddeliveryapp.foodexpress.entity.DeliveryAgent;
import java.time.LocalDateTime;
import com.fooddeliveryapp.foodexpress.entity.Role;
import com.fooddeliveryapp.foodexpress.entity.User;
import com.fooddeliveryapp.foodexpress.exception.BadRequestException;
import com.fooddeliveryapp.foodexpress.exception.UnauthorizedException;
import com.fooddeliveryapp.foodexpress.repository.DeliveryAgentRepository;
import com.fooddeliveryapp.foodexpress.repository.UserRepository;
import com.fooddeliveryapp.foodexpress.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final DeliveryAgentRepository agentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    // ================= REGISTER =================
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }

        Role role;
        String roleStr = request.getRole().toUpperCase();
        if (roleStr.equals("USER"))
            roleStr = "CUSTOMER";
        if (roleStr.equals("DELIVERY"))
            roleStr = "AGENT";

        try {
            role = Role.valueOf(roleStr);
        } catch (Exception e) {
            throw new BadRequestException("Invalid role: " + request.getRole());
        }

        boolean isAutoApproved = role == Role.CUSTOMER || role == Role.USER;

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .active(isAutoApproved)
                .status(isAutoApproved ? "APPROVED" : "PENDING")
                .createdAt(LocalDateTime.now())
                .build();

        user = userRepository.save(user);
        log.info("✅ User saved to database: {} with role {}", user.getEmail(), user.getRole());

        if (role == Role.AGENT || role == Role.DELIVERY) {
            DeliveryAgent agent = DeliveryAgent.builder()
                    .user(user)
                    .status("AVAILABLE")
                    .totalEarnings(0.0)
                    .build();
            agentRepository.save(agent);
        }

        return AuthResponse.builder()
                .token(jwtService.generateToken(user))
                .role(user.getRole().name())
                .email(user.getEmail())
                .name(user.getName()) // Added name to response as frontend expects it
                .build();
    }

    // ================= LOGIN =================
    public AuthResponse authenticate(AuthRequest request) {

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()));
        } catch (AuthenticationException e) {
            throw new UnauthorizedException("Invalid email or password");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!Boolean.TRUE.equals(user.getActive())) {
            throw new UnauthorizedException("Your account is blocked by admin");
        }

        return AuthResponse.builder()
                .token(jwtService.generateToken(user))
                .role(user.getRole().name())
                .email(user.getEmail())
                .name(user.getName())
                .build();
    }
}
