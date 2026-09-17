package com.carewash.dto;

import com.carewash.entity.ProviderSpecialization;
import com.carewash.entity.ProviderStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProviderDto {
    private Long id;
    private Long userId;
    private String name;
    private String email;
    private String phone;
    private String employeeCode;
    private ProviderStatus status;
    private ProviderSpecialization specialization;
    private Double latitude;
    private Double longitude;
    private String addressText;
    private Double distanceKm; // Calculated field when fetching nearby
    private Boolean providesHomeService;
    private Boolean providesStationService;
    private String companyIdUrl;
    private String governmentIdUrl;
    private String profileImageUrl;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
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
    public String getAddressText() { return addressText; }
    public void setAddressText(String addressText) { this.addressText = addressText; }
    public Double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(Double distanceKm) { this.distanceKm = distanceKm; }
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
}
