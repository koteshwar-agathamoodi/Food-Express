package com.fooddeliveryapp.foodexpress.service;

import com.fooddeliveryapp.foodexpress.entity.AgentPayout;
import com.fooddeliveryapp.foodexpress.entity.DeliveryAgent;
import com.fooddeliveryapp.foodexpress.repository.AgentPayoutRepository;
import com.fooddeliveryapp.foodexpress.repository.DeliveryAgentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AgentPayoutService {
    private final AgentPayoutRepository payoutRepository;
    private final DeliveryAgentRepository agentRepository;

    @Transactional
    public void trackDeliveryEarnings(Long agentId, Double amount) {
        DeliveryAgent agent = agentRepository.findById(agentId).orElseThrow();
        agent.setTotalEarnings(agent.getTotalEarnings() + amount);
        agent.setStatus("AVAILABLE");
        agentRepository.save(agent);

        AgentPayout payout = AgentPayout.builder()
                .agent(agent)
                .amount(amount)
                .payoutTime(LocalDateTime.now())
                .transactionId(UUID.randomUUID().toString())
                .build();
        payoutRepository.save(payout);
    }

    public List<AgentPayout> getPayoutHistory(DeliveryAgent agent) {
        return payoutRepository.findByAgent(agent);
    }
}
