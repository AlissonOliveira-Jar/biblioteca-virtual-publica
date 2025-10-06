package com.biblioteca.backend.config;

import com.biblioteca.backend.entity.User;
import com.biblioteca.backend.repository.UserRepository;
import com.biblioteca.backend.security.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.UUID;

@Component
public class OAuth2LoginHandler implements AuthenticationSuccessHandler {
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public OAuth2LoginHandler(UserRepository userRepository,@Lazy JwtService jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        DefaultOAuth2User oauth2User = (DefaultOAuth2User) authentication.getPrincipal();

        User user = userRepository.findByEmail(oauth2User.getAttribute("email"))
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(oauth2User.getAttribute("email"));
                    newUser.setName(oauth2User.getAttribute("name"));
                    newUser.setPassword(UUID.randomUUID().toString());
                    return userRepository.save(newUser);
                });

        String token = jwtService.generateToken(user);

        response.sendRedirect("http://localhost:3000/dashboard?token=" + token);
    }
}
