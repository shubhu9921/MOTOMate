package com.carewash.service;

import com.carewash.dto.WhatsAppIncomingMessage;
import com.carewash.entity.*;
import com.carewash.repository.*;
import com.carewash.util.PhoneNumberNormalizer;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

public class WhatsAppPhase3Test {

    @Mock
    private WhatsAppConversationService conversationService;

    @Mock
    private WhatsAppConversationRepository conversationRepository;

    @Mock
    private WhatsAppService whatsAppService;

    @Mock
    private ServiceRepository serviceRepository;

    @Mock
    private VehicleRepository vehicleRepository;

    @Mock
    private AddressRepository addressRepository;

    @Mock
    private BookingService bookingService;

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private WhatsAppAvailabilityService availabilityService;

    @InjectMocks
    private WhatsAppMessageProcessor messageProcessor;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testPhoneNormalization() {
        List<String> formats = PhoneNumberNormalizer.getPossibleFormats("919876543210");
        assertTrue(formats.contains("919876543210"));
        assertTrue(formats.contains("+919876543210"));
        assertTrue(formats.contains("9876543210"));
        assertTrue(formats.contains("+9876543210"));
    }

    @Test
    public void testCustomerIdentification_UnknownUser() {
        WhatsAppIncomingMessage msg = new WhatsAppIncomingMessage();
        msg.setPhoneNumber("919876543210");
        msg.setText("1");
        msg.setMessageType("text");
        msg.setMessageId("MSG1");

        WhatsAppConversation conv = new WhatsAppConversation();
        conv.setId(1L);
        conv.setPhoneNumber("919876543210");
        conv.setCurrentState(WhatsAppConversationState.MAIN_MENU);
        // userId is null

        when(conversationService.getOrCreateConversation(anyString())).thenReturn(conv);
        when(conversationService.isDuplicateMessage(anyString())).thenReturn(false);

        messageProcessor.processIncomingMessage(msg);

        // Expect registration message to be sent
        verify(whatsAppService).sendWhatsAppMessage(eq("919876543210"), contains("not linked to a MotorMate account"));
    }

    @Test
    public void testServiceSelection_ValidUser() {
        WhatsAppIncomingMessage msg = new WhatsAppIncomingMessage();
        msg.setPhoneNumber("919876543210");
        msg.setText("1");
        msg.setMessageType("text");
        msg.setMessageId("MSG2");

        WhatsAppConversation conv = new WhatsAppConversation();
        conv.setId(1L);
        conv.setPhoneNumber("919876543210");
        conv.setUserId(10L); // Valid user
        conv.setCurrentState(WhatsAppConversationState.MAIN_MENU);

        when(conversationService.getOrCreateConversation(anyString())).thenReturn(conv);
        when(conversationService.isDuplicateMessage(anyString())).thenReturn(false);

        com.carewash.entity.Service service1 = new com.carewash.entity.Service();
        service1.setId(100L);
        service1.setName("Basic Wash");
        service1.setPrice(499.0);
        service1.setActive(true);
        when(serviceRepository.findAll()).thenReturn(Arrays.asList(service1));

        messageProcessor.processIncomingMessage(msg);

        // Verify state changed to SELECTING_SERVICE
        verify(conversationRepository).save(argThat(c -> c.getCurrentState() == WhatsAppConversationState.SELECTING_SERVICE));
        
        // Verify services list sent
        verify(whatsAppService).sendWhatsAppMessage(eq("919876543210"), contains("Basic Wash"));
    }

    @Test
    public void testIDOR_VehicleSelection() {
        WhatsAppIncomingMessage msg = new WhatsAppIncomingMessage();
        msg.setPhoneNumber("919876543210");
        msg.setText("1");
        msg.setMessageType("text");
        msg.setMessageId("MSG3");

        WhatsAppConversation conv = new WhatsAppConversation();
        conv.setId(1L);
        conv.setPhoneNumber("919876543210");
        conv.setUserId(10L);
        conv.setCurrentState(WhatsAppConversationState.SELECTING_VEHICLE);

        when(conversationService.getOrCreateConversation(anyString())).thenReturn(conv);
        when(conversationService.isDuplicateMessage(anyString())).thenReturn(false);

        // Vehicles for this user
        Vehicle v1 = new Vehicle();
        v1.setId(500L);
        v1.setBrand("Hyundai");
        when(vehicleRepository.findByUserId(10L)).thenReturn(Arrays.asList(v1));

        // Addresses for this user (so we proceed to SELECTING_ADDRESS)
        Address a1 = new Address();
        a1.setId(700L);
        when(addressRepository.findByUserId(10L)).thenReturn(Arrays.asList(a1));

        messageProcessor.processIncomingMessage(msg);

        // Should successfully select the vehicle because it was fetched by userId (findByUserId)
        verify(conversationRepository).save(argThat(c -> Long.valueOf(500L).equals(c.getSelectedVehicleId()) 
            && c.getCurrentState() == WhatsAppConversationState.SELECTING_ADDRESS));
    }
}

