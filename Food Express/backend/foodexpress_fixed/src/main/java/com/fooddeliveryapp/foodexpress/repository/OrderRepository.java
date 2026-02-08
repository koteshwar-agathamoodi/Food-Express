package com.fooddeliveryapp.foodexpress.repository;

import com.fooddeliveryapp.foodexpress.entity.Order;
import com.fooddeliveryapp.foodexpress.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByCustomer(User customer);

    List<Order> findByStatus(String status);

    @Query("""
                SELECT DISTINCT o
                FROM Order o
                JOIN o.items oi
                JOIN FoodItem fi ON fi.name = oi.foodName
                WHERE fi.restaurant.id = :restaurantId
            """)
    List<Order> findByRestaurantId(Long restaurantId);

    List<Order> findByRestaurantOwner(User owner);

    // 🔥 ADD THIS
    List<Order> findByStatusIn(List<String> statuses);

    List<Order> findByDeliveryAgentUser(User user);

    // Optional (for future)
    List<Order> findByDeliveryAgent(User agent);
}
