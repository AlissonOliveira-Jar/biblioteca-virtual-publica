package com.biblioteca.backend.config;

import com.biblioteca.backend.entity.User;
import com.biblioteca.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class InitialAdminCreator implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.initial.email}")
    private String adminEmail;

    @Value("${admin.initial.password}")
    private String adminPassword;

    @Value("${admin.initial.name}")
    private String adminName;

    public InitialAdminCreator(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByEmail(adminEmail)) {
            User adminUser = new User();
            adminUser.setName(adminName);
            adminUser.setEmail(adminEmail);
            adminUser.setPassword(passwordEncoder.encode(adminPassword));
            adminUser.setRoles(Set.of("ADMIN", "USER"));
            userRepository.save(adminUser);
            System.out.println("Administrador inicial criado com email: " + adminEmail);
        } else {
            System.out.println("Administrador inicial já existe com email: " + adminEmail);
        }
    }
}
