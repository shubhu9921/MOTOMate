package com.carewash.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", nullable = false)
    private Service service;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "address_id", nullable = false)
    private Address address;

    @Column(nullable = false)
    private LocalDate bookingDate;

    @Column(nullable = false)
    private LocalTime bookingTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status;

    @Column(nullable = false)
    private Double totalAmount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_provider_id")
    private ServiceProvider serviceProvider;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "varchar(20) default 'PENDING'")
    private AssignmentStatus assignmentStatus = AssignmentStatus.PENDING;

    @Column(nullable = false, columnDefinition = "int default 0")
    private Integer assignmentAttemptCount = 0;

    public ServiceProvider getServiceProvider() {
        return serviceProvider;
    }

    public void setServiceProvider(ServiceProvider serviceProvider) {
        this.serviceProvider = serviceProvider;
    }

    @OneToOne(mappedBy = "booking", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Payment payment;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(nullable = false, columnDefinition = "varchar(20) default 'STATION'")
    private String serviceMode = "STATION"; // HOME or STATION

    @Column(nullable = false, columnDefinition = "boolean default false")
    private Boolean requiresPickup = false;

    @Column(nullable = false, columnDefinition = "boolean default false")
    private Boolean hasSocietyPermission = false;

    @Column(nullable = false, columnDefinition = "boolean default false")
    private Boolean hasWaterAvailability = false;

    @Column(columnDefinition = "TEXT")
    private String serviceRequirements;

    private String verificationOtp;

    @Column(nullable = false, columnDefinition = "boolean default false")
    private Boolean isVerified = false;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public Service getService() { return service; }
    public void setService(Service service) { this.service = service; }
    
    public Vehicle getVehicle() { return vehicle; }
    public void setVehicle(Vehicle vehicle) { this.vehicle = vehicle; }
    
    public Address getAddress() { return address; }
    public void setAddress(Address address) { this.address = address; }
    
    public LocalDate getBookingDate() { return bookingDate; }
    public void setBookingDate(LocalDate bookingDate) { this.bookingDate = bookingDate; }
    
    public LocalTime getBookingTime() { return bookingTime; }
    public void setBookingTime(LocalTime bookingTime) { this.bookingTime = bookingTime; }
    
    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }
    
    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }
    
    public Payment getPayment() { return payment; }
    public void setPayment(Payment payment) { this.payment = payment; }
    
    public AssignmentStatus getAssignmentStatus() { return assignmentStatus; }
    public void setAssignmentStatus(AssignmentStatus assignmentStatus) { this.assignmentStatus = assignmentStatus; }

    public Integer getAssignmentAttemptCount() { return assignmentAttemptCount; }
    public void setAssignmentAttemptCount(Integer assignmentAttemptCount) { this.assignmentAttemptCount = assignmentAttemptCount; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
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
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static BookingBuilder builder() {
        return new BookingBuilder();
    }

    public static class BookingBuilder {
        private Long id;
        private User user;
        private Service service;
        private Vehicle vehicle;
        private Address address;
        private LocalDate bookingDate;
        private LocalTime bookingTime;
        private BookingStatus status;
        private Double totalAmount;
        private ServiceProvider serviceProvider;
        private AssignmentStatus assignmentStatus = AssignmentStatus.PENDING;
        private Integer assignmentAttemptCount = 0;
        private Payment payment;
        private String notes;
        private String serviceMode;
        private Boolean requiresPickup;
        private Boolean hasSocietyPermission;
        private Boolean hasWaterAvailability;
        private String serviceRequirements;
        private String verificationOtp;
        private Boolean isVerified;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        BookingBuilder() {}

        public BookingBuilder id(Long id) { this.id = id; return this; }
        public BookingBuilder user(User user) { this.user = user; return this; }
        public BookingBuilder service(Service service) { this.service = service; return this; }
        public BookingBuilder vehicle(Vehicle vehicle) { this.vehicle = vehicle; return this; }
        public BookingBuilder address(Address address) { this.address = address; return this; }
        public BookingBuilder bookingDate(LocalDate bookingDate) { this.bookingDate = bookingDate; return this; }
        public BookingBuilder bookingTime(LocalTime bookingTime) { this.bookingTime = bookingTime; return this; }
        public BookingBuilder status(BookingStatus status) { this.status = status; return this; }
        public BookingBuilder totalAmount(Double totalAmount) { this.totalAmount = totalAmount; return this; }
        public BookingBuilder serviceProvider(ServiceProvider serviceProvider) { this.serviceProvider = serviceProvider; return this; }
        public BookingBuilder assignmentStatus(AssignmentStatus assignmentStatus) { this.assignmentStatus = assignmentStatus; return this; }
        public BookingBuilder assignmentAttemptCount(Integer assignmentAttemptCount) { this.assignmentAttemptCount = assignmentAttemptCount; return this; }
        public BookingBuilder payment(Payment payment) { this.payment = payment; return this; }
        public BookingBuilder notes(String notes) { this.notes = notes; return this; }
        public BookingBuilder serviceMode(String serviceMode) { this.serviceMode = serviceMode; return this; }
        public BookingBuilder requiresPickup(Boolean requiresPickup) { this.requiresPickup = requiresPickup; return this; }
        public BookingBuilder hasSocietyPermission(Boolean hasSocietyPermission) { this.hasSocietyPermission = hasSocietyPermission; return this; }
        public BookingBuilder hasWaterAvailability(Boolean hasWaterAvailability) { this.hasWaterAvailability = hasWaterAvailability; return this; }
        public BookingBuilder serviceRequirements(String serviceRequirements) { this.serviceRequirements = serviceRequirements; return this; }
        public BookingBuilder verificationOtp(String verificationOtp) { this.verificationOtp = verificationOtp; return this; }
        public BookingBuilder isVerified(Boolean isVerified) { this.isVerified = isVerified; return this; }
        public BookingBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public BookingBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Booking build() {
            Booking booking = new Booking();
            booking.setId(id);
            booking.setUser(user);
            booking.setService(service);
            booking.setVehicle(vehicle);
            booking.setAddress(address);
            booking.setBookingDate(bookingDate);
            booking.setBookingTime(bookingTime);
            booking.setStatus(status);
            booking.setTotalAmount(totalAmount);
            booking.setServiceProvider(serviceProvider);
            if (assignmentStatus != null) { booking.setAssignmentStatus(assignmentStatus); }
            if (assignmentAttemptCount != null) { booking.setAssignmentAttemptCount(assignmentAttemptCount); }
            booking.setPayment(payment);
            booking.setNotes(notes);
            if (serviceMode != null) { booking.setServiceMode(serviceMode); }
            if (requiresPickup != null) { booking.setRequiresPickup(requiresPickup); }
            if (hasSocietyPermission != null) { booking.setHasSocietyPermission(hasSocietyPermission); }
            if (hasWaterAvailability != null) { booking.setHasWaterAvailability(hasWaterAvailability); }
            booking.setServiceRequirements(serviceRequirements);
            booking.setVerificationOtp(verificationOtp);
            if (isVerified != null) { booking.setIsVerified(isVerified); }
            booking.setCreatedAt(createdAt);
            booking.setUpdatedAt(updatedAt);
            return booking;
        }
    }
}
