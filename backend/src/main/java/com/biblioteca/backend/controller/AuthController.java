package com.biblioteca.backend.controller;

import com.biblioteca.backend.dto.request.LoginDTO;
import com.biblioteca.backend.dto.request.UserCreateDTO;
import com.biblioteca.backend.dto.request.UserDTO;
import com.biblioteca.backend.dto.response.JwtResponse;
import com.biblioteca.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@Valid @RequestBody UserCreateDTO dto) {
        UserDTO createdUser = authService.register(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@Valid @RequestBody LoginDTO dto) {
        JwtResponse token = authService.login(dto);
        return ResponseEntity.ok(token);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        return ResponseEntity.ok().build();
    }
}
