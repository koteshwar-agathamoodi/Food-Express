package com.fooddeliveryapp.foodexpress.controller;

import com.fooddeliveryapp.foodexpress.entity.AgentPayout;
import com.fooddeliveryapp.foodexpress.entity.DeliveryAgent;
import com.fooddeliveryapp.foodexpress.entity.Order;
import com.fooddeliveryapp.foodexpress.entity.User;
import com.fooddeliveryapp.foodexpress.exception.ResourceNotFoundException;
import com.fooddeliveryapp.foodexpress.repository.DeliveryAgentRepository;
import com.fooddeliveryapp.foodexpress.service.AgentPayoutService;
import com.fooddeliveryapp.foodexpress.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/agent")
@RequiredArgsConstructor
public class DeliveryAgentController {

    private final OrderService orderService;
    private final DeliveryAgentRepository deliveryAgentRepository;
    private final AgentPayoutService payoutService;

    @GetMapping("/available-orders")
    public ResponseEntity<List<Order>> getAvailableOrders() {
        return ResponseEntity.ok(orderService.getAvailableOrders());
    }

    @GetMapping("/orders/my")
    public ResponseEntity<List<Order>> getMyOrders(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(orderService.getAgentOrders(user));
    }

    // ================= TAKE ORDER =================
    @PostMapping("/orders/{orderId}/take")
    public ResponseEntity<Order> takeOrder(
            @AuthenticationPrincipal User user,
            @PathVariable Long orderId) {

        return ResponseEntity.ok(orderService.assignAgent(orderId, user));
    }

    // ================= DELIVER ORDER =================
    @PutMapping("/orders/{orderId}/deliver")
    public ResponseEntity<Order> completeDelivery(
            @AuthenticationPrincipal User user,
            @PathVariable Long orderId) {

        DeliveryAgent agent = deliveryAgentRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Agent profile not found"));

        Order order = orderService.markDelivered(orderId);

        payoutService.trackDeliveryEarnings(agent.getId(), 50.0);

        return ResponseEntity.ok(order);
    }

    @PutMapping("/orders/{orderId}/verify-delivery")
    public ResponseEntity<Order> verifyDelivery(
            @AuthenticationPrincipal User user,
            @PathVariable Long orderId,
            @RequestParam String token) {

        DeliveryAgent agent = deliveryAgentRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Agent profile not found"));

        Order order = orderService.verifyAndDeliver(orderId, token);

        payoutService.trackDeliveryEarnings(agent.getId(), 50.0);

        return ResponseEntity.ok(order);
    }

    // ================= PAYOUTS =================
    @GetMapping("/payouts")
    public ResponseEntity<List<AgentPayout>> getMyPayouts(
            @AuthenticationPrincipal User user) {

        DeliveryAgent agent = deliveryAgentRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Agent profile not found"));

        return ResponseEntity.ok(payoutService.getPayoutHistory(agent));
    }
}
