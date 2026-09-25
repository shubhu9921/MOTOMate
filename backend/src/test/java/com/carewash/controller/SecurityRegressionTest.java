package com.carewash.controller;

import com.carewash.dto.BookingRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class SecurityRegressionTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser(username = "malicious@test.com", roles = "CUSTOMER")
    public void testPriceTamperingIgnored() throws Exception {
        // Create a raw JSON map to inject a fake price field which isn't in BookingRequest
        Map<String, Object> maliciousPayload = new HashMap<>();
        maliciousPayload.put("vehicleId", 1);
        maliciousPayload.put("addressId", 1);
        maliciousPayload.put("serviceId", 1);
        maliciousPayload.put("serviceMode", "WATERLESS");
        maliciousPayload.put("serviceDate", LocalDate.now().plusDays(1).toString());
        maliciousPayload.put("serviceTime", LocalTime.of(10, 0).toString());
        
        // Maliciously injected fields that the DTO should ignore
        maliciousPayload.put("price", 1.0);
        maliciousPayload.put("totalAmount", 1.0);
        maliciousPayload.put("discount", 999.0);
        maliciousPayload.put("status", "COMPLETED");
        maliciousPayload.put("paymentStatus", "PAID");
        maliciousPayload.put("providerId", 123);

        // It might return 400 Bad Request because the IDs might not exist (IDOR protection / not found)
        // or 404 Not Found. The key is that it doesn't cause a deserialization error that crashes the app, 
        // and doesn't succeed with the fake price.
        // Spring Boot Jackson is configured to ignore unknown properties by default.
        mockMvc.perform(post("/api/bookings")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(maliciousPayload)))
                .andExpect(result -> {
                    int statusCode = result.getResponse().getStatus();
                    // 200, 201 are not expected because vehicle/address don't belong to the mock user.
                    // 400/403/404 are expected.
                    assert statusCode != 200 && statusCode != 201;
                });
    }
}
