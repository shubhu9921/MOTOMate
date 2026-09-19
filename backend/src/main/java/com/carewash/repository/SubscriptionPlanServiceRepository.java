package com.carewash.repository;

import com.carewash.entity.SubscriptionPlanService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubscriptionPlanServiceRepository extends JpaRepository<SubscriptionPlanService, Long> {
    List<SubscriptionPlanService> findBySubscriptionPlanId(Long planId);
}
