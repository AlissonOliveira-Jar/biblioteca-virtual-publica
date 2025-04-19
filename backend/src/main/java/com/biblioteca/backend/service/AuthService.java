package com.biblioteca.backend.service;

import com.biblioteca.backend.dto.request.LoginDTO;
import com.biblioteca.backend.dto.request.UserCreateDTO;
import com.biblioteca.backend.dto.request.UserDTO;
import com.biblioteca.backend.dto.response.JwtResponse;
import com.biblioteca.backend.entity.User;
import com.biblioteca.backend.exception.AuthenticationException;
import com.biblioteca.backend.exception.EmailNotFoundException;
import com.biblioteca.backend.exception.InvalidPasswordException;
import com.biblioteca.backend.exception.TokenInvalidoException;
import com.biblioteca.backend.repository.UserRepository;
import com.biblioteca.backend.security.JwtService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserService userService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    private static final long TOKEN_EXPIRATION_MINUTES = 30;

    public UserDTO register(UserCreateDTO dto) {
        if (userRepository.existsByEmail(dto.email())) {
            throw new AuthenticationException("Usuário já existe");
        }
        return userService.createUser(dto);
    }

    public JwtResponse login(LoginDTO dto) {
        User user = userRepository.findByEmail(dto.email())
                .orElseThrow(() -> new EmailNotFoundException("Email não encontrado"));

        if (!passwordEncoder.matches(dto.password(), user.getPassword())) {
            throw new InvalidPasswordException("Senha inválida");
        }

        String token = jwtService.generateToken(user);
        return new JwtResponse(token);
    }

    public void iniciarRedefinicaoSenha(String email) {
        User user = userRepository.findByEmail(email).orElse(null);

        if (user != null) {
            String resetToken = UUID.randomUUID().toString();
            Instant expiryDate = Instant.now().plus(TOKEN_EXPIRATION_MINUTES, java.time.temporal.ChronoUnit.MINUTES);

            user.setResetToken(resetToken);
            user.setResetTokenExpiry(expiryDate);
            userRepository.save(user);

            String resetLink = "http://localhost:8080/api/auth/redefinir-senha?token=" + resetToken;
            System.out.println("Link de redefinição de senha enviado para: " + email + "\nLink: " + resetLink);
        }

    }

    @Transactional
    public void finalizarRedefinicaoSenha(String token, String novaSenha) {
        User user = userRepository.findByResetToken(token)
                .orElseThrow(() -> new TokenInvalidoException("Token de redefinição inválido"));

        if (user.getResetTokenExpiry().isBefore(Instant.now())) {
            throw new TokenInvalidoException("Token de redefinição expirou");
        }

        user.setPassword(passwordEncoder.encode(novaSenha));

        user.setResetToken(null);
        user.setResetTokenExpiry(null);

        userRepository.save(user);
    }

}
