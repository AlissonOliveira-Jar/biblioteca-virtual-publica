package com.biblioteca.backend.service;

import com.biblioteca.backend.entity.User;
import com.biblioteca.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.transaction.annotation.Propagation;



@Service
public class RegistrationService {

    private final UserRepository userRepository;

    public RegistrationService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(propagation = Propagation.REQUIRED)
    public User registerNewUser(String email, String name) {

        User newUser = new User(name, email);
        newUser.setPassword("OAUTH2_NO_PASSWORD_REQUIRED");

        User savedUser = userRepository.saveAndFlush(newUser);

        System.out.println("RegistrationService: Novo usuário SALVO E FLUSHED no DB com ID: " + savedUser.getId());

        return savedUser;
    }
}