package com.fooddeliveryapp.foodexpress.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FoodItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private Double price;
    private String image;
    @Builder.Default
    private Boolean isAvailable = true;

    @ManyToOne
    @JoinColumn(name = "restaurant_id")
    @JsonIgnore // ✅ CORRECT & REQUIRED to avoid circularity
    private Restaurant restaurant;

    public Long getRestaurantId() {
        return restaurant != null ? restaurant.getId() : null;
    }

    public String getRestaurantName() {
        return restaurant != null ? restaurant.getName() : null;
    }
}
