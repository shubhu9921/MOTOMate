package com.carewash.dto;

import lombok.Data;

@Data
public class SubscribeRequest {
    private Long planId;
    private Boolean autoRenew;
}
