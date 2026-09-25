package com.carewash.security;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    @Value("${app.rate-limit.login.capacity:5}")
    private int loginCapacity;

    @Value("${app.rate-limit.login.window-minutes:15}")
    private int loginWindowMinutes;

    @Value("${app.rate-limit.register.capacity:3}")
    private int registerCapacity;

    @Value("${app.rate-limit.register.window-minutes:60}")
    private int registerWindowMinutes;

    @Value("${app.rate-limit.bookings.capacity:10}")
    private int bookingCapacity;

    @Value("${app.rate-limit.bookings.window-minutes:60}")
    private int bookingWindowMinutes;

    @Value("${app.rate-limit.whatsapp.capacity:100}")
    private int whatsappCapacity;

    @Value("${app.rate-limit.whatsapp.window-minutes:1}")
    private int whatsappWindowMinutes;

    private final ConcurrentHashMap<String, Bucket> loginBuckets = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Bucket> registerBuckets = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Bucket> bookingBuckets = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Bucket> whatsappBuckets = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        String ip = getClientIP(request);

        if (path.equals("/api/auth/login") && request.getMethod().equals("POST")) {
            Bucket bucket = loginBuckets.computeIfAbsent(ip, this::createLoginBucket);
            if (!bucket.tryConsume(1)) {
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.getWriter().write("{\"success\":false,\"message\":\"Too many login attempts. Please try again later.\"}");
                response.setContentType("application/json");
                return;
            }
        } else if (path.equals("/api/auth/register") && request.getMethod().equals("POST")) {
            Bucket bucket = registerBuckets.computeIfAbsent(ip, this::createRegisterBucket);
            if (!bucket.tryConsume(1)) {
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.setHeader("Retry-After", String.valueOf(registerWindowMinutes * 60));
                response.getWriter().write("{\"success\":false,\"message\":\"Too many registration attempts. Please try again later.\"}");
                response.setContentType("application/json");
                return;
            }
        } else if (path.equals("/api/bookings") && request.getMethod().equals("POST")) {
            // For bookings, use IP as identity for unauthenticated fallback, but normally it's authenticated.
            Bucket bucket = bookingBuckets.computeIfAbsent(ip, this::createBookingBucket);
            if (!bucket.tryConsume(1)) {
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.setHeader("Retry-After", String.valueOf(bookingWindowMinutes * 60));
                response.getWriter().write("{\"success\":false,\"message\":\"Too many booking attempts. Please try again later.\"}");
                response.setContentType("application/json");
                return;
            }
        } else if (path.equals("/api/whatsapp/webhook") && request.getMethod().equals("POST")) {
            Bucket bucket = whatsappBuckets.computeIfAbsent(ip, this::createWhatsappBucket);
            if (!bucket.tryConsume(1)) {
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.setHeader("Retry-After", String.valueOf(whatsappWindowMinutes * 60));
                response.getWriter().write("{\"success\":false,\"message\":\"Too many webhook requests.\"}");
                response.setContentType("application/json");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private Bucket createLoginBucket(String ip) {
        Bandwidth limit = Bandwidth.builder()
                .capacity(loginCapacity)
                .refillGreedy(loginCapacity, Duration.ofMinutes(loginWindowMinutes))
                .build();
        return Bucket.builder().addLimit(limit).build();
    }

    private Bucket createRegisterBucket(String ip) {
        Bandwidth limit = Bandwidth.builder()
                .capacity(registerCapacity)
                .refillGreedy(registerCapacity, Duration.ofMinutes(registerWindowMinutes))
                .build();
        return Bucket.builder().addLimit(limit).build();
    }

    private Bucket createBookingBucket(String ip) {
        Bandwidth limit = Bandwidth.builder()
                .capacity(bookingCapacity)
                .refillGreedy(bookingCapacity, Duration.ofMinutes(bookingWindowMinutes))
                .build();
        return Bucket.builder().addLimit(limit).build();
    }

    private Bucket createWhatsappBucket(String ip) {
        Bandwidth limit = Bandwidth.builder()
                .capacity(whatsappCapacity)
                .refillGreedy(whatsappCapacity, Duration.ofMinutes(whatsappWindowMinutes))
                .build();
        return Bucket.builder().addLimit(limit).build();
    }

    private String getClientIP(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }
}
