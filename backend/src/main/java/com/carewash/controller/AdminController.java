package com.carewash.controller;

import com.carewash.dto.ApiResponse;
import com.carewash.dto.BookingDto;
import com.carewash.entity.*;
import com.carewash.exception.ResourceNotFoundException;
import com.carewash.exception.BadRequestException;
import com.carewash.dto.ProviderCreateRequest;
import com.carewash.repository.*;
import com.carewash.service.BookingService;
import com.carewash.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ServiceProviderRepository providerRepository;

    @Autowired
    private BookingService bookingService;
    
    @Autowired
    private AuthService authService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardStats() {
        long totalBookings = bookingRepository.count();
        long pendingBookings = bookingRepository.countByStatus(BookingStatus.PENDING);
        long activeJobs = bookingRepository.countByStatus(BookingStatus.IN_PROGRESS);
        long completedBookings = bookingRepository.countByStatus(BookingStatus.COMPLETED);
        
        Double rev = bookingRepository.sumRevenueFromCompletedBookings();
        double totalRevenue = rev != null ? rev : 0.0;

        long totalCustomers = userRepository.countByRole(Role.CUSTOMER);
        long activeServices = serviceRepository.countByActiveTrue();
        long availableProviders = providerRepository.findByStatus(ProviderStatus.AVAILABLE).size();

        return ResponseEntity.ok(Map.of(
            "success", true,
            "data", Map.of(
                "totalCustomers", totalCustomers,
                "totalBookings", totalBookings,
                "pendingBookings", pendingBookings,
                "activeJobs", activeJobs,
                "completedBookings", completedBookings,
                "totalRevenue", totalRevenue,
                "activeServices", activeServices,
                "availableProviders", availableProviders
            )
        ));
    }

    @GetMapping("/bookings")
    public ResponseEntity<?> getAllBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<Booking> bookings = bookingRepository.findAll(PageRequest.of(page, size));
        Page<BookingDto> dtos = bookings.map(bookingService::mapToDto);
        return ResponseEntity.ok(Map.of("success", true, "data", dtos));
    }

    @PutMapping("/bookings/{id}/assign-provider")
    public ResponseEntity<?> assignProvider(
            @RequestHeader("Authorization") String token,
            @PathVariable Long id, 
            @RequestBody Map<String, Long> request) {
        
        User admin = authService.getUserFromToken(token.substring(7));
        
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
                
        Long providerId = request.get("providerId");
        ServiceProvider provider = providerRepository.findById(providerId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found"));
                
        booking.setServiceProvider(provider);
        bookingRepository.save(booking);
        
        bookingService.updateStatus(id, BookingStatus.ASSIGNED, admin);
        
        return ResponseEntity.ok(Map.of("success", true, "message", "Provider assigned"));
    }

    @GetMapping("/customers")
    public ResponseEntity<?> getCustomers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<User> customers = userRepository.findByRole(Role.CUSTOMER, PageRequest.of(page, size));
        return ResponseEntity.ok(Map.of("success", true, "data", customers));
    }

    @GetMapping("/providers")
    public ResponseEntity<?> getProviders() {
        return ResponseEntity.ok(Map.of("success", true, "data", providerRepository.findAll()));
    }
    
    @GetMapping("/providers/available")
    public ResponseEntity<?> getAvailableProviders() {
        return ResponseEntity.ok(Map.of("success", true, "data", providerRepository.findByStatus(ProviderStatus.AVAILABLE)));
    }

    @PostMapping("/providers")
    public ResponseEntity<?> createProvider(@Valid @RequestBody ProviderCreateRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already in use!");
        }
        if (providerRepository.existsByEmployeeCode(request.getEmployeeCode())) {
            throw new BadRequestException("Employee Code is already in use!");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.SERVICE_PROVIDER);
        user = userRepository.save(user);

        ServiceProvider provider = new ServiceProvider();
        provider.setUser(user);
        provider.setEmployeeCode(request.getEmployeeCode());
        provider.setSpecialization(request.getSpecialization() != null ? request.getSpecialization() : ProviderSpecialization.WASHER);
        provider.setProvidesHomeService(request.getProvidesHomeService());
        provider.setProvidesStationService(request.getProvidesStationService());
        provider.setServiceAreaRadius(request.getServiceAreaRadius());
        provider.setStatus(ProviderStatus.AVAILABLE);
        
        providerRepository.save(provider);
        return ResponseEntity.ok(Map.of("success", true, "message", "Technician created successfully"));
    }
}
