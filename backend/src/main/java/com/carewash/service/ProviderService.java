package com.carewash.service;

import com.carewash.dto.BookingDto;
import com.carewash.entity.BookingStatus;
import com.carewash.entity.ProviderStatus;
import com.carewash.entity.ServiceProvider;
import com.carewash.entity.User;
import com.carewash.exception.ResourceNotFoundException;
import com.carewash.repository.BookingRepository;
import com.carewash.repository.ServiceProviderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import com.carewash.dto.ProviderDto;
import com.carewash.dto.ProviderSlotDto;
import com.carewash.dto.TechnicianAssignmentDto;
import com.carewash.entity.ProviderSlot;
import com.carewash.entity.AssignmentStatus;
import com.carewash.entity.TechnicianAssignment;
import com.carewash.entity.Payment;
import com.carewash.entity.PaymentMethod;
import com.carewash.entity.PaymentStatus;
import com.carewash.repository.ProviderSlotRepository;
import com.carewash.repository.TechnicianAssignmentRepository;
import com.carewash.repository.PaymentRepository;

@Service
public class ProviderService {

    @Autowired
    private ServiceProviderRepository providerRepository;
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private BookingService bookingService;

    @Autowired
    private ProviderSlotRepository slotRepository;

    @Autowired
    private TechnicianAssignmentRepository assignmentRepository;

    @Autowired
    private AssignmentService assignmentService;

    @Autowired
    private PaymentRepository paymentRepository;

    public ServiceProvider getProviderByUser(User user) {
        return providerRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Service Provider profile not found"));
    }

    public Page<BookingDto> getProviderBookings(User user, Pageable pageable) {
        ServiceProvider provider = getProviderByUser(user);
        return bookingRepository.findByServiceProviderIdOrderByBookingDateAscBookingTimeAsc(provider.getId(), pageable)
                .map(bookingService::mapToDto);
    }

    @Transactional
    public void updateBookingStatus(User user, Long bookingId, BookingStatus newStatus) {
        ServiceProvider provider = getProviderByUser(user);
        
        // This validates if provider is assigned to booking?
        // Wait, bookingService.updateStatus currently doesn't check if provider owns the booking!
        // We should validate ownership here.
        com.carewash.entity.Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
                
        if (booking.getServiceProvider() == null || !booking.getServiceProvider().getId().equals(provider.getId())) {
            throw new RuntimeException("Unauthorized to modify this booking");
        }
        
        bookingService.updateStatus(bookingId, newStatus, user);
        
        // Update provider availability based on job status
        if (newStatus == BookingStatus.COMPLETED || newStatus == BookingStatus.CANCELLED) {
            // Check if they have other active jobs? Simple logic: if completed, set to AVAILABLE.
            long activeJobs = bookingRepository.countByServiceProviderIdAndStatus(provider.getId(), BookingStatus.IN_PROGRESS);
            if (activeJobs == 0) {
                provider.setStatus(ProviderStatus.AVAILABLE);
                providerRepository.save(provider);
            }
        } else if (newStatus == BookingStatus.IN_PROGRESS || newStatus == BookingStatus.ON_THE_WAY) {
            provider.setStatus(ProviderStatus.BUSY);
            providerRepository.save(provider);
        }
    }

    @Transactional
    public boolean verifyBookingOtp(User user, Long bookingId, String otp) {
        ServiceProvider provider = getProviderByUser(user);
        com.carewash.entity.Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
                
        if (booking.getServiceProvider() == null || !booking.getServiceProvider().getId().equals(provider.getId())) {
            throw new RuntimeException("Unauthorized to modify this booking");
        }
        
        return bookingService.verifyBookingOtp(bookingId, otp);
    }

    public List<ProviderDto> getNearbyProviders(Double latitude, Double longitude, Double maxRadiusKm) {
        List<ServiceProvider> allProviders = providerRepository.findAll();
        List<ProviderDto> nearby = new ArrayList<>();
        
        for (ServiceProvider p : allProviders) {
            if (p.getLatitude() != null && p.getLongitude() != null) {
                double distance = calculateHaversineDistance(latitude, longitude, p.getLatitude(), p.getLongitude());
                if (distance <= (p.getServiceAreaRadius() != null ? p.getServiceAreaRadius() : maxRadiusKm)) {
                    nearby.add(ProviderDto.builder()
                        .id(p.getId())
                        .userId(p.getUser().getId())
                        .name(p.getUser().getName())
                        .specialization(p.getSpecialization())
                        .status(p.getStatus())
                        .latitude(p.getLatitude())
                        .longitude(p.getLongitude())
                        .addressText(p.getAddressText())
                        .distanceKm(Math.round(distance * 10.0) / 10.0)
                        .providesHomeService(p.getProvidesHomeService())
                        .providesStationService(p.getProvidesStationService())
                        .companyIdUrl(p.getCompanyIdUrl())
                        .governmentIdUrl(p.getGovernmentIdUrl())
                        .profileImageUrl(p.getProfileImageUrl())
                        .build());
                }
            }
        }
        nearby.sort(Comparator.comparing(ProviderDto::getDistanceKm));
        return nearby;
    }

