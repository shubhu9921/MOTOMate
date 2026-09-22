package com.carewash.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;

@Configuration
@EnableAsync
public class AsyncConfig {
    // Default ThreadPoolTaskExecutor is provided by Spring Boot.
    // If needed, we can define a custom bean here.
}
