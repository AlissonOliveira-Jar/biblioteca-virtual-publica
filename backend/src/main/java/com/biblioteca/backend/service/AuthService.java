package com.biblioteca.backend.service;

import com.biblioteca.backend.dto.request.LoginDTO;
import com.biblioteca.backend.dto.request.UserCreateDTO;
import com.biblioteca.backend.dto.request.UserDTO;
import com.biblioteca.backend.dto.request.VerifyPasswordDTO;
import com.biblioteca.backend.dto.response.JwtResponse;
import com.biblioteca.backend.entity.User;
import com.biblioteca.backend.exception.AuthenticationException;
import com.biblioteca.backend.exception.EmailNotFoundException;
import com.biblioteca.backend.exception.InvalidPasswordException;
import com.biblioteca.backend.exception.TokenInvalidoException;
import com.biblioteca.backend.exception.UserNotFoundException;
import com.biblioteca.backend.repository.UserRepository;
import com.biblioteca.backend.security.JwtService;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserService userService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;

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

    @Transactional(readOnly = true)
    public void verifyCurrentUserPassword(VerifyPasswordDTO dto) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String userEmail;

        if (principal instanceof UserDetails) {
            userEmail = ((UserDetails) principal).getUsername();
        } else if (principal instanceof User) {
             userEmail = ((User) principal).getEmail();
        } else if (principal instanceof String) {
             userEmail = (String) principal;
        } else {
            System.err.println("Tipo inesperado do principal: " + principal.getClass().getName());
            throw new RuntimeException("Não foi possível obter as informações do usuário autenticado.");
        }

        User currentUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UserNotFoundException("Usuário autenticado [" + userEmail + "] não encontrado no banco."));

        if (!passwordEncoder.matches(dto.password(), currentUser.getPassword())) {
            throw new InvalidPasswordException("Senha atual incorreta.");
        }
    }

    public void iniciarRedefinicaoSenha(String email) {
        User user = userRepository.findByEmail(email).orElse(null);

        if (user != null) {
            String resetToken = UUID.randomUUID().toString();
            Instant expiryDate = Instant.now().plus(TOKEN_EXPIRATION_MINUTES, java.time.temporal.ChronoUnit.MINUTES);

            user.setResetToken(resetToken);
            user.setResetTokenExpiry(expiryDate);
            userRepository.save(user);

            emailService.enviarEmailRedefinicaoSenha(email, resetToken);

            String resetLink = "http://localhost:3000/redefinir-senha?token=" + resetToken;
            System.out.println("Link de redefinição de senha para: " + email + "\nLink: " + resetLink);
        } else {
             System.out.println("Tentativa de redefinição para email não existente: " + email);
        }
    }

    public void validarTokenRedefinicao(String token) {
        User user = userRepository.findByResetToken(token)
                .orElseThrow(() -> new TokenInvalidoException("Token de redefinição inválido"));

        if (user.getResetTokenExpiry().isBefore(Instant.now())) {
            user.setResetToken(null);
            user.setResetTokenExpiry(null);
            userRepository.save(user);
            throw new TokenInvalidoException("Token de redefinição expirou");
        }
    }

    @Transactional
    public void finalizarRedefinicaoSenha(String token, String novaSenha) {
        User user = userRepository.findByResetToken(token)
                .orElseThrow(() -> new TokenInvalidoException("Token de redefinição inválido"));

        if (user.getResetTokenExpiry().isBefore(Instant.now())) {
            user.setResetToken(null);
            user.setResetTokenExpiry(null);
            userRepository.save(user);
            throw new TokenInvalidoException("Token de redefinição expirou");
        }

        user.setPassword(passwordEncoder.encode(novaSenha));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);

    }

}
