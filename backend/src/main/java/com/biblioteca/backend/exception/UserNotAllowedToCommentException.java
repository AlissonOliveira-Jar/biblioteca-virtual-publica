package com.biblioteca.backend.exception;

public class UserNotAllowedToCommentException extends RuntimeException {
    public UserNotAllowedToCommentException(String message) {
        super(message);
    }
}