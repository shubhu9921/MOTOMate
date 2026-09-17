package com.carewash.service;

import com.carewash.entity.*;
import com.carewash.repository.BookingRepository;
import com.carewash.repository.ServiceProviderRepository;
import com.carewash.repository.TechnicianAssignmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AssignmentService {

    private static final double MANDATORY_RADIUS_KM = 5.0;
    private static final int STALE_LOCATION_HOURS = 1;

    @Autowired
    private ServiceProviderRepository providerRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private TechnicianAssignmentRepository assignmentRepository;

    @Autowired
    private NotificationService notificationService;

    @Transactional
    public void assignTechnicianToBooking(Booking booking) {
        if (booking.getAssignmentStatus() == AssignmentStatus.ACCEPTED) {
            return; // Already accepted
        }

        List<ServiceProvider> availableProviders = providerRepository.findByStatus(ProviderStatus.AVAILABLE);
        
        List<TechnicianAssignment> previousAttempts = assignmentRepository.findByBookingId(booking.getId());
        List<Long> rejectedProviderIds = previousAttempts.stream()
                .filter(a -> a.getStatus() == AssignmentStatus.REJECTED)
                .map(a -> a.getServiceProvider().getId())
                .collect(Collectors.toList());

        List<ProviderCandidate> candidates = availableProviders.stream()
                .filter(p -> !rejectedProviderIds.contains(p.getId()))
                .filter(p -> supportsServiceMode(p, booking.getServiceMode()))
                .filter(p -> hasValidLocation(p, booking.getServiceMode()))
                .filter(p -> !hasTimeConflict(p, booking))
                .map(p -> new ProviderCandidate(p, calculateDistance(p, booking.getAddress())))
                .sorted(candidateComparator())
                .collect(Collectors.toList());

        if (candidates.isEmpty()) {
            // Leave as PENDING or whatever it is, notify admins
            booking.setAssignmentStatus(AssignmentStatus.PENDING);
            bookingRepository.save(booking);
            return;
        }

        ProviderCandidate bestCandidate = candidates.get(0);
        ServiceProvider selectedProvider = bestCandidate.provider;
        double distanceKm = bestCandidate.distanceKm;

        TechnicianAssignment assignment = TechnicianAssignment.builder()
                .booking(booking)
                .serviceProvider(selectedProvider)
                .status(AssignmentStatus.PENDING)
                .distanceKm(distanceKm)
                .isMandatory(distanceKm <= MANDATORY_RADIUS_KM)
                .build();

        assignmentRepository.save(assignment);

        booking.setServiceProvider(selectedProvider);
        booking.setAssignmentStatus(AssignmentStatus.ASSIGNED);
        booking.setAssignmentAttemptCount(booking.getAssignmentAttemptCount() + 1);
        bookingRepository.save(booking);

        notificationService.createNotification(selectedProvider.getUser(), "New Job Assigned",
                "You have been auto-assigned to booking #" + booking.getId() + ". Distance: " + String.format("%.1f", distanceKm) + " km.",
                NotificationType.PROVIDER_ASSIGNED);
    }

    private boolean supportsServiceMode(ServiceProvider p, String serviceMode) {
        if ("HOME".equalsIgnoreCase(serviceMode)) {
            return p.getProvidesHomeService();
        }
        return p.getProvidesStationService();
    }

    private boolean hasValidLocation(ServiceProvider p, String serviceMode) {
        if ("STATION".equalsIgnoreCase(serviceMode)) {
            return true; // Location might not be strictly necessary for station drops
        }
        if (p.getLatitude() == null || p.getLongitude() == null || p.getLocationUpdatedAt() == null) {
            return false;
        }
        return p.getLocationUpdatedAt().isAfter(LocalDateTime.now().minusHours(STALE_LOCATION_HOURS));
    }

    private boolean hasTimeConflict(ServiceProvider provider, Booking newBooking) {
        List<Booking> providerBookings = bookingRepository.findByServiceProviderId(provider.getId());
        int newDuration = newBooking.getService().getDurationMinutes();
        LocalTime newStart = newBooking.getBookingTime();
        LocalTime newEnd = newStart.plusMinutes(newDuration);

        for (Booking b : providerBookings) {
            if (b.getBookingDate().equals(newBooking.getBookingDate()) && 
                (b.getAssignmentStatus() == AssignmentStatus.ACCEPTED || b.getAssignmentStatus() == AssignmentStatus.ASSIGNED)) {
                
                LocalTime existStart = b.getBookingTime();
                LocalTime existEnd = existStart.plusMinutes(b.getService().getDurationMinutes());

                // Overlap condition
                if (newStart.isBefore(existEnd) && existStart.isBefore(newEnd)) {
                    return true;
                }
            }
        }
        return false;
    }

    private double calculateDistance(ServiceProvider provider, Address address) {
        if (provider.getLatitude() == null || provider.getLongitude() == null ||
            address.getLatitude() == null || address.getLongitude() == null) {
            return 999.0; // Fallback large distance
        }
        
        final int R = 6371; // Radius of the earth in km
        double latDistance = Math.toRadians(address.getLatitude() - provider.getLatitude());
        double lonDistance = Math.toRadians(address.getLongitude() - provider.getLongitude());
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(provider.getLatitude())) * Math.cos(Math.toRadians(address.getLatitude()))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    private Comparator<ProviderCandidate> candidateComparator() {
        return (c1, c2) -> {
            boolean c1Mandatory = c1.distanceKm <= MANDATORY_RADIUS_KM;
            boolean c2Mandatory = c2.distanceKm <= MANDATORY_RADIUS_KM;

            if (c1Mandatory && !c2Mandatory) return -1;
            if (!c1Mandatory && c2Mandatory) return 1;

            int distCompare = Double.compare(c1.distanceKm, c2.distanceKm);
            if (distCompare != 0) return distCompare;

            // Tie breaker
            return Long.compare(c1.provider.getId(), c2.provider.getId());
        };
    }

    private static class ProviderCandidate {
        ServiceProvider provider;
        double distanceKm;

        ProviderCandidate(ServiceProvider provider, double distanceKm) {
            this.provider = provider;
            this.distanceKm = distanceKm;
        }
    }
}
