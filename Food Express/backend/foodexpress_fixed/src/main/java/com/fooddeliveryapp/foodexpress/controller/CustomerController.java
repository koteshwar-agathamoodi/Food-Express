package com.fooddeliveryapp.foodexpress.controller;

import com.fooddeliveryapp.foodexpress.dto.OrderRequest;
import com.fooddeliveryapp.foodexpress.entity.*;
import com.fooddeliveryapp.foodexpress.repository.FoodItemRepository;
import com.fooddeliveryapp.foodexpress.repository.RestaurantRepository;
import com.fooddeliveryapp.foodexpress.service.CartService;
import com.fooddeliveryapp.foodexpress.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer")
@RequiredArgsConstructor
public class CustomerController {

    private final RestaurantRepository restaurantRepository;
    private final FoodItemRepository foodItemRepository;
    private final CartService cartService;
    private final OrderService orderService;

    @GetMapping("/restaurants")
    public ResponseEntity<List<Restaurant>> getAllRestaurants() {
        return ResponseEntity.ok(restaurantRepository.findAll());
    }

    @GetMapping("/restaurant/{id}/menu")
    public ResponseEntity<List<FoodItem>> getRestaurantMenu(@PathVariable Long id) {
        return ResponseEntity.ok(foodItemRepository.findByRestaurantId(id));
    }

    @GetMapping("/cart")
    public ResponseEntity<Cart> getCart(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(cartService.getCartByUser(user));
    }

    @PostMapping("/cart/add")
    public ResponseEntity<Cart> addToCart(
            @AuthenticationPrincipal User user,
            @RequestParam Long foodItemId,
            @RequestParam Integer quantity) {
        return ResponseEntity.ok(cartService.addToCart(user, foodItemId, quantity));
    }

    @DeleteMapping("/cart/remove/{itemId}")
    public ResponseEntity<Cart> removeFromCart(
            @AuthenticationPrincipal User user,
            @PathVariable Long itemId) {
        return ResponseEntity.ok(cartService.removeItem(user, itemId));
    }

    @PutMapping("/cart/update-quantity")
    public ResponseEntity<Cart> updateCartQuantity(
            @AuthenticationPrincipal User user,
            @RequestParam Long foodItemId,
            @RequestParam Integer quantity) {
        return ResponseEntity.ok(cartService.updateQuantity(user, foodItemId, quantity));
    }

    @PostMapping("/order")
    public ResponseEntity<Order> placeOrder(@AuthenticationPrincipal User user, @RequestBody OrderRequest request) {
        return ResponseEntity.ok(orderService.placeOrder(user, request));
    }

    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getMyOrders(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(orderService.getCustomerOrders(user));
    }

    @PutMapping("/orders/{orderId}/cancel")
    public ResponseEntity<Order> cancelOrder(@AuthenticationPrincipal User user, @PathVariable Long orderId) {
        // In a real app, we'd check if the order belongs to the user here
        return ResponseEntity.ok(orderService.cancelOrder(orderId));
    }
}
