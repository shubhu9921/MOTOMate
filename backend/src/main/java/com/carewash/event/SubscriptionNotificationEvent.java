package com.carewash.event;

import com.carewash.entity.CustomerSubscription;
import com.carewash.entity.NotificationType;
import org.springframework.context.ApplicationEvent;

public class SubscriptionNotificationEvent extends ApplicationEvent {
    private final CustomerSubscription subscription;
    private final NotificationType type;

    public SubscriptionNotificationEvent(Object source, CustomerSubscription subscription, NotificationType type) {
        super(source);
        this.subscription = subscription;
        this.type = type;
    }

    public CustomerSubscription getSubscription() {
        return subscription;
    }

    public NotificationType getType() {
        return type;
    }
}
