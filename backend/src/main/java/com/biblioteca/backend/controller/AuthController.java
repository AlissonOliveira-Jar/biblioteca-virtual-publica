package com.biblioteca.backend.controller;

import com.biblioteca.backend.dto.request.*;
import com.biblioteca.backend.dto.response.JwtResponse;
import com.biblioteca.backend.exception.TokenInvalidoException;
import com.biblioteca.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/esqueci-senha")
    public ResponseEntity<Void> esqueciSenha(@Valid @RequestBody EsqueciSenhaDTO dto) {
        authService.iniciarRedefinicaoSenha(dto.email());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/redefinir-senha")
    public ResponseEntity<Void> redefinirSenha(@Valid @RequestBody RedefinirSenhaDTO dto) {
        authService.finalizarRedefinicaoSenha(dto.token(), dto.novaSenha());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/redefinir-senha")
    public ResponseEntity<String> verificarTokenRedefinicao(@RequestParam("token") String token) {
        try {
            authService.validarTokenRedefinicao(token);
            return ResponseEntity.ok("Token válido. Você pode prosseguir para redefinir sua senha.");
        } catch (TokenInvalidoException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

}
