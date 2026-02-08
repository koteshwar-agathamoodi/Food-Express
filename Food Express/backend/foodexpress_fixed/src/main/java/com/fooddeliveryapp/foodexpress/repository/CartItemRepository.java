package com.fooddeliveryapp.foodexpress.repository;

import com.fooddeliveryapp.foodexpress.entity.Cart;
import com.fooddeliveryapp.foodexpress.entity.CartItem;
import com.fooddeliveryapp.foodexpress.entity.FoodItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    // Check if a food item already exists in a cart
    boolean existsByCartAndFoodItem(Cart cart, FoodItem foodItem);

    // Find a specific cart item by cart and food item
    Optional<CartItem> findByCartAndFoodItem(Cart cart, FoodItem foodItem);


}
