package com.carewash.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class BookingRequest {
    @NotNull(message = "Service ID is required")
    @Positive(message = "Service ID must be positive")
    private Long serviceId;

    @NotNull(message = "Vehicle ID is required")
    @Positive(message = "Vehicle ID must be positive")
    private Long vehicleId;

    @NotNull(message = "Address ID is required")
    @Positive(message = "Address ID must be positive")
    private Long addressId;

    @NotNull(message = "Booking date is required")
    @FutureOrPresent(message = "Booking date cannot be in the past")
    private LocalDate bookingDate;

    @NotNull(message = "Booking time is required")
    private LocalTime bookingTime;

    @Size(max = 500, message = "Notes cannot exceed 500 characters")
    private String notes;

    private Long slotId;

    private String serviceMode;
    private Boolean requiresPickup;
    private Boolean hasSocietyPermission;
    private Boolean hasWaterAvailability;
    private String serviceRequirements;
    private Boolean useSubscription;

    public Long getServiceId() { return serviceId; }
    public void setServiceId(Long serviceId) { this.serviceId = serviceId; }

    public Long getVehicleId() { return vehicleId; }
    public void setVehicleId(Long vehicleId) { this.vehicleId = vehicleId; }

    public Long getAddressId() { return addressId; }
    public void setAddressId(Long addressId) { this.addressId = addressId; }

    public LocalDate getBookingDate() { return bookingDate; }
    public void setBookingDate(LocalDate bookingDate) { this.bookingDate = bookingDate; }

    public LocalTime getBookingTime() { return bookingTime; }
    public void setBookingTime(LocalTime bookingTime) { this.bookingTime = bookingTime; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Long getSlotId() { return slotId; }
    public void setSlotId(Long slotId) { this.slotId = slotId; }

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

    public Boolean getUseSubscription() { return useSubscription; }
    public void setUseSubscription(Boolean useSubscription) { this.useSubscription = useSubscription; }

    public static BookingRequestBuilder builder() {
        return new BookingRequestBuilder();
    }

    public static class BookingRequestBuilder {
        private Long serviceId;
        private Long vehicleId;
        private Long addressId;
        private LocalDate bookingDate;
        private LocalTime bookingTime;
        private String notes;
        private Long slotId;
        private String serviceMode;
        private Boolean requiresPickup;
        private Boolean hasSocietyPermission;
        private Boolean hasWaterAvailability;
        private String serviceRequirements;
        private Boolean useSubscription;

        BookingRequestBuilder() {}

        public BookingRequestBuilder serviceId(Long serviceId) { this.serviceId = serviceId; return this; }
        public BookingRequestBuilder vehicleId(Long vehicleId) { this.vehicleId = vehicleId; return this; }
        public BookingRequestBuilder addressId(Long addressId) { this.addressId = addressId; return this; }
        public BookingRequestBuilder bookingDate(LocalDate bookingDate) { this.bookingDate = bookingDate; return this; }
        public BookingRequestBuilder bookingTime(LocalTime bookingTime) { this.bookingTime = bookingTime; return this; }
        public BookingRequestBuilder notes(String notes) { this.notes = notes; return this; }
        public BookingRequestBuilder slotId(Long slotId) { this.slotId = slotId; return this; }
        public BookingRequestBuilder serviceMode(String serviceMode) { this.serviceMode = serviceMode; return this; }
        public BookingRequestBuilder requiresPickup(Boolean requiresPickup) { this.requiresPickup = requiresPickup; return this; }
        public BookingRequestBuilder hasSocietyPermission(Boolean hasSocietyPermission) { this.hasSocietyPermission = hasSocietyPermission; return this; }
        public BookingRequestBuilder hasWaterAvailability(Boolean hasWaterAvailability) { this.hasWaterAvailability = hasWaterAvailability; return this; }
        public BookingRequestBuilder serviceRequirements(String serviceRequirements) { this.serviceRequirements = serviceRequirements; return this; }
        public BookingRequestBuilder useSubscription(Boolean useSubscription) { this.useSubscription = useSubscription; return this; }

        public BookingRequest build() {
            BookingRequest bookingRequest = new BookingRequest();
            bookingRequest.setServiceId(serviceId);
            bookingRequest.setVehicleId(vehicleId);
            bookingRequest.setAddressId(addressId);
            bookingRequest.setBookingDate(bookingDate);
            bookingRequest.setBookingTime(bookingTime);
            bookingRequest.setNotes(notes);
            bookingRequest.setSlotId(slotId);
            bookingRequest.setServiceMode(serviceMode);
            bookingRequest.setRequiresPickup(requiresPickup);
            bookingRequest.setHasSocietyPermission(hasSocietyPermission);
            bookingRequest.setHasWaterAvailability(hasWaterAvailability);
            bookingRequest.setServiceRequirements(serviceRequirements);
            bookingRequest.setUseSubscription(useSubscription);
            return bookingRequest;
        }
    }
}
