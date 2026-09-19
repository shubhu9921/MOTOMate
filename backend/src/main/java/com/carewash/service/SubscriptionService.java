package com.carewash.service;

import com.carewash.dto.*;
import com.carewash.entity.*;
import com.carewash.exception.ResourceNotFoundException;
import com.carewash.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final SubscriptionPlanRepository planRepository;
    private final SubscriptionPlanServiceRepository planServiceRepository;
    private final CustomerSubscriptionRepository customerSubscriptionRepository;
    private final SubscriptionPaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final com.carewash.repository.ServiceRepository serviceRepository; // FQDN for ServiceRepository to avoid conflict

    public List<SubscriptionPlanDto> getActivePlans() {
        return planRepository.findByActiveTrue().stream().map(this::mapToPlanDto).collect(Collectors.toList());
    }

    public List<SubscriptionPlanDto> getAllPlans() {
        return planRepository.findAll().stream().map(this::mapToPlanDto).collect(Collectors.toList());
    }

    @Transactional
    public SubscriptionPlanDto createPlan(SubscriptionPlanRequest request) {
        SubscriptionPlan plan = new SubscriptionPlan();
        updatePlanFromRequest(plan, request);
        plan = planRepository.save(plan);
        savePlanServices(plan, request.getServices());
        return mapToPlanDto(plan);
    }

    @Transactional
    public SubscriptionPlanDto updatePlan(Long id, SubscriptionPlanRequest request) {
        SubscriptionPlan plan = planRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plan not found"));
        updatePlanFromRequest(plan, request);
        plan = planRepository.save(plan);
        planServiceRepository.deleteAll(plan.getPlanServices());
        savePlanServices(plan, request.getServices());
        return mapToPlanDto(plan);
    }

    private void updatePlanFromRequest(SubscriptionPlan plan, SubscriptionPlanRequest request) {
        plan.setName(request.getName());
        plan.setDescription(request.getDescription());
        plan.setBillingPeriod(request.getBillingPeriod());
        plan.setPrice(request.getPrice());
        plan.setDiscountPercentage(request.getDiscountPercentage());
        plan.setIncludedWashes(request.getIncludedWashes());
        plan.setAdditionalWashPrice(request.getAdditionalWashPrice());
        plan.setVehicleLimit(request.getVehicleLimit());
        plan.setActive(request.getActive());
        plan.setCancellationPolicy(request.getCancellationPolicy());
        plan.setTerms(request.getTerms());
    }

    private void savePlanServices(SubscriptionPlan plan, List<SubscriptionPlanRequest.ServiceConfig> serviceConfigs) {
        if (serviceConfigs != null) {
            List<com.carewash.entity.SubscriptionPlanService> planServices = serviceConfigs.stream().map(config -> {
                com.carewash.entity.Service service = serviceRepository.findById(config.getServiceId())
                        .orElseThrow(() -> new ResourceNotFoundException("Service not found"));
                return com.carewash.entity.SubscriptionPlanService.builder()
                        .subscriptionPlan(plan)
                        .service(service)
                        .isIncluded(config.getIsIncluded())
                        .discountPercentage(config.getDiscountPercentage())
                        .build();
            }).collect(Collectors.toList());
            planServiceRepository.saveAll(planServices);
            plan.setPlanServices(planServices);
        }
    }

    private SubscriptionPlanDto mapToPlanDto(SubscriptionPlan plan) {
        SubscriptionPlanDto dto = new SubscriptionPlanDto();
        dto.setId(plan.getId());
        dto.setName(plan.getName());
        dto.setDescription(plan.getDescription());
        dto.setBillingPeriod(plan.getBillingPeriod());
        dto.setPrice(plan.getPrice());
        dto.setDiscountPercentage(plan.getDiscountPercentage());
        dto.setIncludedWashes(plan.getIncludedWashes());
        dto.setAdditionalWashPrice(plan.getAdditionalWashPrice());
        dto.setVehicleLimit(plan.getVehicleLimit());
        dto.setActive(plan.getActive());
        dto.setCancellationPolicy(plan.getCancellationPolicy());
        dto.setTerms(plan.getTerms());
        if (plan.getPlanServices() != null) {
            dto.setPlanServices(plan.getPlanServices().stream().map(ps -> {
                SubscriptionPlanServiceDto psDto = new SubscriptionPlanServiceDto();
                psDto.setId(ps.getId());
                psDto.setServiceId(ps.getService().getId());
                psDto.setServiceName(ps.getService().getName());
                psDto.setIsIncluded(ps.getIsIncluded());
                psDto.setDiscountPercentage(ps.getDiscountPercentage());
                return psDto;
            }).collect(Collectors.toList()));
        }
        return dto;
    }

    @Transactional
    public CustomerSubscriptionDto subscribe(Long userId, SubscribeRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        SubscriptionPlan plan = planRepository.findById(request.getPlanId())
                .orElseThrow(() -> new ResourceNotFoundException("Plan not found"));

        LocalDate startDate = LocalDate.now();
        LocalDate endDate = plan.getBillingPeriod() == BillingPeriod.MONTHLY ? startDate.plusMonths(1) : startDate.plusYears(1);

        CustomerSubscription subscription = CustomerSubscription.builder()
                .user(user)
                .plan(plan)
                .startDate(startDate)
                .endDate(endDate)
                .billingPeriod(plan.getBillingPeriod())
                .status(SubscriptionStatus.ACTIVE) // Assuming payment successful for mock
                .autoRenew(request.getAutoRenew())
                .totalWashes(plan.getIncludedWashes())
                .usedWashes(0)
                .amountPaid(plan.getPrice())
                .paymentStatus(PaymentStatus.COMPLETED)
                .build();

        subscription = customerSubscriptionRepository.save(subscription);

        SubscriptionPayment payment = SubscriptionPayment.builder()
                .subscription(subscription)
                .amount(plan.getPrice())
                .paymentDate(LocalDateTime.now())
                .paymentMethod(PaymentMethod.ONLINE)
                .paymentStatus(PaymentStatus.COMPLETED)
                .transactionId("mock_txn_" + System.currentTimeMillis())
                .build();
        paymentRepository.save(payment);

        return mapToCustomerSubscriptionDto(subscription);
    }

    public CustomerSubscriptionDto getMyActiveSubscription(Long userId) {
        return customerSubscriptionRepository.findFirstByUserIdAndStatusOrderByIdDesc(userId, SubscriptionStatus.ACTIVE)
                .map(this::mapToCustomerSubscriptionDto)
                .orElse(null);
    }

    private CustomerSubscriptionDto mapToCustomerSubscriptionDto(CustomerSubscription sub) {
        CustomerSubscriptionDto dto = new CustomerSubscriptionDto();
        dto.setId(sub.getId());
        dto.setPlanId(sub.getPlan().getId());
        dto.setPlanName(sub.getPlan().getName());
        dto.setStartDate(sub.getStartDate());
        dto.setEndDate(sub.getEndDate());
        dto.setBillingPeriod(sub.getBillingPeriod());
        dto.setStatus(sub.getStatus());
        dto.setAutoRenew(sub.getAutoRenew());
        dto.setTotalWashes(sub.getTotalWashes());
        dto.setUsedWashes(sub.getUsedWashes());
        dto.setRemainingWashes(sub.getRemainingWashes());
        dto.setAmountPaid(sub.getAmountPaid());
        if (sub.getPlan() != null && sub.getPlan().getPlanServices() != null) {
            dto.setPlanServices(sub.getPlan().getPlanServices().stream().map(ps -> {
                SubscriptionPlanServiceDto psDto = new SubscriptionPlanServiceDto();
                psDto.setId(ps.getId());
                psDto.setServiceId(ps.getService().getId());
                psDto.setServiceName(ps.getService().getName());
                psDto.setIsIncluded(ps.getIsIncluded());
                psDto.setDiscountPercentage(ps.getDiscountPercentage());
                return psDto;
            }).collect(Collectors.toList()));
        }
        return dto;
    }
}
