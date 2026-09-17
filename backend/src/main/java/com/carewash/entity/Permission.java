package com.carewash.entity;

public enum Permission {
    // User permissions
    USER_VIEW,
    USER_CREATE,
    USER_UPDATE,
    USER_DELETE,
    USER_MANAGE_ROLES,

    // Service permissions
    SERVICE_VIEW,
    SERVICE_CREATE,
    SERVICE_UPDATE,
    SERVICE_DELETE,

    // Pricing permissions
    PRICING_VIEW,
    PRICING_MANAGE,

    // Booking permissions
    BOOKING_VIEW,
    BOOKING_CREATE,
    BOOKING_UPDATE,
    BOOKING_CANCEL,
    BOOKING_ASSIGN,
    BOOKING_STATUS_UPDATE,

    // Provider permissions
    PROVIDER_VIEW,
    PROVIDER_CREATE,
    PROVIDER_UPDATE,
    PROVIDER_ASSIGN,

    // Customer specific (Own resources)
    OWN_BOOKING_VIEW,
    OWN_BOOKING_CREATE,
    OWN_BOOKING_CANCEL,
    OWN_VEHICLE_MANAGE,
    OWN_ADDRESS_MANAGE,

    // Service Job (Provider specific)
    SERVICE_JOB_VIEW,
    SERVICE_JOB_ACCEPT,
    SERVICE_JOB_STATUS_UPDATE,
    SERVICE_JOB_COMPLETE,

    // Additional modules
    PAYMENT_VIEW,
    PAYMENT_MANAGE,
    REFUND_MANAGE,

    COUPON_VIEW,
    COUPON_MANAGE,

    SUPPORT_VIEW,
    SUPPORT_MANAGE,

    REPORT_VIEW,
    
    NOTIFICATION_VIEW,
    NOTIFICATION_MANAGE,

    SYSTEM_SETTINGS_VIEW,
    SYSTEM_SETTINGS_MANAGE,
    
    AUDIT_LOG_VIEW,
    
    PROFILE_VIEW,
    PROFILE_MANAGE
}
