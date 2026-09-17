package com.carewash.dto;

import com.carewash.entity.VehicleType;
import lombok.Builder;
import lombok.Data;

public class VehicleDto {
    private Long id;
    private Long userId;
    private String vehicleNumber;
    private VehicleType vehicleType;
    private String brand;
    private String model;
    private String color;
    private String vehicleImageUrl;
    private String numberPlateImageUrl;
    private String cleaningAreaImageUrl;

    public VehicleDto() {}

    public VehicleDto(Long id, Long userId, String vehicleNumber, VehicleType vehicleType, String brand, String model, String color, String vehicleImageUrl, String numberPlateImageUrl, String cleaningAreaImageUrl) {
        this.id = id;
        this.userId = userId;
        this.vehicleNumber = vehicleNumber;
        this.vehicleType = vehicleType;
        this.brand = brand;
        this.model = model;
        this.color = color;
        this.vehicleImageUrl = vehicleImageUrl;
        this.numberPlateImageUrl = numberPlateImageUrl;
        this.cleaningAreaImageUrl = cleaningAreaImageUrl;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
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

    public static VehicleDtoBuilder builder() {
        return new VehicleDtoBuilder();
    }

    public static class VehicleDtoBuilder {
        private Long id;
        private Long userId;
        private String vehicleNumber;
        private VehicleType vehicleType;
        private String brand;
        private String model;
        private String color;
        private String vehicleImageUrl;
        private String numberPlateImageUrl;
        private String cleaningAreaImageUrl;

        VehicleDtoBuilder() {}

        public VehicleDtoBuilder id(Long id) { this.id = id; return this; }
        public VehicleDtoBuilder userId(Long userId) { this.userId = userId; return this; }
        public VehicleDtoBuilder vehicleNumber(String vehicleNumber) { this.vehicleNumber = vehicleNumber; return this; }
        public VehicleDtoBuilder vehicleType(VehicleType vehicleType) { this.vehicleType = vehicleType; return this; }
        public VehicleDtoBuilder brand(String brand) { this.brand = brand; return this; }
        public VehicleDtoBuilder model(String model) { this.model = model; return this; }
        public VehicleDtoBuilder color(String color) { this.color = color; return this; }
        public VehicleDtoBuilder vehicleImageUrl(String vehicleImageUrl) { this.vehicleImageUrl = vehicleImageUrl; return this; }
        public VehicleDtoBuilder numberPlateImageUrl(String numberPlateImageUrl) { this.numberPlateImageUrl = numberPlateImageUrl; return this; }
        public VehicleDtoBuilder cleaningAreaImageUrl(String cleaningAreaImageUrl) { this.cleaningAreaImageUrl = cleaningAreaImageUrl; return this; }

        public VehicleDto build() {
            return new VehicleDto(id, userId, vehicleNumber, vehicleType, brand, model, color, vehicleImageUrl, numberPlateImageUrl, cleaningAreaImageUrl);
        }
    }
}
