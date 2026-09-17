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
@Table(name = "service_providers")
public class ServiceProvider {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false, unique = true)
    private String employeeCode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProviderStatus status = ProviderStatus.OFFLINE;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProviderSpecialization specialization = ProviderSpecialization.WASHER;

    private Double latitude;
    private Double longitude;
    private LocalDateTime locationUpdatedAt;
    
    @Column(columnDefinition = "TEXT")
    private String addressText;
    
    // Radius in kilometers
    private Double serviceAreaRadius = 10.0;
    
    @Column(nullable = false, columnDefinition = "boolean default true")
    private Boolean providesHomeService = true;
    
    @Column(nullable = false, columnDefinition = "boolean default true")
    private Boolean providesStationService = true;
    
    private String companyIdUrl;
    private String governmentIdUrl;
    private String profileImageUrl;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getEmployeeCode() { return employeeCode; }
    public void setEmployeeCode(String employeeCode) { this.employeeCode = employeeCode; }

    public ProviderStatus getStatus() { return status; }
    public void setStatus(ProviderStatus status) { this.status = status; }

    public ProviderSpecialization getSpecialization() { return specialization; }
    public void setSpecialization(ProviderSpecialization specialization) { this.specialization = specialization; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public LocalDateTime getLocationUpdatedAt() { return locationUpdatedAt; }
    public void setLocationUpdatedAt(LocalDateTime locationUpdatedAt) { this.locationUpdatedAt = locationUpdatedAt; }

    public String getAddressText() { return addressText; }
    public void setAddressText(String addressText) { this.addressText = addressText; }

    public Double getServiceAreaRadius() { return serviceAreaRadius; }
    public void setServiceAreaRadius(Double serviceAreaRadius) { this.serviceAreaRadius = serviceAreaRadius; }

    public Boolean getProvidesHomeService() { return providesHomeService; }
    public void setProvidesHomeService(Boolean providesHomeService) { this.providesHomeService = providesHomeService; }

    public Boolean getProvidesStationService() { return providesStationService; }
    public void setProvidesStationService(Boolean providesStationService) { this.providesStationService = providesStationService; }

    public String getCompanyIdUrl() { return companyIdUrl; }
    public void setCompanyIdUrl(String companyIdUrl) { this.companyIdUrl = companyIdUrl; }

    public String getGovernmentIdUrl() { return governmentIdUrl; }
    public void setGovernmentIdUrl(String governmentIdUrl) { this.governmentIdUrl = governmentIdUrl; }

    public String getProfileImageUrl() { return profileImageUrl; }
    public void setProfileImageUrl(String profileImageUrl) { this.profileImageUrl = profileImageUrl; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static ServiceProviderBuilder builder() {
        return new ServiceProviderBuilder();
    }

    public static class ServiceProviderBuilder {
        private Long id;
        private User user;
        private String employeeCode;
        private ProviderStatus status;
        private ProviderSpecialization specialization;
        private Double latitude;
        private Double longitude;
        private LocalDateTime locationUpdatedAt;
        private String addressText;
        private Double serviceAreaRadius;
        private Boolean providesHomeService;
        private Boolean providesStationService;
        private String companyIdUrl;
        private String governmentIdUrl;
        private String profileImageUrl;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        ServiceProviderBuilder() {}

        public ServiceProviderBuilder id(Long id) { this.id = id; return this; }
        public ServiceProviderBuilder user(User user) { this.user = user; return this; }
        public ServiceProviderBuilder employeeCode(String employeeCode) { this.employeeCode = employeeCode; return this; }
        public ServiceProviderBuilder status(ProviderStatus status) { this.status = status; return this; }
        public ServiceProviderBuilder specialization(ProviderSpecialization specialization) { this.specialization = specialization; return this; }
        public ServiceProviderBuilder latitude(Double latitude) { this.latitude = latitude; return this; }
        public ServiceProviderBuilder longitude(Double longitude) { this.longitude = longitude; return this; }
        public ServiceProviderBuilder locationUpdatedAt(LocalDateTime locationUpdatedAt) { this.locationUpdatedAt = locationUpdatedAt; return this; }
        public ServiceProviderBuilder addressText(String addressText) { this.addressText = addressText; return this; }
        public ServiceProviderBuilder serviceAreaRadius(Double serviceAreaRadius) { this.serviceAreaRadius = serviceAreaRadius; return this; }
        public ServiceProviderBuilder providesHomeService(Boolean providesHomeService) { this.providesHomeService = providesHomeService; return this; }
        public ServiceProviderBuilder providesStationService(Boolean providesStationService) { this.providesStationService = providesStationService; return this; }
        public ServiceProviderBuilder companyIdUrl(String companyIdUrl) { this.companyIdUrl = companyIdUrl; return this; }
        public ServiceProviderBuilder governmentIdUrl(String governmentIdUrl) { this.governmentIdUrl = governmentIdUrl; return this; }
        public ServiceProviderBuilder profileImageUrl(String profileImageUrl) { this.profileImageUrl = profileImageUrl; return this; }
        public ServiceProviderBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public ServiceProviderBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public ServiceProvider build() {
            ServiceProvider serviceProvider = new ServiceProvider();
            serviceProvider.setId(id);
            serviceProvider.setUser(user);
            serviceProvider.setEmployeeCode(employeeCode);
            if (status != null) {
                serviceProvider.setStatus(status);
            }
            if (specialization != null) {
                serviceProvider.setSpecialization(specialization);
            }
            serviceProvider.setLatitude(latitude);
            serviceProvider.setLongitude(longitude);
            serviceProvider.setLocationUpdatedAt(locationUpdatedAt);
            serviceProvider.setAddressText(addressText);
            if (serviceAreaRadius != null) {
                serviceProvider.setServiceAreaRadius(serviceAreaRadius);
            }
            if (providesHomeService != null) {
                serviceProvider.setProvidesHomeService(providesHomeService);
            }
            if (providesStationService != null) {
                serviceProvider.setProvidesStationService(providesStationService);
            }
            serviceProvider.setCompanyIdUrl(companyIdUrl);
            serviceProvider.setGovernmentIdUrl(governmentIdUrl);
            serviceProvider.setProfileImageUrl(profileImageUrl);
            serviceProvider.setCreatedAt(createdAt);
            serviceProvider.setUpdatedAt(updatedAt);
            return serviceProvider;
        }
    }
}
