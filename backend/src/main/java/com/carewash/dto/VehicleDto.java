package com.carewash.dto;

import com.carewash.entity.VehicleType;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class VehicleDto {
    private Long id;
    private Long userId;
    private String vehicleNumber;
    private VehicleType vehicleType;
    private String brand;
    private String model;
    private String color;
}
