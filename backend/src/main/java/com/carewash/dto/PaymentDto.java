package com.carewash.dto;

import com.carewash.entity.PaymentMethod;
import com.carewash.entity.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDto {
    private Long id;
    private Long bookingId;
    private String serviceName;
    private Double amount;
    private String currency;
    private PaymentMethod method;
    private PaymentStatus status;
    private String transactionId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
