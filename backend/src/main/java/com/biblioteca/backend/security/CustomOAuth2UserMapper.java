package com.biblioteca.backend.security.oauth2;

import com.biblioteca.backend.service.Oauth2UserService;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2UserAuthority;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.function.Function;


@Component
public class CustomOAuth2UserMapper implements Function<OAuth2UserRequest, OAuth2User> {

    private final Oauth2UserService oauth2UserService;

    public CustomOAuth2UserMapper(Oauth2UserService oauth2UserService) {
        this.oauth2UserService = oauth2UserService;
    }

    @Override
    public OAuth2User apply(OAuth2UserRequest userRequest) {
        OAuth2User customUser = oauth2UserService.loadUser(userRequest);


        System.out.println("CustomOAuth2UserMapper: Retornando o CustomOAuth2User do serviço.");
        return customUser;
    }
}