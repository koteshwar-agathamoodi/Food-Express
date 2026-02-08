package com.fooddeliveryapp.foodexpress.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AgentPayout {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private DeliveryAgent agent;

    private Double amount;
    private LocalDateTime payoutTime;
    private String transactionId;
}
