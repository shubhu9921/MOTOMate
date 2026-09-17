package com.carewash.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "vehicles")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String vehicleNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VehicleType vehicleType;

    @Column(nullable = false)
    private String brand;

    @Column(nullable = false)
    private String model;

    @Column(nullable = false)
    private String color;

    @Column(columnDefinition = "LONGTEXT")
    private String vehicleImageUrl;

    @Column(columnDefinition = "LONGTEXT")
    private String numberPlateImageUrl;

    @Column(columnDefinition = "LONGTEXT")
    private String cleaningAreaImageUrl;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
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
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static VehicleBuilder builder() {
        return new VehicleBuilder();
    }

    public static class VehicleBuilder {
        private Long id;
        private User user;
        private String vehicleNumber;
        private VehicleType vehicleType;
        private String brand;
        private String model;
        private String color;
        private String vehicleImageUrl;
        private String numberPlateImageUrl;
        private String cleaningAreaImageUrl;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        VehicleBuilder() {}

        public VehicleBuilder id(Long id) { this.id = id; return this; }
        public VehicleBuilder user(User user) { this.user = user; return this; }
        public VehicleBuilder vehicleNumber(String vehicleNumber) { this.vehicleNumber = vehicleNumber; return this; }
        public VehicleBuilder vehicleType(VehicleType vehicleType) { this.vehicleType = vehicleType; return this; }
        public VehicleBuilder brand(String brand) { this.brand = brand; return this; }
        public VehicleBuilder model(String model) { this.model = model; return this; }
        public VehicleBuilder color(String color) { this.color = color; return this; }
        public VehicleBuilder vehicleImageUrl(String vehicleImageUrl) { this.vehicleImageUrl = vehicleImageUrl; return this; }
        public VehicleBuilder numberPlateImageUrl(String numberPlateImageUrl) { this.numberPlateImageUrl = numberPlateImageUrl; return this; }
        public VehicleBuilder cleaningAreaImageUrl(String cleaningAreaImageUrl) { this.cleaningAreaImageUrl = cleaningAreaImageUrl; return this; }
        public VehicleBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public VehicleBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Vehicle build() {
            Vehicle v = new Vehicle();
            v.setId(id);
            v.setUser(user);
            v.setVehicleNumber(vehicleNumber);
            v.setVehicleType(vehicleType);
            v.setBrand(brand);
            v.setModel(model);
            v.setColor(color);
            v.setVehicleImageUrl(vehicleImageUrl);
            v.setNumberPlateImageUrl(numberPlateImageUrl);
            v.setCleaningAreaImageUrl(cleaningAreaImageUrl);
            v.setCreatedAt(createdAt);
            v.setUpdatedAt(updatedAt);
            return v;
        }
    }
}
