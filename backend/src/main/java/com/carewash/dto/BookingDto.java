package com.carewash.dto;

import com.carewash.entity.BookingStatus;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
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
    
    // New fields for Operational visibility
    private String customerName;
    private String customerPhone;
    private String addressLine;
    private String city;
    private String state;
    private String pincode;
    private String vehicleImageUrl;

    private String serviceMode;
    private Boolean requiresPickup;
    private Boolean hasSocietyPermission;
    private Boolean hasWaterAvailability;
    private String serviceRequirements;
    private String verificationOtp;
    private Boolean isVerified;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Long getServiceId() { return serviceId; }
    public void setServiceId(Long serviceId) { this.serviceId = serviceId; }
    public String getServiceName() { return serviceName; }
    public void setServiceName(String serviceName) { this.serviceName = serviceName; }
    public Long getVehicleId() { return vehicleId; }
    public void setVehicleId(Long vehicleId) { this.vehicleId = vehicleId; }
    public String getVehicleNumber() { return vehicleNumber; }
    public void setVehicleNumber(String vehicleNumber) { this.vehicleNumber = vehicleNumber; }
    public String getVehicleName() { return vehicleName; }
    public void setVehicleName(String vehicleName) { this.vehicleName = vehicleName; }
    public Long getAddressId() { return addressId; }
    public void setAddressId(Long addressId) { this.addressId = addressId; }
    public LocalDate getBookingDate() { return bookingDate; }
    public void setBookingDate(LocalDate bookingDate) { this.bookingDate = bookingDate; }
    public LocalTime getBookingTime() { return bookingTime; }
    public void setBookingTime(LocalTime bookingTime) { this.bookingTime = bookingTime; }
    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }
    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public Long getServiceProviderId() { return serviceProviderId; }
    public void setServiceProviderId(Long serviceProviderId) { this.serviceProviderId = serviceProviderId; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
    
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }
    public String getAddressLine() { return addressLine; }
    public void setAddressLine(String addressLine) { this.addressLine = addressLine; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }
    public String getVehicleImageUrl() { return vehicleImageUrl; }
    public void setVehicleImageUrl(String vehicleImageUrl) { this.vehicleImageUrl = vehicleImageUrl; }

    public String getServiceMode() { return serviceMode; }
    public void setServiceMode(String serviceMode) { this.serviceMode = serviceMode; }
    public Boolean getRequiresPickup() { return requiresPickup; }
    public void setRequiresPickup(Boolean requiresPickup) { this.requiresPickup = requiresPickup; }
    public Boolean getHasSocietyPermission() { return hasSocietyPermission; }
    public void setHasSocietyPermission(Boolean hasSocietyPermission) { this.hasSocietyPermission = hasSocietyPermission; }
    public Boolean getHasWaterAvailability() { return hasWaterAvailability; }
    public void setHasWaterAvailability(Boolean hasWaterAvailability) { this.hasWaterAvailability = hasWaterAvailability; }
    public String getServiceRequirements() { return serviceRequirements; }
    public void setServiceRequirements(String serviceRequirements) { this.serviceRequirements = serviceRequirements; }
    public String getVerificationOtp() { return verificationOtp; }
    public void setVerificationOtp(String verificationOtp) { this.verificationOtp = verificationOtp; }
    public Boolean getIsVerified() { return isVerified; }
    public void setIsVerified(Boolean isVerified) { this.isVerified = isVerified; }
}
