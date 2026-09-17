package com.carewash.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewDto {
    private Long id;
    private Long bookingId;
    private Long userId;
    private String userName;
    private Long serviceId;
    private Integer rating;
    private String comment;
    private Boolean visible;
    private LocalDateTime createdAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public Long getServiceId() { return serviceId; }
    public void setServiceId(Long serviceId) { this.serviceId = serviceId; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public Boolean getVisible() { return visible; }
    public void setVisible(Boolean visible) { this.visible = visible; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static ReviewDtoBuilder builder() {
        return new ReviewDtoBuilder();
    }

    public static class ReviewDtoBuilder {
        private Long id;
        private Long bookingId;
        private Long userId;
        private String userName;
        private Long serviceId;
        private Integer rating;
        private String comment;
        private Boolean visible;
        private LocalDateTime createdAt;

        ReviewDtoBuilder() {}

        public ReviewDtoBuilder id(Long id) { this.id = id; return this; }
        public ReviewDtoBuilder bookingId(Long bookingId) { this.bookingId = bookingId; return this; }
        public ReviewDtoBuilder userId(Long userId) { this.userId = userId; return this; }
        public ReviewDtoBuilder userName(String userName) { this.userName = userName; return this; }
        public ReviewDtoBuilder serviceId(Long serviceId) { this.serviceId = serviceId; return this; }
        public ReviewDtoBuilder rating(Integer rating) { this.rating = rating; return this; }
        public ReviewDtoBuilder comment(String comment) { this.comment = comment; return this; }
        public ReviewDtoBuilder visible(Boolean visible) { this.visible = visible; return this; }
        public ReviewDtoBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public ReviewDto build() {
            ReviewDto reviewDto = new ReviewDto();
            reviewDto.setId(id);
            reviewDto.setBookingId(bookingId);
            reviewDto.setUserId(userId);
            reviewDto.setUserName(userName);
            reviewDto.setServiceId(serviceId);
            reviewDto.setRating(rating);
            reviewDto.setComment(comment);
            reviewDto.setVisible(visible);
            reviewDto.setCreatedAt(createdAt);
            return reviewDto;
        }
    }
}
