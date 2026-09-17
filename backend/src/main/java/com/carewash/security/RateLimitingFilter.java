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

    private final ConcurrentHashMap<String, Bucket> loginBuckets = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Bucket> registerBuckets = new ConcurrentHashMap<>();

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
                response.getWriter().write("{\"success\":false,\"message\":\"Too many registration attempts. Please try again later.\"}");
                response.setContentType("application/json");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private Bucket createLoginBucket(String ip) {
        Refill refill = Refill.greedy(loginCapacity, Duration.ofMinutes(loginWindowMinutes));
        Bandwidth limit = Bandwidth.classic(loginCapacity, refill);
        return Bucket.builder().addLimit(limit).build();
    }

    private Bucket createRegisterBucket(String ip) {
        Refill refill = Refill.greedy(registerCapacity, Duration.ofMinutes(registerWindowMinutes));
        Bandwidth limit = Bandwidth.classic(registerCapacity, refill);
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
