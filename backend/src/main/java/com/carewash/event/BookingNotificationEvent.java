package com.carewash.event;

import com.carewash.entity.Booking;
import com.carewash.entity.NotificationType;
import org.springframework.context.ApplicationEvent;

public class BookingNotificationEvent extends ApplicationEvent {

    private final Booking booking;
    private final NotificationType type;

    public BookingNotificationEvent(Object source, Booking booking, NotificationType type) {
        super(source);
        this.booking = booking;
        this.type = type;
    }

    public Booking getBooking() {
        return booking;
    }

    public NotificationType getType() {
        return type;
    }
}
