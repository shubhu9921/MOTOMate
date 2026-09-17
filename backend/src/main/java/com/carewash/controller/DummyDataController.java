package com.carewash.controller;

import com.carewash.entity.ProviderSpecialization;
import com.carewash.entity.ProviderStatus;
import com.carewash.entity.Role;
import com.carewash.entity.ServiceProvider;
import com.carewash.entity.User;
import com.carewash.repository.ServiceProviderRepository;
import com.carewash.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/seed")
public class DummyDataController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ServiceProviderRepository providerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/providers")
    public ResponseEntity<?> seedProviders() {
        createDummyProvider(
            "Amit Patel", 
            "amit@provider.com", 
            "9876543210", 
            "EMP001",
            19.076, 
            72.877, // Mumbai
            "123 Station Road, Mumbai",
            true, 
            true,
            ProviderSpecialization.WASHER
        );
        createDummyProvider(
            "Rahul Sharma", 
            "rahul@provider.com", 
            "9876543211", 
            "EMP002",
            19.080, 
            72.880, // Near Mumbai
            "45 Andheri East, Mumbai",
            true, 
            false, // Home service only
            ProviderSpecialization.WASHER
        );
        createDummyProvider(
            "Super Wash Center", 
            "center@provider.com", 
            "9876543212", 
            "EMP003",
            19.070, 
            72.870, // Near Mumbai
            "78 Bandra West, Mumbai",
            false, // Station service only
            true,
            ProviderSpecialization.WASHER
        );
        createDummyProvider(
            "Suresh Tech", 
            "suresh.tech@motomate.com", 
            "9876543214", 
            "TECH001",
            19.085, 
            72.885,
            "Andheri East, Mumbai",
            true, 
            true,
            ProviderSpecialization.TECHNICIAN
        );

        return ResponseEntity.ok(Map.of("success", true, "message", "Providers seeded successfully"));
    }

    private void createDummyProvider(String name, String email, String phone, String code, 
                                     Double lat, Double lng, String address, 
                                     Boolean homeService, Boolean stationService,
                                     ProviderSpecialization spec) {
        Optional<User> existingUser = userRepository.findByEmail(email);
        if (existingUser.isEmpty()) {
            User user = new User();
            user.setName(name);
            user.setEmail(email);
            user.setPhone(phone);
            user.setPassword(passwordEncoder.encode("password"));
            user.setRole(Role.SERVICE_PROVIDER);
            user = userRepository.save(user);

            ServiceProvider provider = ServiceProvider.builder()
                .user(user)
                .employeeCode(code)
                .status(ProviderStatus.AVAILABLE)
                .specialization(spec)
                .latitude(lat)
                .longitude(lng)
                .addressText(address)
                .serviceAreaRadius(15.0)
                .providesHomeService(homeService)
                .providesStationService(stationService)
                .companyIdUrl("https://images.unsplash.com/photo-1544717302-de2939b7ef71") // Mock ID card
                .governmentIdUrl("https://images.unsplash.com/photo-1633332755192-727a05c4013d") // Mock Govt ID
                .profileImageUrl("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d") // Mock Profile Image
                .build();
            providerRepository.save(provider);
        }
    }
}
