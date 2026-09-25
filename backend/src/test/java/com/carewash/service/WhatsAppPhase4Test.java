package com.carewash.service;

import com.carewash.entity.*;
import com.carewash.event.BookingNotificationEvent;
import com.carewash.repository.WhatsAppNotificationEventRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

public class WhatsAppPhase4Test {

    @Mock
    private WhatsAppNotificationEventRepository eventRepository;

    @Mock
    private WhatsAppNotificationTemplateService templateService;

    @Mock
    private WhatsAppService whatsAppService;

    @InjectMocks
    private WhatsAppNotificationService notificationService;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        ReflectionTestUtils.setField(notificationService, "whatsappEnabled", true);
    }

    private Booking createMockBooking() {
        User user = new User();
        user.setId(1L);
        user.setPhone("919876543210");
        user.setName("Test User");

        com.carewash.entity.Service service = new com.carewash.entity.Service();
        service.setId(1L);
        service.setName("Premium Wash");

        Vehicle vehicle = new Vehicle();
        vehicle.setId(1L);
        vehicle.setBrand("Honda");
        vehicle.setModel("City");

        Booking booking = new Booking();
        booking.setId(1024L);
        booking.setUser(user);
        booking.setService(service);
        booking.setVehicle(vehicle);
        booking.setBookingDate(LocalDate.now());
        booking.setBookingTime(LocalTime.NOON);
        return booking;
    }

    @Test
    public void testWhatsAppDisabled() {
        ReflectionTestUtils.setField(notificationService, "whatsappEnabled", false);
        Booking booking = createMockBooking();
        BookingNotificationEvent event = new BookingNotificationEvent(this, booking, NotificationType.BOOKING_CREATED);

        notificationService.handleBookingNotificationEvent(event);

        verifyNoInteractions(eventRepository);
        verifyNoInteractions(whatsAppService);
    }

    @Test
    public void testIdempotency_DuplicateIgnored() {
        Booking booking = createMockBooking();
        BookingNotificationEvent event = new BookingNotificationEvent(this, booking, NotificationType.BOOKING_CONFIRMED);

        when(eventRepository.findByEventKey("1024_BOOKING_CONFIRMED")).thenReturn(Optional.of(new WhatsAppNotificationEvent()));

        notificationService.handleBookingNotificationEvent(event);

        // Save should not be called since event exists
        verify(eventRepository, never()).save(any());
        verifyNoInteractions(whatsAppService);
    }

    @Test
    public void testSuccessNotification() throws Exception {
        Booking booking = createMockBooking();
        BookingNotificationEvent event = new BookingNotificationEvent(this, booking, NotificationType.BOOKING_CONFIRMED);

        when(eventRepository.findByEventKey(any())).thenReturn(Optional.empty());
        when(eventRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
        when(templateService.buildBookingConfirmedMessage(booking)).thenReturn("Test Message");

        notificationService.handleBookingNotificationEvent(event);

        verify(whatsAppService, times(1)).sendWhatsAppMessage("919876543210", "Test Message");
        verify(eventRepository, atLeastOnce()).save(argThat(evt -> evt.getStatus() == WhatsAppNotificationEventStatus.SENT));
    }

    @Test
    public void testRetryLimitFailure() throws Exception {
        Booking booking = createMockBooking();
        BookingNotificationEvent event = new BookingNotificationEvent(this, booking, NotificationType.BOOKING_CONFIRMED);

        when(eventRepository.findByEventKey(any())).thenReturn(Optional.empty());
        when(eventRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
        when(templateService.buildBookingConfirmedMessage(booking)).thenReturn("Test Message");
        
        doThrow(new RuntimeException("API Error")).when(whatsAppService).sendWhatsAppMessage(any(), any());

        notificationService.handleBookingNotificationEvent(event);

        // It should try 3 times (MAX_RETRIES)
        verify(whatsAppService, times(3)).sendWhatsAppMessage("919876543210", "Test Message");
        verify(eventRepository, atLeastOnce()).save(argThat(evt -> evt.getStatus() == WhatsAppNotificationEventStatus.FAILED && evt.getAttemptCount() == 3));
    }
}

