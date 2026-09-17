package com.carewash.dto;

import com.carewash.entity.VehicleType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class VehicleRequest {
    @NotBlank(message = "Vehicle number is required")
    private String vehicleNumber;

    @NotNull(message = "Vehicle type is required")
    private VehicleType vehicleType;

    @NotBlank(message = "Brand is required")
    private String brand;

    @NotBlank(message = "Model is required")
    private String model;

    @NotBlank(message = "Color is required")
    private String color;

    @NotBlank(message = "Vehicle image is required")
    @jakarta.validation.constraints.Size(max = 5000000, message = "Image size exceeds maximum limit")
    private String vehicleImageUrl;
    
    @NotBlank(message = "Number plate image is required")
    @jakarta.validation.constraints.Size(max = 5000000, message = "Image size exceeds maximum limit")
    private String numberPlateImageUrl;
    
    @jakarta.validation.constraints.Size(max = 5000000, message = "Image size exceeds maximum limit")
    private String cleaningAreaImageUrl;

    public String getVehicleNumber() { return vehicleNumber; }
    public void setVehicleNumber(String vehicleNumber) { this.vehicleNumber = vehicleNumber; }

    public VehicleType getVehicleType() { return vehicleType; }
    public void setVehicleType(VehicleType vehicleType) { this.vehicleType = vehicleType; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getVehicleImageUrl() { return vehicleImageUrl; }
    public void setVehicleImageUrl(String vehicleImageUrl) { this.vehicleImageUrl = vehicleImageUrl; }

    public String getNumberPlateImageUrl() { return numberPlateImageUrl; }
    public void setNumberPlateImageUrl(String numberPlateImageUrl) { this.numberPlateImageUrl = numberPlateImageUrl; }

    public String getCleaningAreaImageUrl() { return cleaningAreaImageUrl; }
    public void setCleaningAreaImageUrl(String cleaningAreaImageUrl) { this.cleaningAreaImageUrl = cleaningAreaImageUrl; }
}
