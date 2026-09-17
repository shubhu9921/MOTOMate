package com.carewash.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
    private List<String> errors;

    public ApiResponse(boolean success, String message, T data, List<String> errors) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.errors = errors;
    }

    public static <T> ApiResponseBuilder<T> builder() {
        return new ApiResponseBuilder<T>();
    }

    public static class ApiResponseBuilder<T> {
        private boolean success;
        private String message;
        private T data;
        private List<String> errors;

        ApiResponseBuilder() {}

        public ApiResponseBuilder<T> success(boolean success) {
            this.success = success;
            return this;
        }

        public ApiResponseBuilder<T> message(String message) {
            this.message = message;
            return this;
        }

        public ApiResponseBuilder<T> data(T data) {
            this.data = data;
            return this;
        }

        public ApiResponseBuilder<T> errors(List<String> errors) {
            this.errors = errors;
            return this;
        }

        public ApiResponse<T> build() {
            return new ApiResponse<T>(this.success, this.message, this.data, this.errors);
        }
    }
}
