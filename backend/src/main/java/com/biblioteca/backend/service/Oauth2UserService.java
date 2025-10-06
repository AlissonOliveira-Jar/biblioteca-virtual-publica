package com.biblioteca.backend.service;

import com.biblioteca.backend.entity.User;
import com.biblioteca.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Collections;
@Service

public class Oauth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    public Oauth2UserService(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest oauth2userRequest) throws OAuth2AuthenticationException{
        OAuth2User user = super.loadUser(oauth2userRequest);

        String email = user.getAttribute("email");
        String name = user.getAttribute("name");
        userRepository.findByEmail(email).orElseGet(() ->{
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setName(name != null ? name: "Usuário sem nome");
            newUser.setRoles(Collections.singleton("USER"));
            User saved = userRepository.save(newUser);
            System.out.println("Novo usuário registrado" + newUser.getEmail());
            return saved;
        });
        return user;
    }
}
