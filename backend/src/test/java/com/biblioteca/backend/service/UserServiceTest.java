package com.biblioteca.backend.service;

import com.biblioteca.backend.dto.request.UserCreateDTO;
import com.biblioteca.backend.dto.request.UserDTO;
import com.biblioteca.backend.entity.User;
import com.biblioteca.backend.exception.UserAlreadyExistsException;
import com.biblioteca.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Set;
import java.util.UUID;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private UserCreateDTO userCreateDTO;
    private User user;
    private final String encodedPassword = "senhaCript@grafada23";
    private final UUID userId = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        String userEmail = "teste@example.com";
        userCreateDTO = new UserCreateDTO("Teste User", userEmail, "senhaForte");
        user = new User();
        user.setId(userId);
        user.setName("Teste User");
        user.setEmail(userEmail);
        user.setPassword(encodedPassword);
        user.setRoles(Set.of("USER"));
    }

    @Test
    void createUser_Successfully() {
        when(userRepository.existsByEmail(userCreateDTO.email())).thenReturn(false);

        when(passwordEncoder.encode(userCreateDTO.password())).thenReturn(encodedPassword);

        when(userRepository.save(any(User.class))).thenReturn(user);

        UserDTO createdUserDTO = userService.createUser(userCreateDTO);

        assertNotNull(createdUserDTO);
        assertEquals(user.getId(), createdUserDTO.id());
        assertEquals(user.getName(), createdUserDTO.name());
        assertEquals(user.getEmail(), createdUserDTO.email());
        assertTrue(createdUserDTO.roles().contains("USER"));

        verify(userRepository, times(1)).existsByEmail(userCreateDTO.email());
        verify(passwordEncoder, times(1)).encode(userCreateDTO.password());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void createUser_ThrowsUserAlreadyExistsException_WhenEmailExists() {
        when(userRepository.existsByEmail(userCreateDTO.email())).thenReturn(true);

        assertThrows(UserAlreadyExistsException.class, () -> userService.createUser(userCreateDTO));

        verify(userRepository, times(1)).existsByEmail(userCreateDTO.email());
        verify(passwordEncoder, never()).encode(anyString());
        verify(userRepository, never()).save(any(User.class));
    }

}
