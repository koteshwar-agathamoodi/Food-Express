package com.fooddeliveryapp.foodexpress.controller;

import com.fooddeliveryapp.foodexpress.entity.*;
import com.fooddeliveryapp.foodexpress.exception.ResourceNotFoundException;
import com.fooddeliveryapp.foodexpress.repository.DeliveryAgentRepository;
import com.fooddeliveryapp.foodexpress.repository.FoodItemRepository;
import com.fooddeliveryapp.foodexpress.repository.RestaurantRepository;
import com.fooddeliveryapp.foodexpress.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/owner")
@RequiredArgsConstructor
public class RestaurantOwnerController {

    private final RestaurantRepository restaurantRepository;
    private final FoodItemRepository foodItemRepository;
    private final OrderService orderService;
    private final DeliveryAgentRepository deliveryAgentRepository;

    // ================= RESTAURANT =================
    @PostMapping("/restaurant")
    public ResponseEntity<Restaurant> createRestaurant(
            @AuthenticationPrincipal User owner,
            @RequestBody Restaurant restaurant) {

        restaurant.setOwner(owner);
        return ResponseEntity.ok(restaurantRepository.save(restaurant));
    }

    @GetMapping("/restaurant")
    public ResponseEntity<List<Restaurant>> getMyRestaurants(
            @AuthenticationPrincipal User owner) {

        return ResponseEntity.ok(restaurantRepository.findByOwner(owner));
    }

    @GetMapping("/restaurant/{id}")
    public ResponseEntity<Restaurant> getRestaurantById(
            @AuthenticationPrincipal User owner,
            @PathVariable Long id) {

        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));

        if (!restaurant.getOwner().getId().equals(owner.getId())) {
            throw new RuntimeException("Unauthorized to access this restaurant");
        }

        return ResponseEntity.ok(restaurant);
    }

    @PutMapping("/restaurant/{id}")
    public ResponseEntity<Restaurant> updateRestaurant(
            @AuthenticationPrincipal User owner,
            @PathVariable Long id,
            @RequestBody Restaurant restaurantDetails) {

        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));

        if (!restaurant.getOwner().getId().equals(owner.getId())) {
            throw new RuntimeException("Unauthorized to update this restaurant");
        }

        restaurant.setName(restaurantDetails.getName());
        restaurant.setDescription(restaurantDetails.getDescription());
        restaurant.setCuisine(restaurantDetails.getCuisine());
        restaurant.setImage(restaurantDetails.getImage());
        restaurant.setAddress(restaurantDetails.getAddress());
        restaurant.setDeliveryTime(restaurantDetails.getDeliveryTime());

        return ResponseEntity.ok(restaurantRepository.save(restaurant));
    }

    @DeleteMapping("/restaurant/{id}")
    public ResponseEntity<Void> deleteRestaurant(
            @AuthenticationPrincipal User owner,
            @PathVariable Long id) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));

        if (!restaurant.getOwner().getId().equals(owner.getId())) {
            throw new RuntimeException("Unauthorized to delete this restaurant");
        }

        restaurantRepository.delete(restaurant);
        return ResponseEntity.noContent().build();
    }

    // ================= MENU =================
    @PostMapping("/menu/{restaurantId}")
    public ResponseEntity<FoodItem> addMenuItem(
            @AuthenticationPrincipal User owner,
            @PathVariable Long restaurantId,
            @RequestBody FoodItem item) {

        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));

        if (!restaurant.getOwner().getId().equals(owner.getId())) {
            throw new RuntimeException("Unauthorized to add menu items to this restaurant");
        }

        item.setRestaurant(restaurant);
        return ResponseEntity.ok(foodItemRepository.save(item));
    }

    @PutMapping("/menu/{itemId}")
    public ResponseEntity<FoodItem> updateMenuItem(
            @AuthenticationPrincipal User owner,
            @PathVariable Long itemId,
            @RequestBody FoodItem itemDetails) {

        FoodItem item = foodItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found"));

        // Ensure owner owns the restaurant this item belongs to
        if (!item.getRestaurant().getOwner().getId().equals(owner.getId())) {
            throw new RuntimeException("Unauthorized to modify this menu item");
        }

        item.setName(itemDetails.getName());
        item.setPrice(itemDetails.getPrice());
        item.setDescription(itemDetails.getDescription());
        item.setImage(itemDetails.getImage());
        item.setIsAvailable(itemDetails.getIsAvailable());

        return ResponseEntity.ok(foodItemRepository.save(item));
    }

    @DeleteMapping("/menu/{itemId}")
    public ResponseEntity<Void> deleteMenuItem(
            @AuthenticationPrincipal User owner,
            @PathVariable Long itemId) {

        FoodItem item = foodItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found"));

        if (!item.getRestaurant().getOwner().getId().equals(owner.getId())) {
            throw new RuntimeException("Unauthorized to delete this menu item");
        }

        foodItemRepository.delete(item);
        return ResponseEntity.noContent().build();
    }

    // ================= ORDERS =================
    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getMyOrders(
            @AuthenticationPrincipal User owner) {
        return ResponseEntity.ok(orderService.getOwnerOrders(owner));
    }

    @GetMapping("/restaurant/{restaurantId}/orders")
    public ResponseEntity<List<Order>> getMyRestaurantOrders(
            @AuthenticationPrincipal User owner,
            @PathVariable Long restaurantId) {

        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));

        if (!restaurant.getOwner().getId().equals(owner.getId())) {
            throw new RuntimeException("Unauthorized to access orders for this restaurant");
        }

        return ResponseEntity.ok(orderService.getRestaurantOrders(restaurantId));
    }

    // 🔥 ACCEPT ORDER (OWNER)
    @PutMapping("/orders/{orderId}/accept")
    public ResponseEntity<Order> acceptOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.acceptOrderByOwner(orderId));
    }

    // 🔥 ASSIGN AGENT (OWNER)
    @GetMapping("/agents/available")
    public ResponseEntity<List<DeliveryAgent>> getAvailableAgents() {
        return ResponseEntity.ok(deliveryAgentRepository.findAll());
    }

    @PutMapping("/orders/{orderId}/assign/{agentId}")
    public ResponseEntity<Order> assignAgent(
            @PathVariable Long orderId,
            @PathVariable Long agentId) {

        DeliveryAgent agent = deliveryAgentRepository.findById(agentId)
                .orElseThrow(() -> new ResourceNotFoundException("Agent not found"));

        return ResponseEntity.ok(orderService.assignAgent(orderId, agent.getUser()));
    }
}
