package com.carewash.repository;

import com.carewash.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    
    Optional<Review> findByBookingId(Long bookingId);
    
    @Query("SELECT r FROM Review r WHERE r.booking.service.id = :serviceId AND r.visible = true ORDER BY r.createdAt DESC")
    Page<Review> findVisibleByServiceId(@Param("serviceId") Long serviceId, Pageable pageable);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.booking.service.id = :serviceId AND r.visible = true")
    Double getAverageRatingForService(@Param("serviceId") Long serviceId);
    
    @Query("SELECT COUNT(r) FROM Review r WHERE r.booking.service.id = :serviceId AND r.visible = true")
    Long getReviewCountForService(@Param("serviceId") Long serviceId);
}
