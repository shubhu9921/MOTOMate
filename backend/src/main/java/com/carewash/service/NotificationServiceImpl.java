package com.carewash.service;

import com.carewash.entity.Notification;
import com.carewash.entity.NotificationType;
import com.carewash.entity.User;
import com.carewash.exception.ResourceNotFoundException;
import com.carewash.repository.NotificationRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    @Autowired
    public NotificationServiceImpl(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Override
    @Transactional
    public void createNotification(User user, String title, String message, NotificationType type) {
        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(type)
                .read(false)
                .build();
        notificationRepository.save(notification);
    }

    @Override
    public Page<Notification> getUserNotifications(Long userId, Pageable pageable) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
    }

    @Override
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    @Override
    @Transactional
    public void markAsRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        
        if (!notification.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized to read this notification");
        }
        
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Override
    @Transactional
    public void markAllAsRead(Long userId) {
        // Since we don't have a direct repository method for bulk update right now,
        // we can fetch unread and update them, or add a custom query in repository.
        // For simplicity, we'll iterate through unread. A better approach is a custom @Query.
        // Let's assume pagination handles normal fetching. This is fine for MVP.
        notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, Pageable.unpaged())
            .forEach(n -> {
                if (!n.isRead()) {
                    n.setRead(true);
                }
            });
    }
}
