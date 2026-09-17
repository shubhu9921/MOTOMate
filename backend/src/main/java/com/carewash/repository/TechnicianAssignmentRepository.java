package com.carewash.repository;

import com.carewash.entity.TechnicianAssignment;
import com.carewash.entity.AssignmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TechnicianAssignmentRepository extends JpaRepository<TechnicianAssignment, Long> {
    
    List<TechnicianAssignment> findByBookingId(Long bookingId);
    
    List<TechnicianAssignment> findByServiceProviderIdAndStatus(Long providerId, AssignmentStatus status);
    
    Optional<TechnicianAssignment> findByBookingIdAndServiceProviderId(Long bookingId, Long providerId);
    
    boolean existsByBookingIdAndServiceProviderIdAndStatus(Long bookingId, Long providerId, AssignmentStatus status);
}
