package com.carewash.repository;

import com.carewash.entity.Booking;
import com.carewash.entity.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long>, JpaSpecificationExecutor<Booking> {
    
    // For Customer
    Page<Booking> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    
    List<Booking> findByUserId(Long userId);
    
    // For Provider
    Page<Booking> findByServiceProviderIdOrderByBookingDateAscBookingTimeAsc(Long providerId, Pageable pageable);
    
    List<Booking> findByServiceProviderId(Long providerId);
    
    // Basic stat queries for dashboards
    long countByStatus(BookingStatus status);
    
    @Query("SELECT SUM(b.totalAmount) FROM Booking b WHERE b.status = 'COMPLETED'")
    Double sumRevenueFromCompletedBookings();
    
    long countByServiceProviderIdAndStatus(Long providerId, BookingStatus status);
}
