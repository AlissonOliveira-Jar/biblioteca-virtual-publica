package com.biblioteca.backend.service;

import com.biblioteca.backend.dto.request.LoginDTO;
import com.biblioteca.backend.dto.request.UserCreateDTO;
import com.biblioteca.backend.dto.request.UserDTO;
import com.biblioteca.backend.dto.response.JwtResponse;
import com.biblioteca.backend.entity.User;
import com.biblioteca.backend.exception.AuthenticationException;
import com.biblioteca.backend.exception.EmailNotFoundException;
import com.biblioteca.backend.exception.InvalidPasswordException;
import com.biblioteca.backend.repository.UserRepository;
import com.biblioteca.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserService userService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

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
}
