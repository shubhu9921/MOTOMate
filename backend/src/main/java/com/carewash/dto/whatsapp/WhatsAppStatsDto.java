package com.carewash.dto.whatsapp;

import lombok.Data;

@Data
public class WhatsAppStatsDto {
    private long totalMessages;
    private long incomingMessages;
    private long outgoingMessages;
    private long activeConversations;
    private long totalConversations;
    
    private long notificationsSent;
    private long notificationsFailed;
    private long notificationsRetrying;
    private long notificationsPending;
    
    private long todayMessages;
    private long todayNotifications;
    private long last7DaysMessages;
    private long last30DaysMessages;

    public long getTotalMessages() { return totalMessages; }
    public void setTotalMessages(long totalMessages) { this.totalMessages = totalMessages; }

    public long getIncomingMessages() { return incomingMessages; }
    public void setIncomingMessages(long incomingMessages) { this.incomingMessages = incomingMessages; }

    public long getOutgoingMessages() { return outgoingMessages; }
    public void setOutgoingMessages(long outgoingMessages) { this.outgoingMessages = outgoingMessages; }

    public long getActiveConversations() { return activeConversations; }
    public void setActiveConversations(long activeConversations) { this.activeConversations = activeConversations; }

    public long getTotalConversations() { return totalConversations; }
    public void setTotalConversations(long totalConversations) { this.totalConversations = totalConversations; }

    public long getNotificationsSent() { return notificationsSent; }
    public void setNotificationsSent(long notificationsSent) { this.notificationsSent = notificationsSent; }

    public long getNotificationsFailed() { return notificationsFailed; }
    public void setNotificationsFailed(long notificationsFailed) { this.notificationsFailed = notificationsFailed; }

    public long getNotificationsRetrying() { return notificationsRetrying; }
    public void setNotificationsRetrying(long notificationsRetrying) { this.notificationsRetrying = notificationsRetrying; }

    public long getNotificationsPending() { return notificationsPending; }
    public void setNotificationsPending(long notificationsPending) { this.notificationsPending = notificationsPending; }

    public long getTodayMessages() { return todayMessages; }
    public void setTodayMessages(long todayMessages) { this.todayMessages = todayMessages; }

    public long getTodayNotifications() { return todayNotifications; }
    public void setTodayNotifications(long todayNotifications) { this.todayNotifications = todayNotifications; }

    public long getLast7DaysMessages() { return last7DaysMessages; }
    public void setLast7DaysMessages(long last7DaysMessages) { this.last7DaysMessages = last7DaysMessages; }

    public long getLast30DaysMessages() { return last30DaysMessages; }
    public void setLast30DaysMessages(long last30DaysMessages) { this.last30DaysMessages = last30DaysMessages; }
}




