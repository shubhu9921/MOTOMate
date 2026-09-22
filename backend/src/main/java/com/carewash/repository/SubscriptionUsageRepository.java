package com.carewash.repository;

import com.carewash.entity.SubscriptionUsage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubscriptionUsageRepository extends JpaRepository<SubscriptionUsage, Long> {
    List<SubscriptionUsage> findBySubscriptionId(Long subscriptionId);
    List<SubscriptionUsage> findBySubscriptionUserIdOrderByDateDesc(Long userId);
    java.util.Optional<SubscriptionUsage> findByBookingId(Long bookingId);
}
