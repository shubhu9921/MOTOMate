package com.carewash.dto;

import lombok.Data;

@Data
public class SubscribeRequest {
    private Long planId;
    private Long vehicleId;
    private Boolean autoRenew;
}
