package com.carewash.service;

import com.carewash.entity.*;
import com.carewash.repository.*;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.orm.ObjectOptimisticLockingFailureException;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@ActiveProfiles("test")
public class SubscriptionConcurrencyTest {

    @Autowired
    private SubscriptionUsageService subscriptionUsageService;

    @Autowired
    private CustomerSubscriptionRepository customerSubscriptionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private SubscriptionPlanRepository planRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private SubscriptionUsageRepository subscriptionUsageRepository;

    @Autowired
    private AddressRepository addressRepository;

    private Long vehicleId;
    private Long serviceId;
    private Long subscriptionId;
    private Long bookingId; // persisted booking required by SubscriptionUsage FK

    @BeforeEach
    public void setup() {
        // Create User
        User user = new User();
        user.setEmail("subtest@test.com");
        user.setName("Sub Test User");
        user.setPassword("password");
        user.setRole(Role.CUSTOMER);
        userRepository.save(user);

        // Create Vehicle
        Vehicle vehicle = new Vehicle();
        vehicle.setUser(user);
        vehicle.setBrand("Toyota");
        vehicle.setModel("Fortuner");
        vehicle.setColor("Silver");
        vehicle.setVehicleNumber("MH12AB1234");
        vehicle.setVehicleType(VehicleType.SUV);
        vehicleRepository.save(vehicle);
        vehicleId = vehicle.getId();

        // Create Service
        com.carewash.entity.Service service = new com.carewash.entity.Service();
        service.setName("Basic Wash");
        service.setPrice(500.0);
        service.setDurationMinutes(45);
        service.setActive(true);
        serviceRepository.save(service);
        serviceId = service.getId();

        // Create Address (required by Booking FK)
        Address address = new Address();
        address.setUser(user);
        address.setAddressLine("123 Test Street");
        address.setCity("Mumbai");
        address.setState("Maharashtra");
        address.setPincode("400001");
        addressRepository.save(address);

        // Create a persisted Booking — SubscriptionUsage.booking is NOT NULL
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setService(service);
        booking.setVehicle(vehicle);
        booking.setAddress(address);
        booking.setTotalAmount(500.0);
        booking.setBookingDate(LocalDate.now().plusDays(1));
        booking.setBookingTime(LocalTime.of(10, 0));
        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setAssignmentStatus(AssignmentStatus.PENDING);
        bookingRepository.save(booking);
        bookingId = booking.getId();

        // Create Plan
        SubscriptionPlan plan = new SubscriptionPlan();
        plan.setName("Monthly basic");
        plan.setWashLimit(1); // Only 1 wash allowed
        plan.setBillingPeriod(BillingPeriod.MONTHLY);
        plan.setServiceFrequency(ServiceFrequency.WEEKLY);
        plan.setPrice(999.0);
        plan.setAdditionalWashPrice(199.0);
        planRepository.save(plan);

        SubscriptionPlanService ps = new SubscriptionPlanService();
        ps.setSubscriptionPlan(plan);
        ps.setService(service);
        ps.setIsIncluded(true);
        plan.getPlanServices().add(ps);
        planRepository.save(plan);

        // Create CustomerSubscription
        CustomerSubscription subscription = new CustomerSubscription();
        subscription.setUser(user);
        subscription.setVehicle(vehicle);
        subscription.setPlan(plan);
        subscription.setStatus(SubscriptionStatus.ACTIVE);
        subscription.setStartDate(LocalDate.now());
        subscription.setEndDate(LocalDate.now().plusMonths(1));
        subscription.setNextBillingDate(LocalDate.now().plusMonths(1));
        subscription.setBillingPeriod(BillingPeriod.MONTHLY);
        subscription.setWashesAllowed(1);
        subscription.setWashesUsed(0);
        subscription.setAmountPaid(999.0);
        subscription.setPaymentStatus(PaymentStatus.PAID);
        customerSubscriptionRepository.save(subscription);
        subscriptionId = subscription.getId();
    }

    @AfterEach
    public void cleanup() {
        // Delete in FK-safe order: child tables first
        subscriptionUsageRepository.deleteAll();
        customerSubscriptionRepository.deleteAll();
        planRepository.deleteAll();
        bookingRepository.deleteAll();
        serviceRepository.deleteAll();
        vehicleRepository.deleteAll();
        addressRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    public void testConcurrentWashConsumption() throws InterruptedException {
        int threadCount = 2;
        ExecutorService executorService = Executors.newFixedThreadPool(threadCount);
        CountDownLatch latch = new CountDownLatch(1);
        CountDownLatch doneLatch = new CountDownLatch(threadCount);

        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger optimisticLockErrorCount = new AtomicInteger(0);

        Runnable consumeTask = () -> {
            try {
                latch.await();
                // Use the persisted booking — SubscriptionUsage requires a non-null booking FK
                Booking persistedBooking = bookingRepository.findById(bookingId).orElseThrow();
                com.carewash.entity.Service s = serviceRepository.findById(serviceId).orElseThrow();
                Vehicle v = vehicleRepository.findById(vehicleId).orElseThrow();

                subscriptionUsageService.consumeWash(vehicleId, persistedBooking, s, v);
                successCount.incrementAndGet();
            } catch (IllegalStateException e) {
                if (e.getMessage().contains("Concurrent subscription update detected") || e.getMessage().contains("Insufficient wash quota")) {
                    optimisticLockErrorCount.incrementAndGet();
                }
            } catch (Exception e) {
                // If the JPA dialect throws it directly instead of wrapping in IllegalStateException
                if (e instanceof ObjectOptimisticLockingFailureException || e.getCause() instanceof ObjectOptimisticLockingFailureException) {
                    optimisticLockErrorCount.incrementAndGet();
                }
            } finally {
                doneLatch.countDown();
            }
        };

        executorService.submit(consumeTask);
        executorService.submit(consumeTask);

        latch.countDown();
        doneLatch.await(10, TimeUnit.SECONDS);

        assertEquals(1, successCount.get(), "Exactly one request should successfully consume the wash");
        assertTrue(optimisticLockErrorCount.get() >= 1, "The second request should fail due to optimistic locking or insufficient quota");

        CustomerSubscription updatedSub = customerSubscriptionRepository.findById(subscriptionId).orElseThrow();
        assertEquals(1, updatedSub.getWashesUsed(), "Washes used must not exceed allowed washes");
        assertTrue(updatedSub.getRemainingWashes() >= 0, "Remaining washes must not be negative");
    }
}
