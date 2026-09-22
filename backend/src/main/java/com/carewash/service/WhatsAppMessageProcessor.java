package com.carewash.service;

import com.carewash.dto.BookingRequest;
import com.carewash.dto.WhatsAppIncomingMessage;
import com.carewash.entity.*;
import com.carewash.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class WhatsAppMessageProcessor {

    @Autowired
    private WhatsAppConversationService conversationService;

    @Autowired
    private WhatsAppConversationRepository conversationRepository;

    @Autowired
    private WhatsAppService whatsAppService;

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WhatsAppAvailabilityService availabilityService;

    @Autowired
    private SubscriptionService subscriptionService;

    @Autowired
    private SubscriptionPlanRepository planRepository;

    private static final List<String> MAIN_MENU_COMMANDS = Arrays.asList("hi", "hello", "hey", "start", "motormate", "menu");

    public void processIncomingMessage(WhatsAppIncomingMessage incomingMessage) {
        if (conversationService.isDuplicateMessage(incomingMessage.getMessageId())) {
            return;
        }

        WhatsAppConversation conversation = conversationService.getOrCreateConversation(incomingMessage.getPhoneNumber());

        conversationService.saveIncomingMessage(
                conversation.getId(),
                incomingMessage.getMessageId(),
                incomingMessage.getText(),
                incomingMessage.getMessageType()
        );

        if (!"text".equalsIgnoreCase(incomingMessage.getMessageType())) {
            sendAndSaveResponse(conversation, "Sorry, I currently support text messages only.\nPlease reply with MENU to see the options.");
            return;
        }

        String text = incomingMessage.getText() != null ? incomingMessage.getText().trim().toLowerCase() : "";

        if (MAIN_MENU_COMMANDS.contains(text) && !text.equals("menu")) {
            conversationService.clearSession(conversation.getId());
            handleMainMenuState(conversation, "menu");
            return;
        }

        if (text.equals("menu")) {
            conversationService.clearSession(conversation.getId());
            handleMainMenuState(conversation, "menu");
            return;
        }

        if (text.equals("back")) {
            handleBackCommand(conversation);
            return;
        }

        switch (conversation.getCurrentState()) {
            case NEW:
            case MAIN_MENU:
            case COMPLETED:
                handleMainMenuState(conversation, text);
                break;
            case VIEWING_SERVICES:
                handleViewingServicesState(conversation, text);
                break;
            case VIEWING_SUBSCRIPTION:
            case VIEWING_SUBSCRIPTION_PLANS:
                handleViewingSubscriptionState(conversation, text);
                break;
            case SELECTING_SERVICE:
                handleSelectingServiceState(conversation, text);
                break;
            case SELECTING_VEHICLE:
                handleSelectingVehicleState(conversation, text);
                break;
            case SELECTING_ADDRESS:
                handleSelectingAddressState(conversation, text);
                break;
            case SELECTING_DATE:
                handleSelectingDateState(conversation, text);
                break;
            case SELECTING_TIME:
                handleSelectingTimeState(conversation, text);
                break;
            case CONFIRMING_BOOKING:
                handleConfirmingBookingState(conversation, text);
                break;
            case VIEWING_BOOKINGS:
            case VIEWING_BOOKING_STATUS:
                handleViewingBookingsState(conversation, text);
                break;
            case SELECTING_BOOKING:
                handleSelectingBookingState(conversation, text);
                break;
            case SUPPORT:
                handleSupportState(conversation, text);
                break;
            default:
                conversationService.clearSession(conversation.getId());
                handleMainMenuState(conversation, "menu");
                break;
        }
    }

    private void handleBackCommand(WhatsAppConversation conversation) {
        switch (conversation.getCurrentState()) {
            case SELECTING_SERVICE:
            case VIEWING_SERVICES:
            case VIEWING_BOOKINGS:
            case VIEWING_BOOKING_STATUS:
            case VIEWING_SUBSCRIPTION:
            case VIEWING_SUBSCRIPTION_PLANS:
                conversationService.clearSession(conversation.getId());
                handleMainMenuState(conversation, "menu");
                break;
            case SELECTING_VEHICLE:
                conversation.setSelectedServiceId(null);
                conversationRepository.save(conversation);
                showServicesForBooking(conversation);
                break;
            case SELECTING_ADDRESS:
                conversation.setSelectedVehicleId(null);
                conversationRepository.save(conversation);
                showVehiclesForBooking(conversation);
                break;
            case SELECTING_DATE:
                conversation.setSelectedAddressId(null);
                conversationRepository.save(conversation);
                showAddressesForBooking(conversation);
                break;
            case SELECTING_TIME:
                conversation.setSelectedDate(null);
                conversationRepository.save(conversation);
                showDatesForBooking(conversation);
                break;
            case CONFIRMING_BOOKING:
                conversation.setSelectedTime(null);
                conversationRepository.save(conversation);
                showTimesForBooking(conversation);
                break;
            default:
                conversationService.clearSession(conversation.getId());
                handleMainMenuState(conversation, "menu");
                break;
        }
    }

    private void handleMainMenuState(WhatsAppConversation conversation, String text) {
        if (MAIN_MENU_COMMANDS.contains(text) || conversation.getCurrentState() == WhatsAppConversationState.NEW) {
            updateState(conversation, WhatsAppConversationState.MAIN_MENU);
            String menu = "MotorMate Menu 🚗\nHow can we help you?\n1. Book a Car Wash\n2. View Services\n3. My Bookings\n4. Booking Status\n5. Contact Support\n6. My Subscription\n7. Subscription Plans\n\nReply with a number.";
            sendAndSaveResponse(conversation, menu);
            return;
        }

        switch (text) {
            case "1":
                if (conversation.getUserId() == null) {
                    sendRegistrationMessage(conversation);
                } else {
                    showServicesForBooking(conversation);
                }
                break;
            case "2":
                showAllServices(conversation);
                break;
            case "3":
                if (conversation.getUserId() == null) {
                    sendRegistrationMessage(conversation);
                } else {
                    showMyBookings(conversation, WhatsAppConversationState.VIEWING_BOOKINGS);
                }
                break;
            case "4":
                if (conversation.getUserId() == null) {
                    sendRegistrationMessage(conversation);
                } else {
                    showMyBookings(conversation, WhatsAppConversationState.VIEWING_BOOKING_STATUS);
                }
                break;
            case "5":
                updateState(conversation, WhatsAppConversationState.SUPPORT);
                sendAndSaveResponse(conversation, "MotorMate Support 🚗\nPlease type your issue and our support team will assist you.\nType MENU to return to the main menu.");
                break;
            case "6":
                if (conversation.getUserId() == null) {
                    sendRegistrationMessage(conversation);
                } else {
                    showMySubscription(conversation);
                }
                break;
            case "7":
                showSubscriptionPlans(conversation);
                break;
            default:
                sendAndSaveResponse(conversation, "Please select one of the following:\n1. Book a Car Wash\n2. View Services\n3. My Bookings\n4. Booking Status\n5. Contact Support\n6. My Subscription\n7. Subscription Plans");
                break;
        }
    }

    private void sendRegistrationMessage(WhatsAppConversation conversation) {
        sendAndSaveResponse(conversation, "Your WhatsApp number is not linked to a MotorMate account.\nPlease register first:\nhttps://motomate-app.netlify.app\n\nAfter registration, you can use WhatsApp for MotorMate services.");
    }

    private void showAllServices(WhatsAppConversation conversation) {
        List<com.carewash.entity.Service> services = serviceRepository.findAll();
        services.removeIf(s -> !s.getActive());

        if (services.isEmpty()) {
            sendAndSaveResponse(conversation, "No services are currently available. Type MENU to return.");
            return;
        }

        StringBuilder sb = new StringBuilder("MotorMate Services 🚗\n");
        int index = 1;
        for (com.carewash.entity.Service service : services) {
            sb.append(index++).append(". ").append(service.getName()).append(" - ₹").append(service.getPrice()).append("\n");
        }
        sb.append("\nReply with the service number to view details.\nType MENU to return.");

        updateState(conversation, WhatsAppConversationState.VIEWING_SERVICES);
        sendAndSaveResponse(conversation, sb.toString());
    }

    private void handleViewingServicesState(WhatsAppConversation conversation, String text) {
        try {
            int index = Integer.parseInt(text) - 1;
            List<com.carewash.entity.Service> services = serviceRepository.findAll();
            services.removeIf(s -> !s.getActive());
            
            if (index >= 0 && index < services.size()) {
                com.carewash.entity.Service service = services.get(index);
                String details = service.getName() + " 🚗\n" +
                        "Description: " + (service.getDescription() != null ? service.getDescription() : "N/A") + "\n" +
                        "Price: ₹" + service.getPrice() + "\n" +
                        "Duration: " + service.getDurationMinutes() + " minutes\n\n" +
                        "Type MENU to return to the main menu.";
                sendAndSaveResponse(conversation, details);
            } else {
                sendAndSaveResponse(conversation, "Invalid selection. Please reply with a valid service number or MENU.");
            }
        } catch (NumberFormatException e) {
            sendAndSaveResponse(conversation, "Please reply with a valid number or MENU.");
        }
    }

    private void showServicesForBooking(WhatsAppConversation conversation) {
        List<com.carewash.entity.Service> services = serviceRepository.findAll();
        services.removeIf(s -> !s.getActive());

        if (services.isEmpty()) {
            sendAndSaveResponse(conversation, "No services are currently available for booking. Type MENU to return.");
            return;
        }

        StringBuilder sb = new StringBuilder("Select a service to book 🚗\n");
        int index = 1;
        for (com.carewash.entity.Service service : services) {
            sb.append(index++).append(". ").append(service.getName()).append(" (₹").append(service.getPrice()).append(")\n");
        }
        sb.append("\nReply with a number or BACK.");

        updateState(conversation, WhatsAppConversationState.SELECTING_SERVICE);
        sendAndSaveResponse(conversation, sb.toString());
    }

    private void handleSelectingServiceState(WhatsAppConversation conversation, String text) {
        try {
            int index = Integer.parseInt(text) - 1;
            List<com.carewash.entity.Service> services = serviceRepository.findAll();
            services.removeIf(s -> !s.getActive());

            if (index >= 0 && index < services.size()) {
                com.carewash.entity.Service service = services.get(index);
                conversation.setSelectedServiceId(service.getId());
                conversationRepository.save(conversation);
                showVehiclesForBooking(conversation);
            } else {
                sendAndSaveResponse(conversation, "Invalid selection. Please reply with a valid number or BACK.");
            }
        } catch (NumberFormatException e) {
            sendAndSaveResponse(conversation, "Please reply with a valid number or BACK.");
        }
    }

    private void showVehiclesForBooking(WhatsAppConversation conversation) {
        List<Vehicle> vehicles = vehicleRepository.findByUserId(conversation.getUserId());
        if (vehicles.isEmpty()) {
            sendAndSaveResponse(conversation, "No vehicle is registered on your MotorMate account.\nPlease add a vehicle here:\nhttps://motomate-app.netlify.app\n\nAfter adding your vehicle, return to WhatsApp and send MENU.");
            updateState(conversation, WhatsAppConversationState.MAIN_MENU);
            return;
        }

        StringBuilder sb = new StringBuilder("Select your vehicle 🚗\n");
        int index = 1;
        for (Vehicle v : vehicles) {
            sb.append(index++).append(". ").append(v.getBrand()).append(" ").append(v.getModel()).append(" (").append(v.getVehicleNumber()).append(")\n");
        }
        sb.append("\nReply with a number or BACK.");

        updateState(conversation, WhatsAppConversationState.SELECTING_VEHICLE);
        sendAndSaveResponse(conversation, sb.toString());
    }

    private void handleSelectingVehicleState(WhatsAppConversation conversation, String text) {
        try {
            int index = Integer.parseInt(text) - 1;
            List<Vehicle> vehicles = vehicleRepository.findByUserId(conversation.getUserId());

            if (index >= 0 && index < vehicles.size()) {
                Vehicle vehicle = vehicles.get(index);
                // IDOR check: already covered by findByUserId
                conversation.setSelectedVehicleId(vehicle.getId());
                conversationRepository.save(conversation);
                showAddressesForBooking(conversation);
            } else {
                sendAndSaveResponse(conversation, "Invalid selection. Please reply with a valid number or BACK.");
            }
        } catch (NumberFormatException e) {
            sendAndSaveResponse(conversation, "Please reply with a valid number or BACK.");
        }
    }

    private void showAddressesForBooking(WhatsAppConversation conversation) {
        List<Address> addresses = addressRepository.findByUserId(conversation.getUserId());
        if (addresses.isEmpty()) {
            sendAndSaveResponse(conversation, "No service address is available on your account.\nPlease add an address on MotorMate:\nhttps://motomate-app.netlify.app\n\nAfter adding, type MENU to return.");
            updateState(conversation, WhatsAppConversationState.MAIN_MENU);
            return;
        }

        StringBuilder sb = new StringBuilder("Select service address 📍\n");
        int index = 1;
        for (Address a : addresses) {
            String type = a.getAddressType() != null ? a.getAddressType() : "Address";
            sb.append(index++).append(". ").append(type).append(" - ").append(a.getCity()).append("\n");
        }
        sb.append("\nReply with a number or BACK.");

        updateState(conversation, WhatsAppConversationState.SELECTING_ADDRESS);
        sendAndSaveResponse(conversation, sb.toString());
    }

    private void handleSelectingAddressState(WhatsAppConversation conversation, String text) {
        try {
            int index = Integer.parseInt(text) - 1;
            List<Address> addresses = addressRepository.findByUserId(conversation.getUserId());

            if (index >= 0 && index < addresses.size()) {
                Address address = addresses.get(index);
                conversation.setSelectedAddressId(address.getId());
                conversationRepository.save(conversation);
                showDatesForBooking(conversation);
            } else {
                sendAndSaveResponse(conversation, "Invalid selection. Please reply with a valid number or BACK.");
            }
        } catch (NumberFormatException e) {
            sendAndSaveResponse(conversation, "Please reply with a valid number or BACK.");
        }
    }

    private void showDatesForBooking(WhatsAppConversation conversation) {
        LocalDate today = LocalDate.now();
        LocalDate tomorrow = today.plusDays(1);
        
        String msg = "Select your preferred service date.\n" +
                "1. Today (" + today.format(DateTimeFormatter.ofPattern("dd MMM")) + ")\n" +
                "2. Tomorrow (" + tomorrow.format(DateTimeFormatter.ofPattern("dd MMM")) + ")\n\n" +
                "Reply with 1 or 2 or BACK.";
        
        updateState(conversation, WhatsAppConversationState.SELECTING_DATE);
        sendAndSaveResponse(conversation, msg);
    }

    private void handleSelectingDateState(WhatsAppConversation conversation, String text) {
        LocalDate selectedDate = null;
        if (text.equals("1")) {
            selectedDate = LocalDate.now();
        } else if (text.equals("2")) {
            selectedDate = LocalDate.now().plusDays(1);
        } else {
            sendAndSaveResponse(conversation, "Invalid selection. Reply with 1 for Today or 2 for Tomorrow, or BACK.");
            return;
        }
        
        conversation.setSelectedDate(selectedDate);
        conversationRepository.save(conversation);
        showTimesForBooking(conversation);
    }

    private void showTimesForBooking(WhatsAppConversation conversation) {
        List<LocalTime> times = availabilityService.getAvailableTimeSlots(conversation.getSelectedDate());
        if (times.isEmpty()) {
            sendAndSaveResponse(conversation, "Sorry, no time slots are available for the selected date.\nPlease reply with BACK to select another date.");
            return;
        }

        StringBuilder sb = new StringBuilder("Available time slots 🕒\n");
        int index = 1;
        for (LocalTime t : times) {
            sb.append(index++).append(". ").append(t.format(DateTimeFormatter.ofPattern("hh:mm a"))).append("\n");
        }
        sb.append("\nReply with a number or BACK.");

        updateState(conversation, WhatsAppConversationState.SELECTING_TIME);
        sendAndSaveResponse(conversation, sb.toString());
    }

    private void handleSelectingTimeState(WhatsAppConversation conversation, String text) {
        try {
            int index = Integer.parseInt(text) - 1;
            List<LocalTime> times = availabilityService.getAvailableTimeSlots(conversation.getSelectedDate());

            if (index >= 0 && index < times.size()) {
                LocalTime time = times.get(index);
                conversation.setSelectedTime(time);
                conversationRepository.save(conversation);
                showBookingSummary(conversation);
            } else {
                sendAndSaveResponse(conversation, "Invalid selection. Please reply with a valid number or BACK.");
            }
        } catch (NumberFormatException e) {
            sendAndSaveResponse(conversation, "Please reply with a valid number or BACK.");
        }
    }

    private void showBookingSummary(WhatsAppConversation conversation) {
        Optional<com.carewash.entity.Service> serviceOpt = serviceRepository.findById(conversation.getSelectedServiceId());
        Optional<Vehicle> vehicleOpt = vehicleRepository.findById(conversation.getSelectedVehicleId());
        Optional<Address> addressOpt = addressRepository.findById(conversation.getSelectedAddressId());

        if (serviceOpt.isEmpty() || vehicleOpt.isEmpty() || addressOpt.isEmpty()) {
            sendAndSaveResponse(conversation, "Booking session expired or invalid. Please type MENU to restart.");
            conversationService.clearSession(conversation.getId());
            updateState(conversation, WhatsAppConversationState.MAIN_MENU);
            return;
        }

        com.carewash.entity.Service service = serviceOpt.get();
        Vehicle vehicle = vehicleOpt.get();
        Address address = addressOpt.get();

        String summary = "MotorMate Booking Summary 🚗\n" +
                "Service: " + service.getName() + "\n" +
                "Vehicle: " + vehicle.getBrand() + " " + vehicle.getModel() + "\n" +
                "Address: " + address.getCity() + "\n" +
                "Date: " + conversation.getSelectedDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) + "\n" +
                "Time: " + conversation.getSelectedTime().format(DateTimeFormatter.ofPattern("hh:mm a")) + "\n" +
                "Price: ₹" + service.getPrice() + "\n\n" +
                "1. Confirm Booking\n" +
                "2. Change Details (BACK)\n" +
                "3. Cancel\n\n" +
                "Reply with a number.";

        updateState(conversation, WhatsAppConversationState.CONFIRMING_BOOKING);
        sendAndSaveResponse(conversation, summary);
    }

    private void handleConfirmingBookingState(WhatsAppConversation conversation, String text) {
        if (text.equals("1")) {
            createFinalBooking(conversation);
        } else if (text.equals("2")) {
            handleBackCommand(conversation);
        } else if (text.equals("3")) {
            conversationService.clearSession(conversation.getId());
            sendAndSaveResponse(conversation, "Booking cancelled.\nNo booking was created.\nType MENU to return to MotorMate.");
            updateState(conversation, WhatsAppConversationState.MAIN_MENU);
        } else {
            sendAndSaveResponse(conversation, "Please reply with:\n1 to Confirm\n2 to Change Details\n3 to Cancel");
        }
    }

    private void createFinalBooking(WhatsAppConversation conversation) {
        try {
            // Verify all data again (IDOR protection)
            User user = userRepository.findById(conversation.getUserId())
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));
            com.carewash.entity.Service service = serviceRepository.findById(conversation.getSelectedServiceId())
                    .orElseThrow(() -> new IllegalArgumentException("Service not found"));
            Vehicle vehicle = vehicleRepository.findById(conversation.getSelectedVehicleId())
                    .orElseThrow(() -> new IllegalArgumentException("Vehicle not found"));
            Address address = addressRepository.findById(conversation.getSelectedAddressId())
                    .orElseThrow(() -> new IllegalArgumentException("Address not found"));

            if (!service.getActive()) {
                sendAndSaveResponse(conversation, "The selected service is no longer available. Please type MENU to select another service.");
                return;
            }
            if (!vehicle.getUser().getId().equals(user.getId())) {
                sendAndSaveResponse(conversation, "That vehicle is no longer available. Please type MENU to select another vehicle.");
                return;
            }
            if (!address.getUser().getId().equals(user.getId())) {
                sendAndSaveResponse(conversation, "That address is no longer available. Please type MENU to select another address.");
                return;
            }

            // Create Booking Request
            BookingRequest req = new BookingRequest();
            req.setServiceId(service.getId());
            req.setVehicleId(vehicle.getId());
            req.setAddressId(address.getId());
            req.setBookingDate(conversation.getSelectedDate());
            req.setBookingTime(conversation.getSelectedTime());
            req.setServiceMode("STATION"); // Default

            com.carewash.dto.BookingDto createdBooking = bookingService.createBooking(user.getEmail(), req);

            String msg = "Booking confirmed successfully! 🚗\n" +
                    "Booking ID: #MM" + createdBooking.getId() + "\n" +
                    "Service: " + service.getName() + "\n" +
                    "Vehicle: " + vehicle.getBrand() + " " + vehicle.getModel() + "\n" +
                    "Date: " + createdBooking.getBookingDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) + "\n" +
                    "Time: " + createdBooking.getBookingTime().format(DateTimeFormatter.ofPattern("hh:mm a")) + "\n\n" +
                    "Thank you for choosing MotorMate! Type MENU to return.";

            conversationService.clearSession(conversation.getId());
            updateState(conversation, WhatsAppConversationState.COMPLETED);
            sendAndSaveResponse(conversation, msg);
            
        } catch (Exception e) {
            System.err.println("Booking failed from WhatsApp: " + e.getMessage());
            sendAndSaveResponse(conversation, "We couldn't create your booking right now.\nPlease try again or use the MotorMate website.\nType MENU to return.");
        }
    }

    private void showMyBookings(WhatsAppConversation conversation, WhatsAppConversationState nextState) {
        List<Booking> bookings = bookingRepository.findByUserId(conversation.getUserId());
        
        if (bookings.isEmpty()) {
            sendAndSaveResponse(conversation, "You have no bookings with MotorMate.\nType MENU to return.");
            updateState(conversation, WhatsAppConversationState.MAIN_MENU);
            return;
        }

        // Show top 5 recent bookings
        bookings.sort((b1, b2) -> b2.getCreatedAt().compareTo(b1.getCreatedAt()));
        int limit = Math.min(5, bookings.size());
        
        StringBuilder sb = new StringBuilder("Your MotorMate Bookings 🚗\n");
        for (int i = 0; i < limit; i++) {
            Booking b = bookings.get(i);
            sb.append(i + 1).append(". #MM").append(b.getId()).append(" - ").append(b.getService().getName()).append("\n");
        }
        sb.append("\nReply with a number to view details. Type MENU to return.");

        updateState(conversation, nextState);
        sendAndSaveResponse(conversation, sb.toString());
    }

    private void handleViewingBookingsState(WhatsAppConversation conversation, String text) {
        try {
            int index = Integer.parseInt(text) - 1;
            List<Booking> bookings = bookingRepository.findByUserId(conversation.getUserId());
            bookings.sort((b1, b2) -> b2.getCreatedAt().compareTo(b1.getCreatedAt()));
            
            if (index >= 0 && index < Math.min(5, bookings.size())) {
                Booking b = bookings.get(index);
                String details = "Booking #MM" + b.getId() + "\n" +
                        "Service: " + b.getService().getName() + "\n" +
                        "Vehicle: " + b.getVehicle().getBrand() + " " + b.getVehicle().getModel() + "\n" +
                        "Date: " + b.getBookingDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) + "\n" +
                        "Time: " + b.getBookingTime().format(DateTimeFormatter.ofPattern("hh:mm a")) + "\n" +
                        "Status: " + getFriendlyStatus(b.getStatus()) + "\n\n" +
                        "Type MENU to return.";
                sendAndSaveResponse(conversation, details);
            } else {
                sendAndSaveResponse(conversation, "Invalid selection. Please reply with a valid number or MENU.");
            }
        } catch (NumberFormatException e) {
            sendAndSaveResponse(conversation, "Please reply with a valid number or MENU.");
        }
    }

    private void handleSelectingBookingState(WhatsAppConversation conversation, String text) {
        // Redundant with VIEWING_BOOKINGS for now, can be expanded later.
        handleViewingBookingsState(conversation, text);
    }

    private String getFriendlyStatus(BookingStatus status) {
        switch (status) {
            case PENDING: return "Your booking is pending confirmation. ⏳";
            case CONFIRMED: return "Your booking has been confirmed. ✅";
            case ASSIGNED: return "A technician has been assigned. 🧑‍🔧";
            case ON_THE_WAY: return "Your technician is on the way. 🚗";
            case IN_PROGRESS: return "Your car service is currently in progress. 🧽";
            case COMPLETED: return "Your service has been completed. 🌟";
            case CANCELLED: return "Your booking has been cancelled. ❌";
            default: return status.name();
        }
    }

    private void handleSupportState(WhatsAppConversation conversation, String text) {
        if (text.equals("menu")) {
            handleMainMenuState(conversation, "menu");
        } else {
            sendAndSaveResponse(conversation, "Thank you for contacting MotorMate Support.\nYour message has been received.\nOur support team will get back to you.\nType MENU to return to the main menu.");
        }
    }

    private void showMySubscription(WhatsAppConversation conversation) {
        com.carewash.dto.CustomerSubscriptionDto sub = subscriptionService.getMyActiveSubscription(conversation.getUserId());
        if (sub == null) {
            sendAndSaveResponse(conversation, "You don't have an active subscription.\nType MENU to return.");
            updateState(conversation, WhatsAppConversationState.MAIN_MENU);
            return;
        }

        String msg = "Your MotorMate Subscription 🚗\n" +
                "Plan: " + sub.getPlanName() + "\n" +
                "Vehicle: " + sub.getVehicleName() + "\n" +
                "Status: " + sub.getStatus() + "\n" +
                "Ends on: " + sub.getEndDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) + "\n" +
                "Washes Allowed: " + sub.getWashesAllowed() + "\n" +
                "Washes Used: " + sub.getWashesUsed() + "\n\n" +
                "Type MENU to return.";

        updateState(conversation, WhatsAppConversationState.VIEWING_SUBSCRIPTION);
        sendAndSaveResponse(conversation, msg);
    }

    private void showSubscriptionPlans(WhatsAppConversation conversation) {
        List<SubscriptionPlan> plans = planRepository.findByActiveTrue();
        if (plans.isEmpty()) {
            sendAndSaveResponse(conversation, "No subscription plans are currently available.\nType MENU to return.");
            updateState(conversation, WhatsAppConversationState.MAIN_MENU);
            return;
        }

        StringBuilder sb = new StringBuilder("MotorMate Subscription Plans 🚗\n");
        for (int i = 0; i < plans.size(); i++) {
            SubscriptionPlan plan = plans.get(i);
            sb.append(i + 1).append(". ").append(plan.getName())
              .append(" - ₹").append(plan.getPrice()).append("\n");
        }
        sb.append("\nType MENU to return.");

        updateState(conversation, WhatsAppConversationState.VIEWING_SUBSCRIPTION_PLANS);
        sendAndSaveResponse(conversation, sb.toString());
    }

    private void handleViewingSubscriptionState(WhatsAppConversation conversation, String text) {
        conversationService.clearSession(conversation.getId());
        handleMainMenuState(conversation, "menu");
    }

    private void updateState(WhatsAppConversation conversation, WhatsAppConversationState newState) {
        conversation.setCurrentState(newState);
        conversationRepository.save(conversation);
    }

    private void sendAndSaveResponse(WhatsAppConversation conversation, String responseText) {
        whatsAppService.sendWhatsAppMessage(conversation.getPhoneNumber(), responseText);
        conversationService.saveOutgoingMessage(conversation.getId(), responseText, WhatsAppMessageStatus.SENT);
    }
}
