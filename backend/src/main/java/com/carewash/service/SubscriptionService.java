package com.carewash.service;

import com.carewash.dto.*;
import com.carewash.entity.*;
import com.carewash.exception.ResourceNotFoundException;
import com.carewash.repository.*;
import com.carewash.event.SubscriptionNotificationEvent;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SubscriptionService {

    private final SubscriptionPlanRepository planRepository;
    private final SubscriptionPlanServiceRepository planServiceRepository;
    private final CustomerSubscriptionRepository customerSubscriptionRepository;
    private final SubscriptionPaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;
    private final VehicleRepository vehicleRepository;
    private final ApplicationEventPublisher eventPublisher;

    public SubscriptionService(SubscriptionPlanRepository planRepository,
                               SubscriptionPlanServiceRepository planServiceRepository,
                               CustomerSubscriptionRepository customerSubscriptionRepository,
                               SubscriptionPaymentRepository paymentRepository,
                               UserRepository userRepository,
                               ServiceRepository serviceRepository,
                               VehicleRepository vehicleRepository,
                               ApplicationEventPublisher eventPublisher) {
        this.planRepository = planRepository;
        this.planServiceRepository = planServiceRepository;
        this.customerSubscriptionRepository = customerSubscriptionRepository;
        this.paymentRepository = paymentRepository;
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
        this.vehicleRepository = vehicleRepository;
        this.eventPublisher = eventPublisher;
    }



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
        plan.setServiceFrequency(request.getServiceFrequency());
        plan.setPrice(request.getPrice());
        plan.setDiscountPercentage(request.getDiscountPercentage());
        plan.setWashLimit(request.getWashLimit());
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
        dto.setServiceFrequency(plan.getServiceFrequency());
        dto.setPrice(plan.getPrice());
        dto.setDiscountPercentage(plan.getDiscountPercentage());
        dto.setWashLimit(plan.getWashLimit());
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
        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));

        if (!vehicle.getUser().getId().equals(userId)) {
            throw new RuntimeException("Vehicle does not belong to the user");
        }

        LocalDate startDate = LocalDate.now();
        LocalDate nextBillingDate = startDate;
        LocalDate endDate;

        if (plan.getBillingPeriod() == BillingPeriod.MONTHLY) {
            endDate = startDate.plusMonths(1);
            nextBillingDate = startDate.plusMonths(1);
        } else if (plan.getBillingPeriod() == BillingPeriod.YEARLY) {
            endDate = startDate.plusYears(1);
            nextBillingDate = startDate.plusYears(1);
        } else {
            // Assume WEEKLY if not MONTHLY/YEARLY
            endDate = startDate.plusWeeks(1);
            nextBillingDate = startDate.plusWeeks(1);
        }

        CustomerSubscription subscription = CustomerSubscription.builder()
                .user(user)
                .plan(plan)
                .vehicle(vehicle)
                .startDate(startDate)
                .endDate(endDate)
                .nextBillingDate(nextBillingDate)
                .billingPeriod(plan.getBillingPeriod())
                .status(SubscriptionStatus.PENDING) // Controlled manual activation for testing Phase 7
                .autoRenew(request.getAutoRenew())
                .washesAllowed(plan.getWashLimit())
                .washesUsed(0)
                .amountPaid(plan.getPrice()) // Assuming it will be paid on activation
                .paymentStatus(PaymentStatus.PENDING)
                .build();

        subscription = customerSubscriptionRepository.save(subscription);
        return mapToCustomerSubscriptionDto(subscription);
    }

    @Transactional
    public CustomerSubscriptionDto activateSubscription(Long id) {
        CustomerSubscription sub = customerSubscriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found"));
        
        sub.setStatus(SubscriptionStatus.ACTIVE);
        sub.setPaymentStatus(PaymentStatus.PAID);
        sub.setStartDate(LocalDate.now());

        if (sub.getBillingPeriod() == BillingPeriod.MONTHLY) {
            sub.setEndDate(LocalDate.now().plusMonths(1));
            sub.setNextBillingDate(LocalDate.now().plusMonths(1));
        } else if (sub.getBillingPeriod() == BillingPeriod.YEARLY) {
            sub.setEndDate(LocalDate.now().plusYears(1));
            sub.setNextBillingDate(LocalDate.now().plusYears(1));
        } else {
            sub.setEndDate(LocalDate.now().plusWeeks(1));
            sub.setNextBillingDate(LocalDate.now().plusWeeks(1));
        }

        SubscriptionPayment payment = SubscriptionPayment.builder()
                .subscription(sub)
                .amount(sub.getAmountPaid())
                .paymentDate(LocalDateTime.now())
                .paymentMethod(PaymentMethod.ONLINE)
                .paymentStatus(PaymentStatus.PAID)
                .transactionId("manual_activate_" + System.currentTimeMillis())
                .build();
        paymentRepository.save(payment);

        CustomerSubscription savedSub = customerSubscriptionRepository.save(sub);
        eventPublisher.publishEvent(new SubscriptionNotificationEvent(this, savedSub, NotificationType.SUBSCRIPTION_ACTIVATED));
        return mapToCustomerSubscriptionDto(savedSub);
    }

    @Transactional
    public CustomerSubscriptionDto updateSubscriptionStatus(Long id, Long userId, SubscriptionStatus newStatus) {
        CustomerSubscription sub = customerSubscriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found"));

        if (userId != null && !sub.getUser().getId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }

        sub.setStatus(newStatus);
        CustomerSubscription savedSub = customerSubscriptionRepository.save(sub);

        if (newStatus == SubscriptionStatus.PAUSED) {
            eventPublisher.publishEvent(new SubscriptionNotificationEvent(this, savedSub, NotificationType.SUBSCRIPTION_PAUSED));
        } else if (newStatus == SubscriptionStatus.ACTIVE) {
            eventPublisher.publishEvent(new SubscriptionNotificationEvent(this, savedSub, NotificationType.SUBSCRIPTION_RESUMED));
        } else if (newStatus == SubscriptionStatus.CANCELLED) {
            eventPublisher.publishEvent(new SubscriptionNotificationEvent(this, savedSub, NotificationType.SUBSCRIPTION_CANCELLED));
        }

        return mapToCustomerSubscriptionDto(savedSub);
    }

    @Transactional
    public void updateAutoRenew(Long id, Long userId, Boolean autoRenew) {
        CustomerSubscription sub = customerSubscriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found"));

        if (!sub.getUser().getId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }

        sub.setAutoRenew(autoRenew);
        customerSubscriptionRepository.save(sub);
    }


    public CustomerSubscriptionDto getMyActiveSubscription(Long userId) {
        return customerSubscriptionRepository.findFirstByUserIdAndStatusOrderByIdDesc(userId, SubscriptionStatus.ACTIVE)
                .map(this::mapToCustomerSubscriptionDto)
                .orElse(null);
    }

    public CustomerSubscriptionDto getSubscription(Long id, Long userId) {
        CustomerSubscription sub = customerSubscriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found"));
        if (!sub.getUser().getId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }
        return mapToCustomerSubscriptionDto(sub);
    }

    public List<CustomerSubscriptionDto> getAllMySubscriptions(Long userId) {
        return customerSubscriptionRepository.findByUserId(userId).stream()
                .map(this::mapToCustomerSubscriptionDto)
                .collect(Collectors.toList());
    }

    public List<CustomerSubscriptionDto> getAllSubscriptions() {
        return customerSubscriptionRepository.findAll().stream()
                .map(this::mapToCustomerSubscriptionDto)
                .collect(Collectors.toList());
    }

    private CustomerSubscriptionDto mapToCustomerSubscriptionDto(CustomerSubscription sub) {
        CustomerSubscriptionDto dto = new CustomerSubscriptionDto();
        dto.setId(sub.getId());
        dto.setPlanId(sub.getPlan().getId());
        dto.setPlanName(sub.getPlan().getName());
        dto.setStartDate(sub.getStartDate());
        dto.setEndDate(sub.getEndDate());
        dto.setNextBillingDate(sub.getNextBillingDate());
        dto.setBillingPeriod(sub.getBillingPeriod());
        dto.setStatus(sub.getStatus());
        dto.setAutoRenew(sub.getAutoRenew());
        dto.setWashesAllowed(sub.getWashesAllowed());
        dto.setWashesUsed(sub.getWashesUsed());
        dto.setRemainingWashes(sub.getRemainingWashes());
        dto.setAmountPaid(sub.getAmountPaid());
        if (sub.getVehicle() != null) {
            dto.setVehicleId(sub.getVehicle().getId());
            dto.setVehicleName(sub.getVehicle().getMake() + " " + sub.getVehicle().getModel());
        }
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
