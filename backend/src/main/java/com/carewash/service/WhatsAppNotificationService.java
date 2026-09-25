package com.carewash.service;

import com.carewash.entity.*;
import com.carewash.event.BookingNotificationEvent;
import com.carewash.event.SubscriptionNotificationEvent;
import com.carewash.repository.WhatsAppNotificationEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class WhatsAppNotificationService {

    @Value("${app.whatsapp.enabled:false}")
    private boolean whatsappEnabled;

    @Autowired
    private WhatsAppNotificationEventRepository eventRepository;

    @Autowired
    private WhatsAppNotificationTemplateService templateService;

    @Autowired
    private WhatsAppService whatsAppService;

    private static final int MAX_RETRIES = 3;

    @Async
    @TransactionalEventListener(phase = TransactionPhase.BEFORE_COMMIT)
    public void handleBookingNotificationEvent(BookingNotificationEvent event) {
        if (!whatsappEnabled) {
            return;
        }

        Booking booking = event.getBooking();
        NotificationType type = event.getType();
        User user = booking.getUser();

        if (user == null || user.getPhone() == null || user.getPhone().trim().isEmpty()) {
            return;
        }

        String eventKey = booking.getId() + "_" + type.name();

        // Idempotency check: if eventKey exists, we already processed it (or are processing it)
        Optional<WhatsAppNotificationEvent> existingEvent = eventRepository.findByEventKey(eventKey);
        if (existingEvent.isPresent()) {
            return;
        }

        // We use the original phone number (normalization happens inside WhatsAppService when sending)
        // Or we can assume we send it as is if it's already in the correct format for WhatsApp
        String recipientPhone = user.getPhone();

        WhatsAppNotificationEvent notificationEvent = WhatsAppNotificationEvent.builder()
                .bookingId(booking.getId())
                .eventType(type)
                .recipientPhone(recipientPhone)
                .status(WhatsAppNotificationEventStatus.PENDING)
                .eventKey(eventKey)
                .build();

        // Save initial pending state (need a new transaction or require new because we are AFTER_COMMIT)
        // Since this is an @Async method, it runs in a new thread, so we can just use normal repository.save
        notificationEvent = eventRepository.save(notificationEvent);

        String message = buildMessageForType(booking, type);
        if (message == null) {
            // Unhandled type
            notificationEvent.setStatus(WhatsAppNotificationEventStatus.FAILED);
            notificationEvent.setErrorMessage("No template found for type: " + type.name());
            eventRepository.save(notificationEvent);
            return;
        }

        sendWithRetry(notificationEvent, message);
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.BEFORE_COMMIT)
    public void handleSubscriptionNotificationEvent(SubscriptionNotificationEvent event) {
        if (!whatsappEnabled) {
            return;
        }

        CustomerSubscription subscription = event.getSubscription();
        NotificationType type = event.getType();
        User user = subscription.getUser();

        if (user == null || user.getPhone() == null || user.getPhone().trim().isEmpty()) {
            return;
        }

        String timestamp = subscription.getUpdatedAt() != null ? subscription.getUpdatedAt().toString() : String.valueOf(System.currentTimeMillis());
        String eventKey = "sub_" + subscription.getId() + "_" + type.name() + "_" + timestamp;

        String recipientPhone = user.getPhone();

        WhatsAppNotificationEvent notificationEvent = WhatsAppNotificationEvent.builder()
                .subscriptionId(subscription.getId())
                .eventType(type)
                .recipientPhone(recipientPhone)
                .status(WhatsAppNotificationEventStatus.PENDING)
                .eventKey(eventKey)
                .build();

        notificationEvent = eventRepository.save(notificationEvent);

        String message = buildSubscriptionMessageForType(subscription, type);
        if (message == null) {
            notificationEvent.setStatus(WhatsAppNotificationEventStatus.FAILED);
            notificationEvent.setErrorMessage("No template found for type: " + type.name());
            eventRepository.save(notificationEvent);
            return;
        }

        sendWithRetry(notificationEvent, message);
    }

    private void sendWithRetry(WhatsAppNotificationEvent notificationEvent, String message) {
        while (notificationEvent.getAttemptCount() < MAX_RETRIES &&
                (notificationEvent.getStatus() == WhatsAppNotificationEventStatus.PENDING ||
                 notificationEvent.getStatus() == WhatsAppNotificationEventStatus.RETRYING)) {
            
            notificationEvent.setAttemptCount(notificationEvent.getAttemptCount() + 1);
            notificationEvent.setLastAttemptAt(LocalDateTime.now());
            
            boolean sent = false;
            try {
                // Actually send the message using existing service
                whatsAppService.sendWhatsAppMessage(notificationEvent.getRecipientPhone(), message);
                sent = true;
                
                // If no exception is thrown, we assume success
                notificationEvent.setStatus(WhatsAppNotificationEventStatus.SENT);
                notificationEvent.setSentAt(LocalDateTime.now());
                eventRepository.save(notificationEvent);
                return;
            } catch (Exception e) {
                if (sent) {
                    System.err.println("WhatsApp sent successfully, but DB save failed. Skipping retry.");
                    return;
                }
                notificationEvent.setErrorMessage(e.getMessage());
                if (notificationEvent.getAttemptCount() < MAX_RETRIES) {
                    notificationEvent.setStatus(WhatsAppNotificationEventStatus.RETRYING);
                    eventRepository.save(notificationEvent);
                    
                    try {
                        Thread.sleep(2000); // 2 second delay before retry
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        break;
                    }
                } else {
                    notificationEvent.setStatus(WhatsAppNotificationEventStatus.FAILED);
                    eventRepository.save(notificationEvent);
                }
            }
        }
    }

    private String buildMessageForType(Booking booking, NotificationType type) {
        switch (type) {
            case BOOKING_CREATED:
                return templateService.buildBookingCreatedMessage(booking);
            case BOOKING_CONFIRMED:
                return templateService.buildBookingConfirmedMessage(booking);
            case PROVIDER_ASSIGNED:
                return templateService.buildTechnicianAssignedMessage(booking);
            case PROVIDER_ON_THE_WAY:
                return templateService.buildTechnicianOnTheWayMessage(booking);
            case SERVICE_STARTED:
                return templateService.buildServiceStartedMessage(booking);
            case SERVICE_COMPLETED:
                return templateService.buildServiceCompletedMessage(booking);
            case BOOKING_CANCELLED:
                return templateService.buildBookingCancelledMessage(booking);
            default:
                return null;
        }
    }

    private String buildSubscriptionMessageForType(CustomerSubscription subscription, NotificationType type) {
        switch (type) {
            case SUBSCRIPTION_ACTIVATED:
                return templateService.buildSubscriptionActivatedMessage(subscription);
            case WASHES_LOW:
                return templateService.buildWashesLowMessage(subscription);
            case SUBSCRIPTION_EXPIRING:
                return templateService.buildSubscriptionExpiringMessage(subscription);
            case SUBSCRIPTION_CANCELLED:
                return templateService.buildSubscriptionCancelledMessage(subscription);
            case SUBSCRIPTION_PAUSED:
                return templateService.buildSubscriptionPausedMessage(subscription);
            case SUBSCRIPTION_RESUMED:
                return templateService.buildSubscriptionResumedMessage(subscription);
            default:
                return null;
        }
    }
}




