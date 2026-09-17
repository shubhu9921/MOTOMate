package com.carewash.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CouponDto {
    private Long id;
    private String code;
    private String description;
    private BigDecimal discount;
    private String discountType;
    private BigDecimal minBookingAmount;
    private LocalDateTime expiryDate;
    private Integer usageLimit;
    private Integer timesUsed;
    private boolean active;
}
