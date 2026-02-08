package com.fooddeliveryapp.foodexpress.repository;

import com.fooddeliveryapp.foodexpress.entity.AgentPayout;
import com.fooddeliveryapp.foodexpress.entity.DeliveryAgent;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AgentPayoutRepository extends JpaRepository<AgentPayout, Long> {
    List<AgentPayout> findByAgent(DeliveryAgent agent);
}
