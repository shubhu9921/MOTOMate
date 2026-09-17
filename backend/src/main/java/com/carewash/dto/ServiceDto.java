package com.carewash.dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceDto {
    private Long id;
    private String name;
    private String description;
    private Double price;
    private Integer durationMinutes;
    private Boolean active;
    private Double averageRating;
    private Long totalReviews;
    private String category;
    private String serviceType;
    private String vehicleTypeApplicability;
    private String imageUrl;
    private String features;
    private Integer displayOrder;
    private Boolean premiumFlag;

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

    public Double getAverageRating() { return averageRating; }
    public void setAverageRating(Double averageRating) { this.averageRating = averageRating; }

    public Long getTotalReviews() { return totalReviews; }
    public void setTotalReviews(Long totalReviews) { this.totalReviews = totalReviews; }

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

    public static ServiceDtoBuilder builder() {
        return new ServiceDtoBuilder();
    }

    public static class ServiceDtoBuilder {
        private Long id;
        private String name;
        private String description;
        private Double price;
        private Integer durationMinutes;
        private Boolean active;
        private Double averageRating;
        private Long totalReviews;
        private String category;
        private String serviceType;
        private String vehicleTypeApplicability;
        private String imageUrl;
        private String features;
        private Integer displayOrder;
        private Boolean premiumFlag;

        ServiceDtoBuilder() {}

        public ServiceDtoBuilder id(Long id) { this.id = id; return this; }
        public ServiceDtoBuilder name(String name) { this.name = name; return this; }
        public ServiceDtoBuilder description(String description) { this.description = description; return this; }
        public ServiceDtoBuilder price(Double price) { this.price = price; return this; }
        public ServiceDtoBuilder durationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; return this; }
        public ServiceDtoBuilder active(Boolean active) { this.active = active; return this; }
        public ServiceDtoBuilder averageRating(Double averageRating) { this.averageRating = averageRating; return this; }
        public ServiceDtoBuilder totalReviews(Long totalReviews) { this.totalReviews = totalReviews; return this; }
        public ServiceDtoBuilder category(String category) { this.category = category; return this; }
        public ServiceDtoBuilder serviceType(String serviceType) { this.serviceType = serviceType; return this; }
        public ServiceDtoBuilder vehicleTypeApplicability(String vehicleTypeApplicability) { this.vehicleTypeApplicability = vehicleTypeApplicability; return this; }
        public ServiceDtoBuilder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public ServiceDtoBuilder features(String features) { this.features = features; return this; }
        public ServiceDtoBuilder displayOrder(Integer displayOrder) { this.displayOrder = displayOrder; return this; }
        public ServiceDtoBuilder premiumFlag(Boolean premiumFlag) { this.premiumFlag = premiumFlag; return this; }

        public ServiceDto build() {
            ServiceDto serviceDto = new ServiceDto();
            serviceDto.setId(id);
            serviceDto.setName(name);
            serviceDto.setDescription(description);
            serviceDto.setPrice(price);
            serviceDto.setDurationMinutes(durationMinutes);
            serviceDto.setActive(active);
            serviceDto.setAverageRating(averageRating);
            serviceDto.setTotalReviews(totalReviews);
            serviceDto.setCategory(category);
            serviceDto.setServiceType(serviceType);
            serviceDto.setVehicleTypeApplicability(vehicleTypeApplicability);
            serviceDto.setImageUrl(imageUrl);
            serviceDto.setFeatures(features);
            serviceDto.setDisplayOrder(displayOrder);
            serviceDto.setPremiumFlag(premiumFlag);
            return serviceDto;
        }
    }
}
