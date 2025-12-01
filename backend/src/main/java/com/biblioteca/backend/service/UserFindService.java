package com.biblioteca.backend.service;

import com.biblioteca.backend.entity.User;
import com.biblioteca.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

@Service
public class UserFindService {

    private final UserRepository userRepository;

    public UserFindService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public Optional<User> findUserByEmail(String email) {
        Optional<User> user = userRepository.findByEmail(email);

        System.out.println("UserFindService: Buscando por email '" + email + "' - Encontrado: " + user.isPresent());

        return user;
    }
}