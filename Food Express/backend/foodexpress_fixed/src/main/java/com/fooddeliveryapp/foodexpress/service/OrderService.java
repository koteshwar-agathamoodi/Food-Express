package com.fooddeliveryapp.foodexpress.service;

import com.fooddeliveryapp.foodexpress.dto.OrderRequest;
import com.fooddeliveryapp.foodexpress.entity.*;
import com.fooddeliveryapp.foodexpress.exception.BadRequestException;
import com.fooddeliveryapp.foodexpress.exception.ResourceNotFoundException;
import com.fooddeliveryapp.foodexpress.repository.CartRepository;
import com.fooddeliveryapp.foodexpress.repository.DeliveryAgentRepository;
import com.fooddeliveryapp.foodexpress.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final CartService cartService;
    private final DeliveryAgentRepository agentRepository;

    // ================= PLACE ORDER =================
    @Transactional
    public Order placeOrder(User user, OrderRequest request) {

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new BadRequestException("Cart is empty"));

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new BadRequestException("Cart is empty");
        }

        Restaurant restaurant = cart.getItems()
                .get(0)
                .getFoodItem()
                .getRestaurant();

        Order order = Order.builder()
                .customer(user)
                .restaurant(restaurant)
                .status("PLACED")
                .totalAmount(cart.getTotalAmount())
                .street(request.getStreet())
                .city(request.getCity())
                .state(request.getState())
                .pincode(request.getPincode())
                .phone(request.getPhone())
                .instructions(request.getInstructions())
                .verificationToken(String.format("%06d", new java.util.Random().nextInt(1000000)))
                .build();

        Order savedOrder = orderRepository.save(order);

        List<OrderItem> orderItems = new ArrayList<>(
                cart.getItems().stream()
                        .map(cartItem -> OrderItem.builder()
                                .order(savedOrder)
                                .foodName(cartItem.getFoodItem().getName())
                                .price(cartItem.getFoodItem().getPrice())
                                .quantity(cartItem.getQuantity())
                                .build())
                        .collect(Collectors.toList()));

        savedOrder.setItems(orderItems);
        orderRepository.save(savedOrder);

        cartService.clearCart(user);

        return savedOrder;
    }

    // ================= CUSTOMER =================
    public List<Order> getCustomerOrders(User user) {
        return orderRepository.findByCustomer(user);
    }

    // ================= OWNER =================
    public List<Order> getRestaurantOrders(Long restaurantId) {
        return orderRepository.findByRestaurantId(restaurantId);
    }

    public List<Order> getOwnerOrders(User owner) {
        return orderRepository.findByRestaurantOwner(owner);
    }

    @Transactional
    public Order acceptOrderByOwner(Long orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!"PLACED".equals(order.getStatus())) {
            throw new BadRequestException("Only PLACED orders can be accepted");
        }

        order.setStatus("ACCEPTED");
        return orderRepository.save(order);
    }

    // ================= AGENT =================
    public List<Order> getAgentOrders(User agentUser) {
        return orderRepository.findByDeliveryAgentUser(agentUser);
    }

    // 🔥 FIXED HERE
    public List<Order> getAvailableOrders() {
        return orderRepository.findByStatusIn(
                List.of("ACCEPTED", "ON_THE_WAY"));
    }

    @Transactional
    public Order assignAgent(Long orderId, User agentUser) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!"ACCEPTED".equals(order.getStatus())) {
            throw new BadRequestException("Order must be ACCEPTED first");
        }

        DeliveryAgent agent = agentRepository.findByUser(agentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery agent not found"));

        order.setDeliveryAgent(agent);
        order.setStatus("ON_THE_WAY");

        agent.setStatus("BUSY");
        agentRepository.save(agent);

        return orderRepository.save(order);
    }

    // ================= DELIVER =================
    @Transactional
    public Order markDelivered(Long orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!"ON_THE_WAY".equals(order.getStatus())) {
            throw new BadRequestException("Order is not out for delivery");
        }

        order.setStatus("DELIVERED");

        DeliveryAgent agent = order.getDeliveryAgent();
        if (agent != null) {
            agent.setStatus("AVAILABLE");
            agentRepository.save(agent);
        }

        return orderRepository.save(order);
    }

    @Transactional
    public Order verifyAndDeliver(Long orderId, String token) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!"ON_THE_WAY".equals(order.getStatus())) {
            throw new BadRequestException("Order is not out for delivery");
        }

        if (order.getVerificationToken() == null || !order.getVerificationToken().equals(token)) {
            throw new BadRequestException("Invalid verification code");
        }

        order.setStatus("DELIVERED");

        DeliveryAgent agent = order.getDeliveryAgent();
        if (agent != null) {
            agent.setStatus("AVAILABLE");
            agentRepository.save(agent);
        }

        return orderRepository.save(order);
    }

    @Transactional
    public Order cancelOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!"PLACED".equals(order.getStatus())) {
            throw new BadRequestException("Only pending orders can be cancelled");
        }

        order.setStatus("CANCELLED");
        return orderRepository.save(order);
    }
}
