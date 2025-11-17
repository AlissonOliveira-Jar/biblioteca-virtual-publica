package com.biblioteca.backend.exception;

public class FavoritoAlreadyExistsException extends RuntimeException {
    public FavoritoAlreadyExistsException(String message) {
        super(message);
    }
}
