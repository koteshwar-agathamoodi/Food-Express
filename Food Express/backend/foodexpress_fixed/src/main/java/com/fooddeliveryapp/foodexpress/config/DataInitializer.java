package com.fooddeliveryapp.foodexpress.config;

import com.fooddeliveryapp.foodexpress.entity.Role;
import com.fooddeliveryapp.foodexpress.entity.User;
import com.fooddeliveryapp.foodexpress.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;

        @Override
        public void run(String... args) throws Exception {
                // 1. Ensure Admin exists
                ensureUser("admin@foodexpress.com", "Admin", "123456", Role.ADMIN);

                System.out.println("✅ Database Initialized (Only Admin Account)");
        }

        private void ensureUser(String email, String name, String password, Role role) {
                if (!userRepository.existsByEmail(email)) {
                        User user = User.builder()
                                        .email(email)
                                        .name(name)
                                        .password(passwordEncoder.encode(password))
                                        .role(role)
                                        .active(true)
                                        .status("APPROVED")
                                        .createdAt(java.time.LocalDateTime.now())
                                        .build();
                        userRepository.save(user);
                        System.out.println("✅ User created: " + email);
                }
        }
}
