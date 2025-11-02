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

    // 🚨 CRÍTICO: Garante que a busca por email ocorra em sua própria transação de leitura.
    @Transactional(readOnly = true)
    public Optional<User> findUserByEmail(String email) {
        // Se o problema for o cache da sessão, uma nova transação readOnly deve resolver.
        Optional<User> user = userRepository.findByEmail(email);

        System.out.println("UserFindService: Buscando por email '" + email + "' - Encontrado: " + user.isPresent());

        return user;
    }
}