    private double calculateHaversineDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Radius of the earth in km
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    public List<ProviderSlotDto> getAvailableSlots(Long providerId, LocalDate date) {
        generateMockSlots(providerId, date); // Auto-generate slots for testing
        return slotRepository.findByProviderIdAndSlotDateAndIsBookedFalse(providerId, date).stream()
            .map(slot -> ProviderSlotDto.builder()
                .id(slot.getId())
                .providerId(slot.getProvider().getId())
                .slotDate(slot.getSlotDate())
                .startTime(slot.getStartTime())
                .endTime(slot.getEndTime())
                .isBooked(slot.isBooked())
                .build())
            .collect(Collectors.toList());
    }
    
    private void generateMockSlots(Long providerId, LocalDate date) {
        ServiceProvider provider = providerRepository.findById(providerId).orElseThrow();
        if (slotRepository.findByProviderIdAndSlotDate(providerId, date).isEmpty()) {
            for (int i = 9; i <= 17; i += 2) { 
                ProviderSlot slot = new ProviderSlot();
                slot.setProvider(provider);
                slot.setSlotDate(date);
                slot.setStartTime(LocalTime.of(i, 0));
                slot.setEndTime(LocalTime.of(i+2, 0));
                slot.setBooked(false);
                slotRepository.save(slot);
            }
        }
    }

    public void updateLocation(User user, Double lat, Double lng) {
        ServiceProvider provider = getProviderByUser(user);
        provider.setLatitude(lat);
        provider.setLongitude(lng);
        provider.setLocationUpdatedAt(java.time.LocalDateTime.now());
        providerRepository.save(provider);
    }

    public List<TechnicianAssignmentDto> getPendingAssignments(User user) {
        ServiceProvider provider = getProviderByUser(user);
        List<TechnicianAssignment> assignments = assignmentRepository.findByServiceProviderIdAndStatus(provider.getId(), AssignmentStatus.PENDING);
        return assignments.stream().map(a -> TechnicianAssignmentDto.builder()
                .id(a.getId())
                .bookingId(a.getBooking().getId())
                .providerId(a.getServiceProvider().getId())
                .status(a.getStatus().name())
                .distanceKm(a.getDistanceKm())
                .isMandatory(a.getIsMandatory())
                .assignedAt(a.getAssignedAt())
                .serviceName(a.getBooking().getService().getName())
                .customerName(a.getBooking().getUser().getName())
                .addressLine(a.getBooking().getAddress().getAddressLine())
                .city(a.getBooking().getAddress().getCity())
                .pincode(a.getBooking().getAddress().getPincode())
                .vehicleName(a.getBooking().getVehicle().getBrand() + " " + a.getBooking().getVehicle().getModel())
                .vehicleNumber(a.getBooking().getVehicle().getVehicleNumber())
                .bookingDate(a.getBooking().getBookingDate().toString())
                .bookingTime(a.getBooking().getBookingTime().toString())
                .totalAmount(a.getBooking().getTotalAmount())
                .build()).collect(Collectors.toList());
    }

    @Transactional
    public void respondToAssignment(User user, Long assignmentId, String statusStr, String reason) {
        ServiceProvider provider = getProviderByUser(user);
        TechnicianAssignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found"));
        
        if (!assignment.getServiceProvider().getId().equals(provider.getId())) {
            throw new RuntimeException("Unauthorized to respond to this assignment");
        }

        AssignmentStatus newStatus = AssignmentStatus.valueOf(statusStr);
        
        if (assignment.getIsMandatory() && newStatus == AssignmentStatus.REJECTED) {
            throw new RuntimeException("Cannot reject a mandatory assignment within 5 KM");
        }

        assignment.setStatus(newStatus);
        assignment.setRespondedAt(java.time.LocalDateTime.now());
        assignment.setRejectionReason(reason);
        assignmentRepository.save(assignment);

        com.carewash.entity.Booking booking = assignment.getBooking();
        
        if (newStatus == AssignmentStatus.ACCEPTED) {
            booking.setAssignmentStatus(AssignmentStatus.ACCEPTED);
            booking.setStatus(BookingStatus.CONFIRMED);
            bookingRepository.save(booking);
        } else if (newStatus == AssignmentStatus.REJECTED) {
            // Trigger reassignment
            assignmentService.assignTechnicianToBooking(booking);
        }
    }

    @Transactional
    public void recordOfflinePayment(User user, Long bookingId, Double amountReceived, String paymentMethod) {
        ServiceProvider provider = getProviderByUser(user);
        com.carewash.entity.Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
                
        if (booking.getServiceProvider() == null || !booking.getServiceProvider().getId().equals(provider.getId())) {
            throw new RuntimeException("Unauthorized to modify payment for this booking");
        }

        Payment payment = booking.getPayment();
        if (payment == null) {
            throw new RuntimeException("Payment record not found");
        }

        if (Math.abs(amountReceived - payment.getAmount()) > 0.01) {
            throw new RuntimeException("Received amount does not match amount due. Expected: " + payment.getAmount());
        }

        payment.setAmountReceived(amountReceived);
        payment.setReceivedAt(java.time.LocalDateTime.now());
        payment.setReceivedBy(user);
        payment.setMethod(PaymentMethod.valueOf(paymentMethod));
        payment.setStatus(PaymentStatus.PAID);
        paymentRepository.save(payment);
        
        // Ensure booking is completed
        bookingService.updateStatus(bookingId, BookingStatus.COMPLETED, user);
    }
}
