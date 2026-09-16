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

@Service
public class ProviderService {

    @Autowired
    private ServiceProviderRepository providerRepository;
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private BookingService bookingService;

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
}
