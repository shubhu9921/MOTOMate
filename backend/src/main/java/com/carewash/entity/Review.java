package com.carewash.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false, unique = true)
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private Integer rating; // 1 to 5

    @Column(length = 1000)
    private String comment;

    @Column(nullable = false)
    @Builder.Default
    private Boolean visible = true;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Booking getBooking() {
        return booking;
    }

    public void setBooking(Booking booking) {
        this.booking = booking;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Boolean getVisible() {
        return visible;
    }

    public void setVisible(Boolean visible) {
        this.visible = visible;
    }
    
    public void setVisible(boolean visible) {
        this.visible = visible;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public static ReviewBuilder builder() {
        return new ReviewBuilder();
    }

    public static class ReviewBuilder {
        private Long id;
        private Booking booking;
        private User user;
        private Integer rating;
        private String comment;
        private Boolean visible = true;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        ReviewBuilder() {}

        public ReviewBuilder id(Long id) { this.id = id; return this; }
        public ReviewBuilder booking(Booking booking) { this.booking = booking; return this; }
        public ReviewBuilder user(User user) { this.user = user; return this; }
        public ReviewBuilder rating(Integer rating) { this.rating = rating; return this; }
        public ReviewBuilder comment(String comment) { this.comment = comment; return this; }
        public ReviewBuilder visible(Boolean visible) { this.visible = visible; return this; }
        public ReviewBuilder visible(boolean visible) { this.visible = visible; return this; }
        public ReviewBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public ReviewBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Review build() {
            Review review = new Review();
            review.setId(id);
            review.setBooking(booking);
            review.setUser(user);
            review.setRating(rating);
            review.setComment(comment);
            review.setVisible(visible);
            review.setCreatedAt(createdAt);
            review.setUpdatedAt(updatedAt);
            return review;
        }
    }
}
