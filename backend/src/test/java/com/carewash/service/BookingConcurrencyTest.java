package com.carewash.service;

import com.carewash.entity.*;
import com.carewash.repository.*;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.support.TransactionTemplate;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
@ActiveProfiles("test")
public class BookingConcurrencyTest {

    @Autowired
    private AssignmentService assignmentService;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private TransactionTemplate transactionTemplate;

    @Autowired
    private ServiceProviderRepository providerRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TechnicianAssignmentRepository assignmentRepo;

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    private Long booking1Id;
    private Long booking2Id;
    private Long providerId;

    @BeforeEach
    public void setup() {
        // Create user
        User user1 = new User();
        user1.setEmail("customer1@test.com");
        user1.setName("Customer One");
        user1.setPassword("password");
        user1.setRole(Role.CUSTOMER);
        userRepository.save(user1);

        User user2 = new User();
        user2.setEmail("customer2@test.com");
        user2.setName("Customer Two");
        user2.setPassword("password");
        user2.setRole(Role.CUSTOMER);
        userRepository.save(user2);

        User providerUser = new User();
        providerUser.setEmail("provider@test.com");
        providerUser.setName("Provider User");
        providerUser.setPassword("password");
        providerUser.setRole(Role.SERVICE_PROVIDER);
        userRepository.save(providerUser);

        // Create provider
        ServiceProvider provider = new ServiceProvider();
        provider.setUser(providerUser);
        provider.setEmployeeCode("EMP001");
        provider.setSpecialization(ProviderSpecialization.WASHER);
        provider.setStatus(ProviderStatus.AVAILABLE);
        provider.setProvidesStationService(true);
        providerRepository.save(provider);
        providerId = provider.getId();

        // Create shared fixtures
        Service service = new Service();
        service.setName("Test Wash");
        service.setPrice(499.0);
        service.setDurationMinutes(45);
        service.setActive(true);
        serviceRepository.save(service);

        Vehicle vehicle1 = new Vehicle();
        vehicle1.setUser(user1);
        vehicle1.setBrand("Hyundai");
        vehicle1.setModel("i20");
        vehicle1.setColor("White");
        vehicle1.setVehicleNumber("MH01AA0001");
        vehicle1.setVehicleType(VehicleType.HATCHBACK);
        vehicleRepository.save(vehicle1);

        Vehicle vehicle2 = new Vehicle();
        vehicle2.setUser(user2);
        vehicle2.setBrand("Maruti");
        vehicle2.setModel("Swift");
        vehicle2.setColor("Red");
        vehicle2.setVehicleNumber("MH01AA0002");
        vehicle2.setVehicleType(VehicleType.HATCHBACK);
        vehicleRepository.save(vehicle2);

        Address address1 = new Address();
        address1.setUser(user1);
        address1.setAddressLine("123 Test Street");
        address1.setCity("Mumbai");
        address1.setState("Maharashtra");
        address1.setPincode("400001");
        addressRepository.save(address1);

        Address address2 = new Address();
        address2.setUser(user2);
        address2.setAddressLine("456 Test Avenue");
        address2.setCity("Mumbai");
        address2.setState("Maharashtra");
        address2.setPincode("400002");
        addressRepository.save(address2);

        // Create booking 1
        Booking b1 = new Booking();
        b1.setUser(user1);
        b1.setService(service);
        b1.setVehicle(vehicle1);
        b1.setAddress(address1);
        b1.setTotalAmount(499.0);
        b1.setBookingDate(LocalDate.now().plusDays(1));
        b1.setBookingTime(LocalTime.of(10, 0));
        b1.setServiceMode("STATION");
        b1.setStatus(BookingStatus.CONFIRMED);
        b1.setAssignmentStatus(AssignmentStatus.PENDING);
        bookingRepository.save(b1);
        booking1Id = b1.getId();

        // Create booking 2 (same time)
        Booking b2 = new Booking();
        b2.setUser(user2);
        b2.setService(service);
        b2.setVehicle(vehicle2);
        b2.setAddress(address2);
        b2.setTotalAmount(499.0);
        b2.setBookingDate(LocalDate.now().plusDays(1));
        b2.setBookingTime(LocalTime.of(10, 0));
        b2.setServiceMode("STATION");
        b2.setStatus(BookingStatus.CONFIRMED);
        b2.setAssignmentStatus(AssignmentStatus.PENDING);
        bookingRepository.save(b2);
        booking2Id = b2.getId();
    }

    @AfterEach
    public void cleanup() {
        // Delete notifications first — assignTechnicianToBooking creates Notification rows
        // that reference users; deleting users first causes FK constraint violation
        notificationRepository.deleteAll();
        assignmentRepo.deleteAll();
        bookingRepository.deleteAll();
        addressRepository.deleteAll();
        vehicleRepository.deleteAll();
        serviceRepository.deleteAll();
        providerRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    public void testConcurrentProviderAssignment() throws InterruptedException {
        int threadCount = 2;
        ExecutorService executorService = Executors.newFixedThreadPool(threadCount);
        CountDownLatch latch = new CountDownLatch(1);
        CountDownLatch doneLatch = new CountDownLatch(threadCount);

        AtomicInteger successfulAssignments = new AtomicInteger(0);

        Runnable assignTask1 = () -> {
            try {
                latch.await();
                // Load inside a transaction and force-init LAZY associations
                // (Booking.service and Booking.address are LAZY; touching them
                //  within the session prevents LazyInitializationException later)
                Booking b1 = transactionTemplate.execute(status -> {
                    Booking b = bookingRepository.findById(booking1Id).orElseThrow();
                    b.getService().getDurationMinutes(); // force init
                    b.getAddress().getId();              // force init
                    return b;
                });
                assignmentService.assignTechnicianToBooking(b1);

                Booking updated = bookingRepository.findById(booking1Id).orElseThrow();
                if (updated.getServiceProvider() != null) {
                    successfulAssignments.incrementAndGet();
                }
            } catch (Exception e) {
                // Handle exception silently
            } finally {
                doneLatch.countDown();
            }
        };

        Runnable assignTask2 = () -> {
            try {
                latch.await();
                // Load inside a transaction and force-init LAZY associations
                Booking b2 = transactionTemplate.execute(status -> {
                    Booking b = bookingRepository.findById(booking2Id).orElseThrow();
                    b.getService().getDurationMinutes(); // force init
                    b.getAddress().getId();              // force init
                    return b;
                });
                assignmentService.assignTechnicianToBooking(b2);

                Booking updated = bookingRepository.findById(booking2Id).orElseThrow();
                if (updated.getServiceProvider() != null) {
                    successfulAssignments.incrementAndGet();
                }
            } catch (Exception e) {
                // Handle exception silently
            } finally {
                doneLatch.countDown();
            }
        };

        executorService.submit(assignTask1);
        executorService.submit(assignTask2);

        // Start all threads simultaneously
        latch.countDown();
        doneLatch.await(10, TimeUnit.SECONDS);

        // Assert that only ONE booking was assigned to the single available provider
        assertEquals(1, successfulAssignments.get(), "Only one assignment should succeed due to pessimistic locking");
    }
}
