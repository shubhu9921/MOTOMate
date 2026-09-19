package com.carewash.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class SubscriptionUsageDto {
    private Long id;
    private Long subscriptionId;
    private Long bookingId;
    private String serviceName;
    private String vehicleInfo;
    private Integer washConsumed;
    private LocalDateTime date;
}
