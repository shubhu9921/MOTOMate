package com.carewash.dto;

import com.carewash.entity.BookingStatus;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
public class BookingDto {
    private Long id;
    private Long userId;
    private Long serviceId;
    private String serviceName;
    private Long vehicleId;
    private String vehicleNumber;
    private String vehicleName;
    private Long addressId;
    private LocalDate bookingDate;
    private LocalTime bookingTime;
    private BookingStatus status;
    private Double totalAmount;
    private String notes;
    private Long serviceProviderId;
    private String paymentMethod;
    private String paymentStatus;
}
