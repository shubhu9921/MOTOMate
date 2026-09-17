package com.carewash.service;

import com.carewash.dto.CouponDto;
import com.carewash.entity.Coupon;
import com.carewash.repository.CouponRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CouponService {

    @Autowired
    private CouponRepository couponRepository;

    public List<CouponDto> getAllActiveCoupons() {
        return couponRepository.findAll().stream()
                .filter(Coupon::isActive)
                .filter(c -> c.getExpiryDate().isAfter(LocalDateTime.now()))
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public CouponDto validateCoupon(String code, BigDecimal bookingAmount) {
        Coupon coupon = couponRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Coupon not found"));

        if (!coupon.isActive()) {
            throw new RuntimeException("Coupon is not active");
        }
        if (coupon.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Coupon has expired");
        }
        if (coupon.getUsageLimit() != null && coupon.getTimesUsed() >= coupon.getUsageLimit()) {
            throw new RuntimeException("Coupon usage limit reached");
        }
        if (coupon.getMinBookingAmount() != null && bookingAmount.compareTo(coupon.getMinBookingAmount()) < 0) {
            throw new RuntimeException("Booking amount must be at least " + coupon.getMinBookingAmount());
        }

        return mapToDto(coupon);
    }

    private CouponDto mapToDto(Coupon coupon) {
        return CouponDto.builder()
                .id(coupon.getId())
                .code(coupon.getCode())
                .description(coupon.getDescription())
                .discount(coupon.getDiscount())
                .discountType(coupon.getDiscountType())
                .minBookingAmount(coupon.getMinBookingAmount())
                .expiryDate(coupon.getExpiryDate())
                .usageLimit(coupon.getUsageLimit())
                .timesUsed(coupon.getTimesUsed())
                .active(coupon.isActive())
                .build();
    }
}
