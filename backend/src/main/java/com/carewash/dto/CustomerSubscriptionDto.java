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
    private Long vehicleId;
    private String vehicleName;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDate nextBillingDate;
    private BillingPeriod billingPeriod;
    private SubscriptionStatus status;
    private Boolean autoRenew;
    private Integer washesAllowed;
    private Integer washesUsed;
    private Integer remainingWashes;
    private Double amountPaid;
    private java.util.List<SubscriptionPlanServiceDto> planServices;
}
