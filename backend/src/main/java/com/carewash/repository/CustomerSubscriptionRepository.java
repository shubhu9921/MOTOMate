package com.carewash.repository;

import com.carewash.entity.CustomerSubscription;
import com.carewash.entity.SubscriptionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerSubscriptionRepository extends JpaRepository<CustomerSubscription, Long> {
    List<CustomerSubscription> findByUserId(Long userId);
    List<CustomerSubscription> findByUserIdAndStatus(Long userId, SubscriptionStatus status);
    Optional<CustomerSubscription> findFirstByUserIdAndStatusOrderByIdDesc(Long userId, SubscriptionStatus status);
}
