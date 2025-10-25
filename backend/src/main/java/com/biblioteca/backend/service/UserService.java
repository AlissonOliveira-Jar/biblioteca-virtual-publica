package com.biblioteca.backend.service;

import com.biblioteca.backend.dto.request.UserCreateDTO;
import com.biblioteca.backend.dto.request.UserDTO;
import com.biblioteca.backend.dto.request.UserUpdateDTO;
import com.biblioteca.backend.dto.response.UserUpdateResponseDTO;
import com.biblioteca.backend.entity.User;
import com.biblioteca.backend.exception.InvalidPasswordException;
import com.biblioteca.backend.exception.UserAlreadyExistsException;
import com.biblioteca.backend.exception.UserNotFoundException;
import com.biblioteca.backend.repository.UserRepository;
import com.biblioteca.backend.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public UserDTO createUser(UserCreateDTO dto) {
        if (userRepository.existsByEmail(dto.email())) {
            throw new UserAlreadyExistsException("Usuário já existe");
        }

        User user = new User();
        user.setName(dto.name());
        user.setEmail(dto.email().toLowerCase().trim());
        user.setPassword(passwordEncoder.encode(dto.password()));
        user.setRoles(Set.of("USER"));

        User savedUser = userRepository.save(user);
        return UserDTO.fromEntity(savedUser);
    }

    public UserDTO getUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Usuário não encontrado"));

        return UserDTO.fromEntity(user);
    }

    public List<String> getAllUserNames() {
        return userRepository.findAll()
                .stream()
                .map(User::getName)
                .collect(Collectors.toList());
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Usuário não encontrado"));
    }

    private Set<String> validateRoles(Set<String> roles) {
        if (roles == null || roles.isEmpty()) {
            return Set.of("USER");
        }
        return roles.stream()
                .map(String::toUpperCase)
                .filter(role -> role.equals("USER") || role.equals("ADMIN") || role.equals("BIBLIOTECARIO"))
                .collect(Collectors.toSet());
    }

    @Transactional
    public UserUpdateResponseDTO updateUser(UUID id, UserUpdateDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Usuário não encontrado"));

        if (dto.name() != null && !dto.name().isBlank()) {
            user.setName(dto.name());
        }

        if (dto.email() != null && !dto.email().isBlank()) {
            String newEmail = dto.email().toLowerCase().trim();
            if (!newEmail.equalsIgnoreCase(user.getEmail())) {
                Optional<User> userWithNewEmail = userRepository.findByEmail(newEmail);
                if (userWithNewEmail.isPresent() && !userWithNewEmail.get().getId().equals(id)) {
                    throw new UserAlreadyExistsException("Email já está em uso por outro usuário.");
                }
                user.setEmail(newEmail);
            }
        }

        if (dto.newPassword() != null && !dto.newPassword().isBlank()) {
            if (dto.currentPassword() == null || dto.currentPassword().isBlank()) {
                throw new InvalidPasswordException("Senha atual é obrigatória para alterar a senha.");
            }
            if (!passwordEncoder.matches(dto.currentPassword(), user.getPassword())) {
                throw new InvalidPasswordException("Senha atual incorreta.");
            }
            user.setPassword(passwordEncoder.encode(dto.newPassword()));
        }

        User updatedUser = userRepository.save(user);
        String newToken = jwtService.generateToken(updatedUser);

        return new UserUpdateResponseDTO(UserDTO.fromEntity(updatedUser), newToken);
    }

    public void deleteUser(UUID id) {
        if (!userRepository.existsById(id)) {
            throw new UserNotFoundException("Usuário não encontrado");
        }
        userRepository.deleteById(id);
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserDTO::fromEntity)
                .toList();
    }

    @Transactional
    public UserDTO updateUserRoles(UUID id, Set<String> roles) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Usuário não encontrado"));

        user.setRoles(validateRoles(roles));
        User updatedUser = userRepository.save(user);
        return UserDTO.fromEntity(updatedUser);
    }
}
