package com.biblioteca.backend.controller;

import com.biblioteca.backend.dto.request.*;
import com.biblioteca.backend.dto.response.JwtResponse;
import com.biblioteca.backend.exception.TokenInvalidoException;
import com.biblioteca.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Endpoints para autenticação e gestão de conta")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(
            summary = "Registrar novo utilizador",
            description = "Cria uma nova conta de utilizador. Acessível publicamente.",
            responses = {
                    @ApiResponse(responseCode = "201", description = "Utilizador registrado com sucesso",
                            content = @Content(schema = @Schema(implementation = UserDTO.class))),
                    @ApiResponse(responseCode = "400", description = "Dados de registro invalidos ou email ja em uso")
            }
    )
    public ResponseEntity<UserDTO> register(@Valid @RequestBody(description = "Dados para registro do utilizador", required = true) UserCreateDTO dto) {
        UserDTO createdUser = authService.register(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    @PostMapping("/login")
    @Operation(
            summary = "Login do utilizador",
            description = "Autentica um utilizador existente e retorna um token JWT.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Login bem-sucedido",
                            content = @Content(schema = @Schema(implementation = JwtResponse.class))),
                    @ApiResponse(responseCode = "400", description = "Credenciais de login invalidas"),
                    @ApiResponse(responseCode = "404", description = "Email nao encontrado")
            }
    )
    public ResponseEntity<JwtResponse> login(@Valid @RequestBody(description = "Credenciais do utilizador para login", required = true) LoginDTO dto) {
        JwtResponse token = authService.login(dto);
        return ResponseEntity.ok(token);
    }

    @PostMapping("/logout")
    @Operation(
            summary = "Logout do utilizador",
            description = "Sinaliza o backend para encerrar a sessão do utilizador. Acessível publicamente.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Logout processado")
            }
    )
    public ResponseEntity<Void> logout() {
        return ResponseEntity.ok().build();
    }

    @PostMapping("/esqueci-senha")
    @Operation(
            summary = "Iniciar redefinicao de senha",
            description = "Envia um link/token para redefinicao de senha para o email fornecido. Acessível publicamente.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Processo de redefinicao iniciado (email enviado se utilizador existir)"),
                    @ApiResponse(responseCode = "400", description = "Email invalido")
            }
    )
    public ResponseEntity<Void> esqueciSenha(@Valid @RequestBody(description = "Email da conta para redefinicao de senha", required = true) EsqueciSenhaDTO dto) {
        authService.iniciarRedefinicaoSenha(dto.email());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/redefinir-senha")
    @Operation(
            summary = "Finalizar redefinicao de senha",
            description = "Define uma nova senha para a conta utilizando um token de redefinicao valido. Acessível publicamente.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Senha redefinida com sucesso"),
                    @ApiResponse(responseCode = "400", description = "Dados invalidos ou token invalido/expirado")
            }
    )
    public ResponseEntity<Void> redefinirSenha(@Valid @RequestBody(description = "Dados para redefinicao de senha (token e nova senha)", required = true) RedefinirSenhaDTO dto) {
        authService.finalizarRedefinicaoSenha(dto.token(), dto.novaSenha());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/redefinir-senha")
    @Operation(
            summary = "Validar token de redefinicao de senha",
            description = "Verifica a validade de um token de redefinicao de senha. Acessível publicamente.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Token valido",
                            content = @Content(schema = @Schema(implementation = String.class, example = "Token valido. Voce pode prosseguir para redefinir sua senha."))),
                    @ApiResponse(responseCode = "400", description = "Token invalido ou expirado",
                            content = @Content(schema = @Schema(implementation = String.class, example = "Token de redefinicao invalido")))
            }
    )
    public ResponseEntity<String> verificarTokenRedefinicao(@Parameter(description = "Token de redefinicao de senha") @RequestParam("token") String token) {
        try {
            authService.validarTokenRedefinicao(token);
            return ResponseEntity.ok("Token valido. Voce pode prosseguir para redefinir sua senha.");
        } catch (TokenInvalidoException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

}
