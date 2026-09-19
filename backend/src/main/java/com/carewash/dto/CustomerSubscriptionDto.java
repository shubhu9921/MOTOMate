package com.carewash.dto;

import com.carewash.entity.BillingPeriod;
import com.carewash.entity.SubscriptionStatus;
import lombok.Data;
import java.time.LocalDate;

@Data
public class CustomerSubscriptionDto {
    private Long id;
    private Long planId;
    private String planName;
    private LocalDate startDate;
    private LocalDate endDate;
    private BillingPeriod billingPeriod;
    private SubscriptionStatus status;
    private Boolean autoRenew;
    private Integer totalWashes;
    private Integer usedWashes;
    private Integer remainingWashes;
    private Double amountPaid;
    private java.util.List<SubscriptionPlanServiceDto> planServices;
}
