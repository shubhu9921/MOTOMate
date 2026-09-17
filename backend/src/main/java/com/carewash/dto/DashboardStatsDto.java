package com.carewash.dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDto {
    private long totalBookings;
    private long pendingBookings;
    private long completedBookings;
    private long totalCustomers;
    private long activeServices;
}
