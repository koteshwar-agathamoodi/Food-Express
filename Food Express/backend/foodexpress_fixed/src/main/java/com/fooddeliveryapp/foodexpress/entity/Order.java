package com.fooddeliveryapp.foodexpress.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JsonIgnore
    private User customer;

    @ManyToOne
    @JsonIgnore
    private DeliveryAgent deliveryAgent;

    @ManyToOne
    @JoinColumn(name = "restaurant_id")
    private Restaurant restaurant;

    private String street;
    private String city;
    private String state;
    private String pincode;
    private String phone;
    private String instructions;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items;

    private Double totalAmount;
    private String status;
    private String verificationToken;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public String getUserName() {
        return customer != null ? customer.getName() : null;
    }

    public String getRestaurantName() {
        return restaurant != null ? restaurant.getName() : null;
    }

    public java.util.Map<String, String> getAddress() {
        java.util.Map<String, String> addr = new java.util.HashMap<>();
        addr.put("street", street);
        addr.put("city", city);
        addr.put("state", state);
        addr.put("pincode", pincode);
        addr.put("phone", phone);
        addr.put("instructions", instructions);
        return addr;
    }
}
