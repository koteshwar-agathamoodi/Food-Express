package com.fooddeliveryapp.foodexpress.repository;

import com.fooddeliveryapp.foodexpress.entity.Notification;
import com.fooddeliveryapp.foodexpress.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByTargetUserOrderByCreatedAtDesc(User user);

    List<Notification> findByTargetUserIsNullOrderByCreatedAtDesc();
}
