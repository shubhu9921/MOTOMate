package com.carewash.entity;

import java.util.Set;
import java.util.HashSet;
import java.util.Arrays;

public enum Role {
    SUPER_ADMIN(
        Permission.values() // SUPER_ADMIN gets all permissions automatically
    ),
    ADMIN(
        Permission.USER_VIEW,
        Permission.USER_CREATE,
        Permission.USER_UPDATE,
        Permission.USER_DELETE,
        Permission.SERVICE_VIEW,
        Permission.SERVICE_CREATE,
        Permission.SERVICE_UPDATE,
        Permission.SERVICE_DELETE,
        Permission.PRICING_VIEW,
        Permission.PRICING_MANAGE,
        Permission.BOOKING_VIEW,
        Permission.BOOKING_CREATE,
        Permission.BOOKING_UPDATE,
        Permission.BOOKING_CANCEL,
        Permission.BOOKING_ASSIGN,
        Permission.BOOKING_STATUS_UPDATE,
        Permission.PROVIDER_VIEW,
        Permission.PROVIDER_CREATE,
        Permission.PROVIDER_UPDATE,
        Permission.PROVIDER_ASSIGN,
        Permission.PAYMENT_VIEW,
        Permission.PAYMENT_MANAGE,
        Permission.REFUND_MANAGE,
        Permission.COUPON_VIEW,
        Permission.COUPON_MANAGE,
        Permission.SUPPORT_VIEW,
        Permission.SUPPORT_MANAGE,
        Permission.REPORT_VIEW,
        Permission.NOTIFICATION_VIEW,
        Permission.NOTIFICATION_MANAGE,
        Permission.SYSTEM_SETTINGS_VIEW,
        Permission.PROFILE_VIEW,
        Permission.PROFILE_MANAGE
    ),
    OPERATIONS_MANAGER(
        Permission.USER_VIEW,
        Permission.SERVICE_VIEW,
        Permission.BOOKING_VIEW,
        Permission.BOOKING_CREATE,
        Permission.BOOKING_UPDATE,
        Permission.BOOKING_CANCEL,
        Permission.BOOKING_ASSIGN,
        Permission.BOOKING_STATUS_UPDATE,
        Permission.PROVIDER_VIEW,
        Permission.PROVIDER_ASSIGN,
        Permission.SUPPORT_VIEW,
        Permission.SUPPORT_MANAGE,
        Permission.REPORT_VIEW,
        Permission.NOTIFICATION_VIEW,
        Permission.PROFILE_VIEW,
        Permission.PROFILE_MANAGE
    ),
    SERVICE_PROVIDER(
        Permission.SERVICE_JOB_VIEW,
        Permission.SERVICE_JOB_ACCEPT,
        Permission.SERVICE_JOB_STATUS_UPDATE,
        Permission.SERVICE_JOB_COMPLETE,
        Permission.PROFILE_VIEW,
        Permission.PROFILE_MANAGE,
        Permission.NOTIFICATION_VIEW
    ),
    SUPPORT_AGENT(
        Permission.USER_VIEW,
        Permission.BOOKING_VIEW,
        Permission.SUPPORT_VIEW,
        Permission.SUPPORT_MANAGE,
        Permission.NOTIFICATION_VIEW,
        Permission.PROFILE_VIEW,
        Permission.PROFILE_MANAGE
    ),
    FINANCE_MANAGER(
        Permission.PAYMENT_VIEW,
        Permission.PAYMENT_MANAGE,
        Permission.REFUND_MANAGE,
        Permission.REPORT_VIEW,
        Permission.NOTIFICATION_VIEW,
        Permission.PROFILE_VIEW,
        Permission.PROFILE_MANAGE
    ),
    CUSTOMER(
        Permission.OWN_BOOKING_VIEW,
        Permission.OWN_BOOKING_CREATE,
        Permission.OWN_BOOKING_CANCEL,
        Permission.OWN_VEHICLE_MANAGE,
        Permission.OWN_ADDRESS_MANAGE,
        Permission.PROFILE_VIEW,
        Permission.PROFILE_MANAGE,
        Permission.NOTIFICATION_VIEW,
        Permission.SUPPORT_VIEW,
        Permission.SUPPORT_MANAGE
    );

    private final Set<Permission> permissions;

    Role(Permission... permissions) {
        this.permissions = new HashSet<>(Arrays.asList(permissions));
    }

    public Set<Permission> getPermissions() {
        return permissions;
    }
}
