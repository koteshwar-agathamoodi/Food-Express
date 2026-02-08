package com.fooddeliveryapp.foodexpress.controller;

import com.fooddeliveryapp.foodexpress.entity.Notification;
import com.fooddeliveryapp.foodexpress.entity.User;
import com.fooddeliveryapp.foodexpress.exception.ResourceNotFoundException;
import com.fooddeliveryapp.foodexpress.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')") // ✅ extra safety
public class AdminController {

    private final UserRepository userRepository;
    private final com.fooddeliveryapp.foodexpress.repository.CartRepository cartRepository;
    private final com.fooddeliveryapp.foodexpress.repository.DeliveryAgentRepository deliveryAgentRepository;
    private final com.fooddeliveryapp.foodexpress.repository.RestaurantRepository restaurantRepository;
    private final com.fooddeliveryapp.foodexpress.repository.NotificationRepository notificationRepository;

    // 🔹 Get all users
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    // 🔹 Block user
    @PutMapping("/users/{id}/block")
    public ResponseEntity<User> blockUser(@PathVariable Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + id));

        user.setActive(false);
        return ResponseEntity.ok(userRepository.save(user));
    }

    // 🔹 Unblock user
    @PutMapping("/users/{id}/unblock")
    public ResponseEntity<User> unblockUser(@PathVariable Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + id));

        user.setActive(true);
        return ResponseEntity.ok(userRepository.save(user));
    }

    // 🔹 Approve user
    @PutMapping("/users/{id}/approve")
    public ResponseEntity<User> approveUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setStatus("APPROVED");
        user.setActive(true);
        return ResponseEntity.ok(userRepository.save(user));
    }

    // 🔹 Reject user
    @PutMapping("/users/{id}/reject")
    public ResponseEntity<User> rejectUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setStatus("REJECTED");
        user.setActive(false);
        return ResponseEntity.ok(userRepository.save(user));
    }

    // 🔹 Delete user
    @DeleteMapping("/users/{id}")
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Clean up dependent entities
        deliveryAgentRepository.findByUser(user).ifPresent(deliveryAgentRepository::delete);
        cartRepository.findByUser(user).ifPresent(cartRepository::delete);

        // If owner, delete their restaurants
        if (user.getRole() == com.fooddeliveryapp.foodexpress.entity.Role.OWNER) {
            restaurantRepository.findByOwner(user).forEach(restaurantRepository::delete);
        }

        userRepository.delete(user);
        return ResponseEntity.noContent().build();
    }

    // 🔹 Send broadcast notification
    @PostMapping("/notifications")
    public ResponseEntity<Notification> sendBroadcastNotification(@RequestBody Notification notification) {
        notification.setCreatedAt(java.time.LocalDateTime.now());
        notification.setTargetUser(null);
        notification.setIsRead(false);
        return ResponseEntity.ok(notificationRepository.save(notification));
    }
}
