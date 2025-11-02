package com.biblioteca.backend.service;

import com.biblioteca.backend.entity.User;
import com.biblioteca.backend.security.oauth2.CustomOAuth2User;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
public class Oauth2UserService extends DefaultOAuth2UserService {

    private final RegistrationService registrationService;
    private final UserFindService userFindService;


    public Oauth2UserService(RegistrationService registrationService, UserFindService userFindService) {
        this.registrationService = registrationService;
        this.userFindService = userFindService;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest oauth2UserRequest) throws OAuth2AuthenticationException {
        System.out.println("=== Oauth2UserService.loadUser INICIADO");

        OAuth2User user = super.loadUser(oauth2UserRequest);

        String email = user.getAttribute("email");
        String name = user.getAttribute("name");

        User dbUser = userFindService.findUserByEmail(email)
                .orElseGet(() -> registrationService.registerNewUser(email, name));

        System.out.println("Oauth2UserService: Usuário no DB (ID: " + dbUser.getId() + ")");

        return new CustomOAuth2User(
                dbUser.getAuthorities(),
                user.getAttributes(),
                "email",
                dbUser
        );
    }
}