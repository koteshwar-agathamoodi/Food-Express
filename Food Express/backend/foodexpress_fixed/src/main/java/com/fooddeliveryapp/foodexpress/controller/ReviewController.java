package com.fooddeliveryapp.foodexpress.controller;

import com.fooddeliveryapp.foodexpress.entity.Order;
import com.fooddeliveryapp.foodexpress.entity.Review;
import com.fooddeliveryapp.foodexpress.entity.User;
import com.fooddeliveryapp.foodexpress.exception.ResourceNotFoundException;
import com.fooddeliveryapp.foodexpress.repository.OrderRepository;
import com.fooddeliveryapp.foodexpress.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final OrderRepository orderRepository;

    @PostMapping("/order/{orderId}")
    public ResponseEntity<Review> submitReview(
            @AuthenticationPrincipal User user,
            @PathVariable Long orderId,
            @RequestBody Review review) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        review.setCustomer(user);
        review.setOrder(order);
        return ResponseEntity.ok(reviewRepository.save(review));
    }

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<Review>> getRestaurantReviews(
            @PathVariable Long restaurantId) {
        return ResponseEntity.ok(reviewRepository.findByOrderRestaurantId(restaurantId));
    }
}
