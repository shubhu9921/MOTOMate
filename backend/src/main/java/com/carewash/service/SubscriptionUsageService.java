package com.carewash.service;

import com.carewash.dto.SubscriptionUsageDto;
import com.carewash.entity.*;
import com.carewash.exception.ResourceNotFoundException;
import com.carewash.repository.CustomerSubscriptionRepository;
import com.carewash.repository.SubscriptionUsageRepository;
import com.carewash.event.SubscriptionNotificationEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.orm.ObjectOptimisticLockingFailureException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SubscriptionUsageService {

    private final CustomerSubscriptionRepository customerSubscriptionRepository;
    private final SubscriptionUsageRepository usageRepository;
    private final ApplicationEventPublisher eventPublisher;

    public SubscriptionUsageService(CustomerSubscriptionRepository customerSubscriptionRepository, 
                                    SubscriptionUsageRepository usageRepository,
                                    ApplicationEventPublisher eventPublisher) {
        this.customerSubscriptionRepository = customerSubscriptionRepository;
        this.usageRepository = usageRepository;
        this.eventPublisher = eventPublisher;
    }

    public List<SubscriptionUsageDto> getUsageHistory(Long userId) {
        return usageRepository.findBySubscriptionUserIdOrderByDateDesc(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public boolean isServiceIncluded(Long vehicleId, Long serviceId) {
        Optional<CustomerSubscription> optSub = customerSubscriptionRepository
                .findFirstByVehicleIdAndStatusOrderByIdDesc(vehicleId, SubscriptionStatus.ACTIVE);
        if (optSub.isEmpty()) return false;
        
        CustomerSubscription sub = optSub.get();
        if (sub.getRemainingWashes() <= 0) return false;

        return sub.getPlan().getPlanServices().stream()
                .anyMatch(ps -> ps.getService().getId().equals(serviceId) && ps.getIsIncluded());
    }

    public Double getServiceDiscount(Long vehicleId, Long serviceId) {
        Optional<CustomerSubscription> optSub = customerSubscriptionRepository
                .findFirstByVehicleIdAndStatusOrderByIdDesc(vehicleId, SubscriptionStatus.ACTIVE);
        if (optSub.isEmpty()) return 0.0;

        CustomerSubscription sub = optSub.get();
        
        return sub.getPlan().getPlanServices().stream()
                .filter(ps -> ps.getService().getId().equals(serviceId))
                .findFirst()
                .map(SubscriptionPlanService::getDiscountPercentage)
                .orElse(0.0);
    }

    @Transactional
    public void consumeWash(Long vehicleId, Booking booking, com.carewash.entity.Service service, Vehicle vehicle) {
        CustomerSubscription sub = customerSubscriptionRepository
                .findFirstByVehicleIdAndStatusOrderByIdDesc(vehicleId, SubscriptionStatus.ACTIVE)
                .orElseThrow(() -> new IllegalStateException("No active subscription"));

        if (sub.getEndDate().isBefore(java.time.LocalDate.now())) {
            throw new IllegalStateException("Subscription has expired");
        }

        if (sub.getRemainingWashes() <= 0) {
            throw new IllegalStateException("Insufficient wash quota");
        }

        boolean isIncluded = sub.getPlan().getPlanServices().stream()
                .anyMatch(ps -> ps.getService().getId().equals(service.getId()) && ps.getIsIncluded());

        if (!isIncluded) {
            throw new IllegalStateException("Service not included in subscription plan");
        }

        sub.setWashesUsed(sub.getWashesUsed() + 1);
        try {
            customerSubscriptionRepository.save(sub);
            // Flush to ensure the optimistic locking check happens immediately
            customerSubscriptionRepository.flush();
        } catch (ObjectOptimisticLockingFailureException e) {
            throw new IllegalStateException("Concurrent subscription update detected. Please try again.");
        }

        if (sub.getRemainingWashes() <= 1) { // 1 or 0
            eventPublisher.publishEvent(new SubscriptionNotificationEvent(this, sub, NotificationType.WASHES_LOW));
        }

        SubscriptionUsage usage = SubscriptionUsage.builder()
                .subscription(sub)
                .booking(booking)
                .service(service)
                .vehicle(vehicle)
                .usageType(UsageType.WASH)
                .usageStatus(UsageStatus.CONSUMED)
                .washConsumed(1)
                .date(LocalDateTime.now())
                .build();
        usageRepository.save(usage);
    }

    @Transactional
    public void reverseWash(Long bookingId) {
        Optional<SubscriptionUsage> optUsage = usageRepository.findByBookingId(bookingId);
        if (optUsage.isPresent()) {
            SubscriptionUsage usage = optUsage.get();
            if (usage.getUsageStatus() == UsageStatus.CONSUMED) {
                usage.setUsageStatus(UsageStatus.REVERSED);
                usageRepository.save(usage);

                CustomerSubscription sub = usage.getSubscription();
                sub.setWashesUsed(sub.getWashesUsed() - usage.getWashConsumed());
                customerSubscriptionRepository.save(sub);
            }
        }
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
