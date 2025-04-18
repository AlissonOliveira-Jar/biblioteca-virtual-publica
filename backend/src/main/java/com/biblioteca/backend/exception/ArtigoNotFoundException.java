package com.biblioteca.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class ArtigoNotFoundException extends RuntimeException {
    public ArtigoNotFoundException(String message) {
        super(message);
    }
}
