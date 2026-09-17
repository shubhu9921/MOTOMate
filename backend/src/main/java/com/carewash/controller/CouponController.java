package com.carewash.controller;

import com.carewash.dto.ApiResponse;
import com.carewash.dto.CouponDto;
import com.carewash.service.CouponService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/coupons")
public class CouponController {

    @Autowired
    private CouponService couponService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CouponDto>>> getActiveCoupons() {
        List<CouponDto> coupons = couponService.getAllActiveCoupons();
        return ResponseEntity.ok(ApiResponse.<List<CouponDto>>builder()
                .success(true)
                .message("Coupons fetched successfully")
                .data(coupons)
                .build());
    }

    @GetMapping("/validate")
    public ResponseEntity<ApiResponse<CouponDto>> validateCoupon(@RequestParam String code, @RequestParam BigDecimal amount) {
        CouponDto coupon = couponService.validateCoupon(code, amount);
        return ResponseEntity.ok(ApiResponse.<CouponDto>builder()
                .success(true)
                .message("Coupon is valid")
                .data(coupon)
                .build());
    }
}
