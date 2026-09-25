package com.carewash.service;

import com.carewash.entity.Booking;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;

@Service
public class WhatsAppNotificationTemplateService {

    public String buildBookingCreatedMessage(Booking booking) {
        return "MotorMate 🚗\n\n" +
                "Your booking has been created successfully.\n\n" +
                "Booking ID:\n#MM" + booking.getId() + "\n\n" +
                "Service:\n" + booking.getService().getName() + "\n\n" +
                "Vehicle:\n" + booking.getVehicle().getBrand() + " " + booking.getVehicle().getModel() + "\n\n" +
                "Date:\n" + booking.getBookingDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) + "\n\n" +
                "Time:\n" + booking.getBookingTime().format(DateTimeFormatter.ofPattern("hh:mm a")) + "\n\n" +
                "Status:\nPENDING\n\n" +
                "Thank you for choosing MotorMate.";
    }

    public String buildBookingConfirmedMessage(Booking booking) {
        return "MotorMate 🚗\n\n" +
                "Your booking has been confirmed!\n\n" +
                "Booking ID:\n#MM" + booking.getId() + "\n\n" +
                "Service:\n" + booking.getService().getName() + "\n\n" +
                "Vehicle:\n" + booking.getVehicle().getBrand() + " " + booking.getVehicle().getModel() + "\n\n" +
                "Date:\n" + booking.getBookingDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) + "\n\n" +
                "Time:\n" + booking.getBookingTime().format(DateTimeFormatter.ofPattern("hh:mm a")) + "\n\n" +
                "We look forward to serving you.";
    }

    public String buildTechnicianAssignedMessage(Booking booking) {
        String techName = booking.getServiceProvider() != null ? booking.getServiceProvider().getUser().getName() : "A technician";
        return "MotorMate 🚗\n\n" +
                "A technician has been assigned to your booking.\n\n" +
                "Booking:\n#MM" + booking.getId() + "\n\n" +
                "Technician:\n" + techName + "\n\n" +
                "Service:\n" + booking.getService().getName() + "\n\n" +
                "You will receive another update when the technician is on the way.";
    }

    public String buildTechnicianOnTheWayMessage(Booking booking) {
        return "MotorMate 🚗\n\n" +
                "Your technician is on the way!\n\n" +
                "Booking:\n#MM" + booking.getId() + "\n\n" +
                "Service:\n" + booking.getService().getName() + "\n\n" +
                "Vehicle:\n" + booking.getVehicle().getBrand() + " " + booking.getVehicle().getModel() + "\n\n" +
                "Please keep the vehicle accessible at the selected service location.";
    }

    public String buildServiceStartedMessage(Booking booking) {
        return "MotorMate 🚗\n\n" +
                "Your car service has started.\n\n" +
                "Booking:\n#MM" + booking.getId() + "\n\n" +
                "Service:\n" + booking.getService().getName() + "\n\n" +
                "Vehicle:\n" + booking.getVehicle().getBrand() + " " + booking.getVehicle().getModel() + "\n\n" +
                "We will notify you when the service is completed.";
    }

    public String buildServiceCompletedMessage(Booking booking) {
        return "MotorMate 🚗\n\n" +
                "Your service has been completed successfully!\n\n" +
                "Booking:\n#MM" + booking.getId() + "\n\n" +
                "Service:\n" + booking.getService().getName() + "\n\n" +
                "Vehicle:\n" + booking.getVehicle().getBrand() + " " + booking.getVehicle().getModel() + "\n\n" +
                "Thank you for choosing MotorMate.\n\n" +
                "We'd love to hear your feedback.";
    }

    public String buildBookingCancelledMessage(Booking booking) {
        return "MotorMate 🚗\n\n" +
                "Your booking has been cancelled.\n\n" +
                "Booking:\n#MM" + booking.getId() + "\n\n" +
                "Service:\n" + booking.getService().getName() + "\n\n" +
                "If you need assistance, please contact MotorMate Support.";
    }

    public String buildSubscriptionActivatedMessage(com.carewash.entity.CustomerSubscription subscription) {
        return "MotorMate 🚗\n\n" +
                "Your subscription has been activated successfully!\n\n" +
                "Plan:\n" + subscription.getPlan().getName() + "\n\n" +
                "Vehicle:\n" + subscription.getVehicle().getBrand() + " " + subscription.getVehicle().getModel() + "\n\n" +
                "Valid until:\n" + subscription.getEndDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) + "\n\n" +
                "Thank you for joining MotorMate!";
    }

    public String buildWashesLowMessage(com.carewash.entity.CustomerSubscription subscription) {
        return "MotorMate 🚗\n\n" +
                "Your subscription washes are running low.\n\n" +
                "Remaining Washes: " + subscription.getRemainingWashes() + "\n\n" +
                "Consider upgrading your plan or renewing soon!";
    }

    public String buildSubscriptionExpiringMessage(com.carewash.entity.CustomerSubscription subscription) {
        return "MotorMate 🚗\n\n" +
                "Your subscription is expiring soon!\n\n" +
                "Plan:\n" + subscription.getPlan().getName() + "\n\n" +
                "Expires on:\n" + subscription.getEndDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) + "\n\n" +
                "Renew now to keep enjoying our services uninterrupted.";
    }

    public String buildSubscriptionCancelledMessage(com.carewash.entity.CustomerSubscription subscription) {
        return "MotorMate 🚗\n\n" +
                "Your subscription has been cancelled.\n\n" +
                "Plan:\n" + subscription.getPlan().getName() + "\n\n" +
                "We're sorry to see you go! Contact support if this was a mistake.";
    }

    public String buildSubscriptionPausedMessage(com.carewash.entity.CustomerSubscription subscription) {
        return "MotorMate 🚗\n\n" +
                "Your subscription has been paused.\n\n" +
                "Plan:\n" + subscription.getPlan().getName() + "\n\n" +
                "You can resume it anytime from your dashboard.";
    }

    public String buildSubscriptionResumedMessage(com.carewash.entity.CustomerSubscription subscription) {
        return "MotorMate 🚗\n\n" +
                "Your subscription has been resumed!\n\n" +
                "Plan:\n" + subscription.getPlan().getName() + "\n\n" +
                "Welcome back!";
    }
}




