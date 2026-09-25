package com.carewash.security;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class RateLimitIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testLoginRateLimit() throws Exception {
        String loginPayload = "{\"email\":\"test@test.com\",\"password\":\"password\"}";
        
        // Configured capacity is 5. So we send 5 valid requests.
        for (int i = 0; i < 5; i++) {
            mockMvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(loginPayload)
                    .header("X-Forwarded-For", "192.168.1.100"))
                    // We don't care if it's 200 or 400 (auth failure), just that it's NOT 429
                    .andExpect(result -> {
                        int status = result.getResponse().getStatus();
                        assert status != 429;
                    });
        }
        
        // The 6th request should be rate limited
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginPayload)
                .header("X-Forwarded-For", "192.168.1.100"))
                .andExpect(status().isTooManyRequests());
    }
    
    @Test
    public void testOptionsRequestNotRateLimited() throws Exception {
        // Options requests should not consume tokens
        for (int i = 0; i < 10; i++) {
            mockMvc.perform(options("/api/auth/login")
                    .header("X-Forwarded-For", "192.168.1.101"))
                    .andExpect(result -> {
                        int status = result.getResponse().getStatus();
                        assert status != 429;
                    });
        }
    }
    
    @Test
    public void testRegisterRateLimit() throws Exception {
        String payload = "{}"; // Doesn't matter if it's a bad request, rate limit comes first
        
        // Register capacity is 3
        for (int i = 0; i < 3; i++) {
            mockMvc.perform(post("/api/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(payload)
                    .header("X-Forwarded-For", "192.168.1.102"))
                    .andExpect(result -> {
                        int status = result.getResponse().getStatus();
                        assert status != 429;
                    });
        }
        
        // 4th should fail
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload)
                .header("X-Forwarded-For", "192.168.1.102"))
                .andExpect(status().isTooManyRequests());
    }
}
