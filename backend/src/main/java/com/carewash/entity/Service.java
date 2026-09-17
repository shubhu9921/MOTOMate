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
@Table(name = "services")
public class Service {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private Integer durationMinutes;

    @Column(nullable = false)
    private Boolean active = true;

    private String category;
    private String serviceType;
    private String vehicleTypeApplicability;
    private String imageUrl;
    
    @Column(columnDefinition = "TEXT")
    private String features;
    
    private Integer displayOrder;
    private Boolean premiumFlag = false;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getServiceType() { return serviceType; }
    public void setServiceType(String serviceType) { this.serviceType = serviceType; }

    public String getVehicleTypeApplicability() { return vehicleTypeApplicability; }
    public void setVehicleTypeApplicability(String vehicleTypeApplicability) { this.vehicleTypeApplicability = vehicleTypeApplicability; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getFeatures() { return features; }
    public void setFeatures(String features) { this.features = features; }

    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }

    public Boolean getPremiumFlag() { return premiumFlag; }
    public void setPremiumFlag(Boolean premiumFlag) { this.premiumFlag = premiumFlag; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static ServiceBuilder builder() {
        return new ServiceBuilder();
    }

    public static class ServiceBuilder {
        private Long id;
        private String name;
        private String description;
        private Double price;
        private Integer durationMinutes;
        private Boolean active;
        private String category;
        private String serviceType;
        private String vehicleTypeApplicability;
        private String imageUrl;
        private String features;
        private Integer displayOrder;
        private Boolean premiumFlag;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        ServiceBuilder() {}

        public ServiceBuilder id(Long id) { this.id = id; return this; }
        public ServiceBuilder name(String name) { this.name = name; return this; }
        public ServiceBuilder description(String description) { this.description = description; return this; }
        public ServiceBuilder price(Double price) { this.price = price; return this; }
        public ServiceBuilder durationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; return this; }
        public ServiceBuilder active(Boolean active) { this.active = active; return this; }
        public ServiceBuilder category(String category) { this.category = category; return this; }
        public ServiceBuilder serviceType(String serviceType) { this.serviceType = serviceType; return this; }
        public ServiceBuilder vehicleTypeApplicability(String vehicleTypeApplicability) { this.vehicleTypeApplicability = vehicleTypeApplicability; return this; }
        public ServiceBuilder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public ServiceBuilder features(String features) { this.features = features; return this; }
        public ServiceBuilder displayOrder(Integer displayOrder) { this.displayOrder = displayOrder; return this; }
        public ServiceBuilder premiumFlag(Boolean premiumFlag) { this.premiumFlag = premiumFlag; return this; }
        public ServiceBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public ServiceBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Service build() {
            Service service = new Service();
            service.setId(id);
            service.setName(name);
            service.setDescription(description);
            service.setPrice(price);
            service.setDurationMinutes(durationMinutes);
            if (active != null) {
                service.setActive(active);
            }
            service.setCategory(category);
            service.setServiceType(serviceType);
            service.setVehicleTypeApplicability(vehicleTypeApplicability);
            service.setImageUrl(imageUrl);
            service.setFeatures(features);
            service.setDisplayOrder(displayOrder);
            if (premiumFlag != null) {
                service.setPremiumFlag(premiumFlag);
            }
            service.setCreatedAt(createdAt);
            service.setUpdatedAt(updatedAt);
            return service;
        }
    }
}
