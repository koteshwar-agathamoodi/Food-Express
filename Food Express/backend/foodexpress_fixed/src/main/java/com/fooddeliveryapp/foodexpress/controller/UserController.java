package com.fooddeliveryapp.foodexpress.controller;

import com.fooddeliveryapp.foodexpress.dto.UpdateProfileRequest;
import com.fooddeliveryapp.foodexpress.entity.Notification;
import com.fooddeliveryapp.foodexpress.entity.User;
import com.fooddeliveryapp.foodexpress.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final com.fooddeliveryapp.foodexpress.repository.NotificationRepository notificationRepository;

    private final UserService userService;

    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(
            @AuthenticationPrincipal User user,
            @RequestBody UpdateProfileRequest request) {

        return ResponseEntity.ok(userService.updateProfile(user, request));
    }

    @GetMapping("/me")
    public ResponseEntity<User> getMe(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(user);
    }

    @GetMapping("/notifications")
    public ResponseEntity<List<Notification>> getNotifications(@AuthenticationPrincipal User user) {
        List<Notification> broadcast = notificationRepository.findByTargetUserIsNullOrderByCreatedAtDesc();
        List<Notification> personal = notificationRepository.findByTargetUserOrderByCreatedAtDesc(user);

        List<Notification> all = java.util.stream.Stream.concat(broadcast.stream(), personal.stream())
                .sorted((n1, n2) -> n2.getCreatedAt().compareTo(n1.getCreatedAt()))
                .collect(java.util.stream.Collectors.toList());

        return ResponseEntity.ok(all);
    }
}
