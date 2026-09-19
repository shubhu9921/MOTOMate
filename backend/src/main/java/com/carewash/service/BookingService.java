package com.carewash.service;

import com.carewash.dto.BookingDto;
import com.carewash.dto.BookingRequest;
import com.carewash.entity.*;
import com.carewash.exception.BadRequestException;
import com.carewash.exception.ResourceNotFoundException;
import com.carewash.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ServiceRepository serviceRepository;
    
    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private BookingStatusHistoryRepository historyRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private ServiceProviderRepository providerRepository;

    @Autowired
    private ProviderSlotRepository providerSlotRepository;

    @Autowired
    private AssignmentService assignmentService;

    @Autowired
    private SubscriptionUsageService subscriptionUsageService;

    @Transactional
    public BookingDto createBooking(String email, BookingRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
                
        com.carewash.entity.Service service = serviceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));
                
        if (!service.getActive()) {
            throw new BadRequestException("Service is not active");
        }
                
        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));

        if (!vehicle.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Vehicle does not belong to user");
        }

        Address address = addressRepository.findById(request.getAddressId())
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));
                
        if (!address.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Address does not belong to user");
        }
        
        double totalAmount = service.getPrice();
        boolean isSubscriptionBooking = subscriptionUsageService.isServiceIncluded(user.getId(), service.getId());
        if (isSubscriptionBooking) {
            totalAmount = 0.0;
        } else {
            double discount = subscriptionUsageService.getServiceDiscount(user.getId(), service.getId());
            if (discount > 0) {
                totalAmount = totalAmount - (totalAmount * discount / 100.0);
            }
        }
        
        Booking booking = Booking.builder()
                .user(user)
                .service(service)
                .vehicle(vehicle)
                .address(address)
                .bookingDate(request.getBookingDate())
                .bookingTime(request.getBookingTime())
                .status(BookingStatus.PENDING)
                .totalAmount(totalAmount)
                .notes(request.getNotes())
                .serviceMode(request.getServiceMode() != null ? request.getServiceMode() : "STATION")
                .requiresPickup(request.getRequiresPickup() != null ? request.getRequiresPickup() : false)
                .hasSocietyPermission(request.getHasSocietyPermission() != null ? request.getHasSocietyPermission() : false)
                .hasWaterAvailability(request.getHasWaterAvailability() != null ? request.getHasWaterAvailability() : false)
                .serviceRequirements(request.getServiceRequirements())
                .verificationOtp(generateOtp())
                .isVerified(false)
                .build();
                
        // Provider assignment is now handled by AssignmentService
        // Ignore any frontend providerId and slotId

        Booking savedBooking = bookingRepository.save(booking);

        // Create Payment
        Payment payment = Payment.builder()
                .booking(savedBooking)
                .amount(savedBooking.getTotalAmount())
                .method(PaymentMethod.CASH)
                .status(PaymentStatus.PENDING)
                .build();
        paymentRepository.save(payment);
        
        savedBooking.setPayment(payment);

        // History
        logStatusHistory(savedBooking, null, BookingStatus.PENDING, user, "Booking created");

        // Notification
        notificationService.createNotification(user, "Booking Created", 
            "Your booking for " + service.getName() + " has been received.", NotificationType.BOOKING_CREATED);

        // Auto-Assign Technician
        assignmentService.assignTechnicianToBooking(savedBooking);

        return mapToDto(savedBooking);
    }

    public List<BookingDto> getUserBookings(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
                
        return bookingRepository.findByUserId(user.getId()).stream()
                .map(this::mapToDto).collect(Collectors.toList());
    }

    public BookingDto getBookingById(String email, Long id) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
                
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
                
        if (!booking.getUser().getId().equals(user.getId()) && !user.getRole().name().equals("ADMIN")) {
            throw new BadRequestException("Unauthorized to view this booking");
        }
        
        return mapToDto(booking);
    }
    
    @Transactional
    public BookingDto cancelBooking(String email, Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
                
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
                
        if (!booking.getUser().getId().equals(user.getId()) && !user.getRole().name().equals("ADMIN")) {
            throw new BadRequestException("Unauthorized to cancel this booking");
        }
        
        if (booking.getStatus() == BookingStatus.COMPLETED || booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Cannot cancel booking in status: " + booking.getStatus());
        }

        BookingStatus oldStatus = booking.getStatus();
        booking.setStatus(BookingStatus.CANCELLED);
        Booking savedBooking = bookingRepository.save(booking);

        logStatusHistory(savedBooking, oldStatus, BookingStatus.CANCELLED, user, "Booking cancelled by user");

        notificationService.createNotification(booking.getUser(), "Booking Cancelled", 
            "Your booking #" + booking.getId() + " has been cancelled.", NotificationType.BOOKING_CANCELLED);

        if (savedBooking.getServiceProvider() != null) {
            notificationService.createNotification(savedBooking.getServiceProvider().getUser(), "Job Cancelled", 
                "Assigned booking #" + booking.getId() + " was cancelled.", NotificationType.BOOKING_CANCELLED);
        }

        return mapToDto(savedBooking);
    }

    @Transactional
    public void updateStatus(Long bookingId, BookingStatus newStatus, User updatedBy) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        BookingStatus oldStatus = booking.getStatus();
        
        validateTransition(oldStatus, newStatus, updatedBy);

        booking.setStatus(newStatus);
        
        if (newStatus == BookingStatus.COMPLETED) {
            if (booking.getTotalAmount() == 0.0) {
                try {
                    subscriptionUsageService.consumeWash(booking.getUser().getId(), booking, booking.getService(), booking.getVehicle());
                } catch (Exception e) {
                    System.err.println("Failed to consume wash: " + e.getMessage());
                }
            }
            if (booking.getPayment() != null && booking.getPayment().getMethod() == PaymentMethod.CASH) {
                booking.getPayment().setStatus(PaymentStatus.PAID);
                paymentRepository.save(booking.getPayment());
            }
        }

        Booking savedBooking = bookingRepository.save(booking);

        logStatusHistory(savedBooking, oldStatus, newStatus, updatedBy, "Status updated to " + newStatus);

        sendNotificationsForStatus(savedBooking, newStatus);
    }

    private void validateTransition(BookingStatus oldStatus, BookingStatus newStatus, User updatedBy) {
        if (oldStatus == newStatus) return;

        if (oldStatus == BookingStatus.COMPLETED || oldStatus == BookingStatus.CANCELLED) {
            throw new BadRequestException("Cannot transition from final status: " + oldStatus);
        }

        if (updatedBy.getRole() == Role.SERVICE_PROVIDER) {
            if (!(oldStatus == BookingStatus.ASSIGNED && newStatus == BookingStatus.ON_THE_WAY) &&
                !(oldStatus == BookingStatus.ON_THE_WAY && newStatus == BookingStatus.IN_PROGRESS) &&
                !(oldStatus == BookingStatus.IN_PROGRESS && newStatus == BookingStatus.COMPLETED)) {
                throw new BadRequestException("Invalid status transition for provider: " + oldStatus + " to " + newStatus);
            }
        }
    }

    private void sendNotificationsForStatus(Booking booking, BookingStatus newStatus) {
        switch (newStatus) {
            case CONFIRMED:
                notificationService.createNotification(booking.getUser(), "Booking Confirmed", 
                    "Your booking #" + booking.getId() + " has been confirmed.", NotificationType.BOOKING_CONFIRMED);
                break;
            case ASSIGNED:
                notificationService.createNotification(booking.getUser(), "Provider Assigned", 
                    "A service provider has been assigned to your booking.", NotificationType.PROVIDER_ASSIGNED);
                if (booking.getServiceProvider() != null) {
                    notificationService.createNotification(booking.getServiceProvider().getUser(), "New Job Assigned", 
                        "You have been assigned to booking #" + booking.getId(), NotificationType.PROVIDER_ASSIGNED);
                }
                break;
            case ON_THE_WAY:
                notificationService.createNotification(booking.getUser(), "Provider On The Way", 
                    "Your service provider is on the way to your location.", NotificationType.PROVIDER_ON_THE_WAY);
                break;
            case IN_PROGRESS:
                notificationService.createNotification(booking.getUser(), "Service Started", 
                    "Your car wash service has started.", NotificationType.SERVICE_STARTED);
                break;
            case COMPLETED:
                notificationService.createNotification(booking.getUser(), "Service Completed", 
                    "Your service is complete. Thank you for using MotoMate!", NotificationType.SERVICE_COMPLETED);
                break;
            default:
                break;
        }
    }

    private String generateOtp() {
        return String.format("%04d", new java.util.Random().nextInt(10000));
    }

    @Transactional
    public boolean verifyBookingOtp(Long bookingId, String otp) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        
        if (booking.getVerificationOtp() != null && booking.getVerificationOtp().equals(otp)) {
            booking.setIsVerified(true);
            bookingRepository.save(booking);
            return true;
        }
        return false;
    }

    public void logStatusHistory(Booking booking, BookingStatus oldStatus, BookingStatus newStatus, User changedBy, String remarks) {
        BookingStatusHistory history = new BookingStatusHistory();
        history.setBooking(booking);
        history.setOldStatus(oldStatus != null ? oldStatus : newStatus);
        history.setNewStatus(newStatus);
        history.setChangedBy(changedBy);
        history.setRemarks(remarks);
        historyRepository.save(history);
    }

    public BookingDto mapToDto(Booking booking) {
        BookingDto dto = new BookingDto();
        dto.setId(booking.getId());
        dto.setUserId(booking.getUser().getId());
        dto.setServiceId(booking.getService().getId());
        dto.setServiceName(booking.getService().getName());
        dto.setVehicleId(booking.getVehicle().getId());
        dto.setVehicleNumber(booking.getVehicle().getVehicleNumber());
        dto.setVehicleName(booking.getVehicle().getBrand() + " " + booking.getVehicle().getModel());
        dto.setAddressId(booking.getAddress().getId());
        dto.setBookingDate(booking.getBookingDate());
        dto.setBookingTime(booking.getBookingTime());
        dto.setStatus(booking.getStatus());
        dto.setTotalAmount(booking.getTotalAmount());
        dto.setNotes(booking.getNotes());
        dto.setServiceProviderId(booking.getServiceProvider() != null ? booking.getServiceProvider().getId() : null);
        dto.setPaymentMethod(booking.getPayment() != null ? booking.getPayment().getMethod().name() : null);
        dto.setPaymentStatus(booking.getPayment() != null ? booking.getPayment().getStatus().name() : null);
        
        // Populate newly added fields
        if (booking.getUser() != null) {
            dto.setCustomerName(booking.getUser().getName());
            dto.setCustomerPhone(booking.getUser().getPhone());
        }
        if (booking.getAddress() != null) {
            dto.setAddressLine(booking.getAddress().getAddressLine());
            dto.setCity(booking.getAddress().getCity());
            dto.setState(booking.getAddress().getState());
            dto.setPincode(booking.getAddress().getPincode());
        }
        if (booking.getVehicle() != null) {
            dto.setVehicleImageUrl(booking.getVehicle().getVehicleImageUrl());
        }
        
        dto.setServiceMode(booking.getServiceMode());
        dto.setRequiresPickup(booking.getRequiresPickup());
        dto.setHasSocietyPermission(booking.getHasSocietyPermission());
        dto.setHasWaterAvailability(booking.getHasWaterAvailability());
        dto.setServiceRequirements(booking.getServiceRequirements());
        dto.setVerificationOtp(booking.getVerificationOtp());
        dto.setIsVerified(booking.getIsVerified());
        
        return dto;
    }
}
