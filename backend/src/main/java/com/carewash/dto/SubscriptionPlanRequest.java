package com.carewash.dto;

import com.carewash.entity.BillingPeriod;
import com.carewash.entity.ServiceFrequency;
import lombok.Data;
import java.util.List;

@Data
public class SubscriptionPlanRequest {
    private String name;
    private String description;
    private BillingPeriod billingPeriod;
    private ServiceFrequency serviceFrequency;
    private Double price;
    private Double discountPercentage;
    private Integer washLimit;
    private Double additionalWashPrice;
    private Integer vehicleLimit;
    private Boolean active;
    private String cancellationPolicy;
    private String terms;
    private List<ServiceConfig> services;

    @Data
    public static class ServiceConfig {
        private Long serviceId;
        private Boolean isIncluded;
        private Double discountPercentage;
    }
}
