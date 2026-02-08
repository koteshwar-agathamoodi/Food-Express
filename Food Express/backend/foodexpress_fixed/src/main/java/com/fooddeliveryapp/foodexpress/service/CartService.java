package com.fooddeliveryapp.foodexpress.service;

import com.fooddeliveryapp.foodexpress.entity.*;
import com.fooddeliveryapp.foodexpress.exception.BadRequestException;
import com.fooddeliveryapp.foodexpress.exception.ResourceNotFoundException;
import com.fooddeliveryapp.foodexpress.repository.CartItemRepository;
import com.fooddeliveryapp.foodexpress.repository.CartRepository;
import com.fooddeliveryapp.foodexpress.repository.FoodItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final FoodItemRepository foodItemRepository;

    // ================= GET CART =================
    public Cart getCartByUser(User user) {
        return cartRepository.findByUser(user)
                .orElseGet(() -> {
                    Cart cart = Cart.builder()
                            .user(user)
                            .totalAmount(0.0)
                            .build();
                    return cartRepository.save(cart);
                });
    }

    // ================= ADD / UPDATE CART =================
    public Cart addToCart(User user, Long foodItemId, int quantity) {

        if (quantity == 0) {
            throw new BadRequestException("Quantity cannot be zero");
        }

        Cart cart = getCartByUser(user);

        FoodItem foodItem = foodItemRepository.findById(foodItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Food item not found"));

        CartItem item = cartItemRepository
                .findByCartAndFoodItem(cart, foodItem)
                .orElse(null);

        if (item == null) {
            if (quantity < 0) {
                throw new BadRequestException("Cannot decrease item that is not in cart");
            }
            item = CartItem.builder()
                    .cart(cart)
                    .foodItem(foodItem)
                    .quantity(quantity)
                    .build();
        } else {
            int newQty = item.getQuantity() + quantity;

            if (newQty <= 0) {
                cart.setTotalAmount(
                        cart.getTotalAmount() -
                                (item.getFoodItem().getPrice() * item.getQuantity()));
                cartItemRepository.delete(item);
                return cartRepository.save(cart);
            }

            item.setQuantity(newQty);
        }

        cartItemRepository.save(item);

        cart.setTotalAmount(
                cart.getTotalAmount() + (foodItem.getPrice() * quantity));

        return cartRepository.save(cart);
    }

    // ================= REMOVE ITEM =================
    public Cart removeItem(User user, Long itemId) {

        Cart cart = getCartByUser(user);

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Item does not belong to this cart");
        }

        cart.setTotalAmount(
                cart.getTotalAmount() -
                        (item.getFoodItem().getPrice() * item.getQuantity()));

        cartItemRepository.delete(item);
        return cartRepository.save(cart);
    }

    // ================= UPDATE QUANTITY =================
    public Cart updateQuantity(User user, Long foodItemId, int quantity) {
        Cart cart = getCartByUser(user);
        FoodItem foodItem = foodItemRepository.findById(foodItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Food item not found"));

        CartItem item = cartItemRepository
                .findByCartAndFoodItem(cart, foodItem)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found in cart"));

        if (quantity <= 0) {
            return removeItem(user, item.getId());
        }

        double pricePerItem = foodItem.getPrice();
        int oldQty = item.getQuantity();

        item.setQuantity(quantity);
        cartItemRepository.save(item);

        cart.setTotalAmount(cart.getTotalAmount() - (pricePerItem * oldQty) + (pricePerItem * quantity));
        return cartRepository.save(cart);
    }

    // ================= CLEAR CART =================
    public void clearCart(User user) {

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

        // 🔥 STEP 1: delete DB rows
        cartItemRepository.deleteAll(cart.getItems());

        // 🔥 STEP 2: clear Hibernate-managed collection
        cart.getItems().clear();

        // 🔥 STEP 3: reset total
        cart.setTotalAmount(0.0);

        cartRepository.save(cart);
    }

}
