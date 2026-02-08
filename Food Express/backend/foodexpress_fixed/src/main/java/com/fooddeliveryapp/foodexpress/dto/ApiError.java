package com.fooddeliveryapp.foodexpress.dto;

import java.time.LocalDateTime;
import java.util.Map;

public class ApiError {

    private int status;
    private String message;
    private LocalDateTime timestamp;
    private Map<String, String> errors;

    public ApiError(int status, String message) {
        this.status = status;
        this.message = message;
        this.timestamp = LocalDateTime.now();
    }

    public ApiError(int status, String message, Map<String, String> errors) {
        this(status, message);
        this.errors = errors;
    }

    // getters & setters
}
