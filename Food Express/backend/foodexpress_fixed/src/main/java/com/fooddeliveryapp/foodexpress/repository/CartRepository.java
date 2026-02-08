package com.fooddeliveryapp.foodexpress.repository;

import com.fooddeliveryapp.foodexpress.entity.Cart;
import com.fooddeliveryapp.foodexpress.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUser(User user);
}
