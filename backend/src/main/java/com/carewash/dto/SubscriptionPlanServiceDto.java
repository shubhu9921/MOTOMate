package com.carewash.dto;

import lombok.Data;

@Data
public class SubscriptionPlanServiceDto {
    private Long id;
    private Long serviceId;
    private String serviceName;
    private Boolean isIncluded;
    private Double discountPercentage;
}
