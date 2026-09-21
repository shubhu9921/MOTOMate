package com.carewash.service;

import com.carewash.dto.SubscriptionUsageDto;
import com.carewash.entity.*;
import com.carewash.exception.ResourceNotFoundException;
import com.carewash.repository.CustomerSubscriptionRepository;
import com.carewash.repository.SubscriptionUsageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubscriptionUsageService {

    private final CustomerSubscriptionRepository customerSubscriptionRepository;
    private final SubscriptionUsageRepository usageRepository;

    public List<SubscriptionUsageDto> getUsageHistory(Long userId) {
        return usageRepository.findBySubscriptionUserIdOrderByDateDesc(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public boolean isServiceIncluded(Long userId, Long serviceId) {
        Optional<CustomerSubscription> optSub = customerSubscriptionRepository
                .findFirstByUserIdAndStatusOrderByIdDesc(userId, SubscriptionStatus.ACTIVE);
        if (optSub.isEmpty()) return false;
        
        CustomerSubscription sub = optSub.get();
        if (sub.getRemainingWashes() <= 0) return false;

        return sub.getPlan().getPlanServices().stream()
                .anyMatch(ps -> ps.getService().getId().equals(serviceId) && ps.getIsIncluded());
    }

    public Double getServiceDiscount(Long userId, Long serviceId) {
        Optional<CustomerSubscription> optSub = customerSubscriptionRepository
                .findFirstByUserIdAndStatusOrderByIdDesc(userId, SubscriptionStatus.ACTIVE);
        if (optSub.isEmpty()) return 0.0;

        CustomerSubscription sub = optSub.get();
        
        return sub.getPlan().getPlanServices().stream()
                .filter(ps -> ps.getService().getId().equals(serviceId))
                .findFirst()
                .map(SubscriptionPlanService::getDiscountPercentage)
                .orElse(0.0);
    }

    @Transactional
    public void consumeWash(Long userId, Booking booking, com.carewash.entity.Service service, Vehicle vehicle) {
        CustomerSubscription sub = customerSubscriptionRepository
                .findFirstByUserIdAndStatusOrderByIdDesc(userId, SubscriptionStatus.ACTIVE)
                .orElseThrow(() -> new IllegalStateException("No active subscription"));

        if (sub.getRemainingWashes() <= 0) {
            throw new IllegalStateException("Insufficient wash quota");
        }

        boolean isIncluded = sub.getPlan().getPlanServices().stream()
                .anyMatch(ps -> ps.getService().getId().equals(service.getId()) && ps.getIsIncluded());

        if (!isIncluded) {
            throw new IllegalStateException("Service not included in subscription plan");
        }

        sub.setUsedWashes(sub.getUsedWashes() + 1);
        customerSubscriptionRepository.save(sub);

        SubscriptionUsage usage = SubscriptionUsage.builder()
                .subscription(sub)
                .booking(booking)
                .service(service)
                .vehicle(vehicle)
                .washConsumed(1)
                .date(LocalDateTime.now())
                .build();
        usageRepository.save(usage);
    }

    private SubscriptionUsageDto mapToDto(SubscriptionUsage usage) {
        SubscriptionUsageDto dto = new SubscriptionUsageDto();
        dto.setId(usage.getId());
        dto.setSubscriptionId(usage.getSubscription().getId());
        dto.setBookingId(usage.getBooking().getId());
        dto.setServiceName(usage.getService().getName());
        dto.setVehicleInfo(usage.getVehicle().getBrand() + " " + usage.getVehicle().getModel());
        dto.setWashConsumed(usage.getWashConsumed());
        dto.setDate(usage.getDate());
        return dto;
    }
}
