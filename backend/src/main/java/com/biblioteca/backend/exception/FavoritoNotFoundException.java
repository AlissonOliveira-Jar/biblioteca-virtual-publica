package com.biblioteca.backend.exception;

public class FavoritoNotFoundException extends RuntimeException {
    public FavoritoNotFoundException(String message) {
        super(message);
    }
}
