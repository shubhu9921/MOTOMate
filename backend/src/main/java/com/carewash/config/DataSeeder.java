package com.carewash.config;

import com.carewash.entity.Role;
import com.carewash.entity.Service;
import com.carewash.entity.User;
import com.carewash.repository.ServiceRepository;
import com.carewash.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initData() {
        return args -> {
            if (!userRepository.existsByEmail("admin@motomate.com")) {
                User admin = User.builder()
                        .name("Admin User")
                        .email("admin@motomate.com")
                        .password(passwordEncoder.encode("admin123"))
                        .role(Role.ADMIN)
                        .phone("0000000000")
                        .build();
                userRepository.save(admin);
            }

            if (serviceRepository.count() == 0) {
                Service doorstepWash = Service.builder()
                        .name("Doorstep Car Wash")
                        .description("Professional exterior and basic car cleaning performed at your doorstep.")
                        .price(299.0)
                        .durationMinutes(45)
                        .active(true)
                        .build();

                Service premiumWash = Service.builder()
                        .name("Premium Car Wash")
                        .description("Complete inside-out cleaning for a spotless vehicle.")
                        .price(499.0)
                        .durationMinutes(90)
                        .active(true)
                        .build();

                Service fullCare = Service.builder()
                        .name("Full Car Care")
                        .description("The ultimate care package with protective wax.")
                        .price(799.0)
                        .durationMinutes(120)
                        .active(true)
                        .build();

                Service ceramicCoating = Service.builder()
                        .name("Ceramic Coating")
                        .description("Coming Soon: Long-lasting protection and high-gloss finish for your car's paint.")
                        .price(4999.0)
                        .durationMinutes(300)
                        .active(false)
                        .build();

                serviceRepository.save(doorstepWash);
                serviceRepository.save(premiumWash);
                serviceRepository.save(fullCare);
                serviceRepository.save(ceramicCoating);
            }
        };
    }
}
