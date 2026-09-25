package com.carewash.dto;

import com.carewash.entity.VehicleType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class VehicleRequest {
    @NotBlank(message = "Vehicle number is required")
    @Size(max = 20, message = "Vehicle number cannot exceed 20 characters")
    @Pattern(regexp = "^[a-zA-Z0-9]+$", message = "Vehicle number must be alphanumeric")
    private String vehicleNumber;

    @NotNull(message = "Vehicle type is required")
    private VehicleType vehicleType;

    @NotBlank(message = "Brand is required")
    @Size(max = 50, message = "Brand cannot exceed 50 characters")
    private String brand;

    @NotBlank(message = "Model is required")
    @Size(max = 50, message = "Model cannot exceed 50 characters")
    private String model;

    @NotBlank(message = "Color is required")
    @Size(max = 30, message = "Color cannot exceed 30 characters")
    private String color;

    @NotBlank(message = "Vehicle image is required")
    @Size(max = 5000000, message = "Image size exceeds maximum limit")
    private String vehicleImageUrl;
    
    @NotBlank(message = "Number plate image is required")
    @Size(max = 5000000, message = "Image size exceeds maximum limit")
    private String numberPlateImageUrl;
    
    @Size(max = 5000000, message = "Image size exceeds maximum limit")
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
