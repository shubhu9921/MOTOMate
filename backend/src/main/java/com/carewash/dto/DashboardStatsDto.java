package com.carewash.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardStatsDto {
    private long totalBookings;
    private long pendingBookings;
    private long completedBookings;
    private long totalCustomers;
    private long activeServices;
}
