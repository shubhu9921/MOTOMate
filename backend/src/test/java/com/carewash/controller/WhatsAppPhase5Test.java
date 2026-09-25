package com.carewash.controller;

import com.carewash.dto.whatsapp.WhatsAppStatsDto;
import com.carewash.service.AdminWhatsAppService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.carewash.config.SecurityConfig;
import com.carewash.config.WhatsAppConfig;
import com.carewash.security.CustomUserDetailsService;
import com.carewash.security.JwtAuthFilter;
import com.carewash.security.JwtUtils;
import com.carewash.security.RateLimitingFilter;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;

@WebMvcTest(AdminWhatsAppController.class)
@Import({SecurityConfig.class, JwtAuthFilter.class, RateLimitingFilter.class})
public class WhatsAppPhase5Test {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AdminWhatsAppService adminWhatsAppService;

    @MockBean
    private WhatsAppConfig whatsAppConfig;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @MockBean
    private JwtUtils jwtUtils;

    @BeforeEach
    public void setup() {
        WhatsAppStatsDto stats = new WhatsAppStatsDto();
        stats.setTotalMessages(100L);
        when(adminWhatsAppService.getStatistics()).thenReturn(stats);
    }

    @Test
    @WithMockUser(roles = "CUSTOMER")
    public void testCustomerAccess_Forbidden() throws Exception {
        mockMvc.perform(get("/api/admin/whatsapp/statistics"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "SERVICE_PROVIDER")
    public void testProviderAccess_Forbidden() throws Exception {
        mockMvc.perform(get("/api/admin/whatsapp/statistics"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    public void testAdminAccess_Ok() throws Exception {
        mockMvc.perform(get("/api/admin/whatsapp/statistics"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "OPERATIONS_MANAGER")
    public void testOperationsManagerAccess_Ok() throws Exception {
        mockMvc.perform(get("/api/admin/whatsapp/statistics"))
                .andExpect(status().isOk());
    }
}

