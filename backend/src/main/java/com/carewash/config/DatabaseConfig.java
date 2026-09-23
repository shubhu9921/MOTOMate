package com.carewash.config;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
public class DatabaseConfig {

    @Value("${spring.datasource.url}")
    private String databaseUrl;

    @Value("${spring.datasource.username:}")
    private String username;

    @Value("${spring.datasource.password:}")
    private String password;

    @Value("${spring.datasource.driver-class-name:org.postgresql.Driver}")
    private String driverClassName;

    @Bean
    public DataSource dataSource() {
        HikariDataSource dataSource = new HikariDataSource();

        // If Render or Heroku sets DATABASE_URL in postgres:// format, convert it to jdbc:postgresql://
        String jdbcUrl = databaseUrl;
        if (jdbcUrl != null) {
            if (jdbcUrl.startsWith("postgres://")) {
                jdbcUrl = jdbcUrl.replaceFirst("postgres://", "jdbc:postgresql://");
            } else if (jdbcUrl.startsWith("postgresql://")) {
                jdbcUrl = jdbcUrl.replaceFirst("postgresql://", "jdbc:postgresql://");
            }
        }

        dataSource.setJdbcUrl(jdbcUrl);
        if (username != null && !username.isEmpty()) {
            dataSource.setUsername(username);
        }
        if (password != null && !password.isEmpty()) {
            dataSource.setPassword(password);
        }
        dataSource.setDriverClassName(driverClassName);
        
        return dataSource;
    }
}
