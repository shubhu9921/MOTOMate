package com.carewash.util;

import java.util.ArrayList;
import java.util.List;

public class PhoneNumberNormalizer {

    public static List<String> getPossibleFormats(String whatsappPhone) {
        if (whatsappPhone == null || whatsappPhone.trim().isEmpty()) {
            return new ArrayList<>();
        }
        
        // Remove everything except digits
        String cleanNumber = whatsappPhone.replaceAll("[^0-9]", "");
        
        List<String> formats = new ArrayList<>();
        formats.add(cleanNumber);
        formats.add("+" + cleanNumber);
        
        // If it starts with 91 and has 12 digits (Indian number from WhatsApp)
        if (cleanNumber.length() == 12 && cleanNumber.startsWith("91")) {
            String local10Digit = cleanNumber.substring(2);
            formats.add(local10Digit);
            formats.add("+" + local10Digit);
        }
        
        // If it starts with 1 and has 11 digits (US number from WhatsApp)
        if (cleanNumber.length() == 11 && cleanNumber.startsWith("1")) {
            String local10Digit = cleanNumber.substring(1);
            formats.add(local10Digit);
            formats.add("+" + local10Digit);
        }
        
        return formats;
    }
}
