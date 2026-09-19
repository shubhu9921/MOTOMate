package com.carewash.dto;

import com.carewash.entity.BillingPeriod;
import lombok.Data;
import java.util.List;

@Data
public class SubscriptionPlanDto {
    private Long id;
    private String name;
    private String description;
    private BillingPeriod billingPeriod;
    private Double price;
    private Double discountPercentage;
    private Integer includedWashes;
    private Double additionalWashPrice;
    private Integer vehicleLimit;
    private Boolean active;
    private String cancellationPolicy;
    private String terms;
    private List<SubscriptionPlanServiceDto> planServices;
}
