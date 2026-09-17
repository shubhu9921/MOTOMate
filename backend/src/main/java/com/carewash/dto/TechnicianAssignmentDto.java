package com.carewash.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class TechnicianAssignmentDto {
    private Long id;
    private Long bookingId;
    private Long providerId;
    private String status;
    private Double distanceKm;
    private Boolean isMandatory;
    private LocalDateTime assignedAt;
    
    // Additional booking details for UI
    private String serviceName;
    private String customerName;
    private String addressLine;
    private String city;
    private String pincode;
    private String vehicleName;
    private String vehicleNumber;
    private String bookingDate;
    private String bookingTime;
    private Double totalAmount;
}
