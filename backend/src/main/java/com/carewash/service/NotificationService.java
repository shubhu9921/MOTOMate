package com.carewash.service;

import com.carewash.entity.Notification;
import com.carewash.entity.NotificationType;
import com.carewash.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface NotificationService {
    void createNotification(User user, String title, String message, NotificationType type);
    Page<Notification> getUserNotifications(Long userId, Pageable pageable);
    long getUnreadCount(Long userId);
    void markAsRead(Long notificationId, Long userId);
    void markAllAsRead(Long userId);
}
