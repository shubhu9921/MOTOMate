package com.carewash.service;

import com.carewash.config.WhatsAppConfig;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.nio.charset.StandardCharsets;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class WhatsAppWebhookSignatureServiceTest {

    @Mock
    private WhatsAppConfig whatsAppConfig;

    @InjectMocks
    private WhatsAppWebhookSignatureService signatureService;

    private static final String SECRET = "my-secret";
    // Echo -n "hello" | openssl dgst -sha256 -hmac "my-secret"
    private static final String PAYLOAD = "hello";
    private static final String VALID_SIGNATURE = "sha256=7c1ce32402750db1149385ac20603beeaca8909906d1e81c08f4f5c7db8fbe94";

    @BeforeEach
    void setUp() {
        // Assume configured by default for tests that need it
    }

    @Test
    void shouldAcceptValidSignature() {
        when(whatsAppConfig.isConfigured()).thenReturn(true);
        when(whatsAppConfig.getAppSecret()).thenReturn(SECRET);

        boolean result = signatureService.isValidSignature(PAYLOAD.getBytes(StandardCharsets.UTF_8), VALID_SIGNATURE);
        assertTrue(result);
    }

    @Test
    void shouldRejectInvalidSignature() {
        when(whatsAppConfig.isConfigured()).thenReturn(true);
        when(whatsAppConfig.getAppSecret()).thenReturn(SECRET);

        String invalidSignature = "sha256=111111f9b177894379899c72eef036815ecb9ecbd09a5658adbaaa939bb91147";
        boolean result = signatureService.isValidSignature(PAYLOAD.getBytes(StandardCharsets.UTF_8), invalidSignature);
        assertFalse(result);
    }

    @Test
    void shouldRejectMissingSignature() {
        boolean result = signatureService.isValidSignature(PAYLOAD.getBytes(StandardCharsets.UTF_8), null);
        assertFalse(result);
    }

    @Test
    void shouldRejectMalformedSignature() {
        boolean result = signatureService.isValidSignature(PAYLOAD.getBytes(StandardCharsets.UTF_8), "malformed-signature");
        assertFalse(result);
    }

    @Test
    void shouldRejectWhenSecretMissing() {
        when(whatsAppConfig.isConfigured()).thenReturn(true);
        when(whatsAppConfig.getAppSecret()).thenReturn(null);

        boolean result = signatureService.isValidSignature(PAYLOAD.getBytes(StandardCharsets.UTF_8), VALID_SIGNATURE);
        assertFalse(result);
    }
}

