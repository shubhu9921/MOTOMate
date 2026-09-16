package com.carewash.service;

import com.carewash.dto.ReviewDto;
import com.carewash.entity.Booking;
import com.carewash.entity.BookingStatus;
import com.carewash.entity.Review;
import com.carewash.entity.User;
import com.carewash.exception.BadRequestException;
import com.carewash.exception.ResourceNotFoundException;
import com.carewash.repository.BookingRepository;
import com.carewash.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Transactional
    public ReviewDto createReview(User user, Long bookingId, Integer rating, String comment) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!booking.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Unauthorized to review this booking");
        }

        if (booking.getStatus() != BookingStatus.COMPLETED) {
            throw new BadRequestException("Only completed bookings can be reviewed");
        }

        if (reviewRepository.findByBookingId(bookingId).isPresent()) {
            throw new BadRequestException("Review already exists for this booking");
        }

        if (rating < 1 || rating > 5) {
            throw new BadRequestException("Rating must be between 1 and 5");
        }

        Review review = Review.builder()
                .booking(booking)
                .user(user)
                .rating(rating)
                .comment(comment)
                .visible(true)
                .build();

        Review saved = reviewRepository.save(review);
        return mapToDto(saved);
    }

    public Page<ReviewDto> getServiceReviews(Long serviceId, Pageable pageable) {
        return reviewRepository.findVisibleByServiceId(serviceId, pageable)
                .map(this::mapToDto);
    }

    public Double getServiceAverageRating(Long serviceId) {
        return reviewRepository.getAverageRatingForService(serviceId);
    }
    
    public Long getServiceReviewCount(Long serviceId) {
        return reviewRepository.getReviewCountForService(serviceId);
    }

    // For Admin
    public Page<ReviewDto> getAllReviews(Pageable pageable) {
        return reviewRepository.findAll(pageable).map(this::mapToDto);
    }

    @Transactional
    public void toggleVisibility(Long reviewId, boolean visible) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
        review.setVisible(visible);
        reviewRepository.save(review);
    }

    private ReviewDto mapToDto(Review review) {
        return ReviewDto.builder()
                .id(review.getId())
                .bookingId(review.getBooking().getId())
                .userId(review.getUser().getId())
                .userName(review.getUser().getName())
                .serviceId(review.getBooking().getService().getId())
                .rating(review.getRating())
                .comment(review.getComment())
                .visible(review.getVisible())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
