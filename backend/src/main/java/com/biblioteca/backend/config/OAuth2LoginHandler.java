package com.biblioteca.backend.config;

import lombok.extern.slf4j.Slf4j;
import com.biblioteca.backend.entity.User;
import com.biblioteca.backend.repository.UserRepository;
import com.biblioteca.backend.security.JwtService;
import com.biblioteca.backend.security.oauth2.CustomOAuth2User;
import com.biblioteca.backend.service.RegistrationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.io.IOException;

@Slf4j
@Component

public class OAuth2LoginHandler implements AuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final RegistrationService registrationService;

    public OAuth2LoginHandler(UserRepository userRepository,
                              @Lazy JwtService jwtService,
                              RegistrationService registrationService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.registrationService = registrationService; // INJEÇÃO
    }

    @Override
    @Transactional
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        Object principal = authentication.getPrincipal();
        String email;
        String name;

        if (principal instanceof CustomOAuth2User) {
            CustomOAuth2User customUser = (CustomOAuth2User) principal;
            email = customUser.getName();
            name = customUser.getAttribute("name");
        } else if (principal instanceof OAuth2User) {
            OAuth2User defaultUser = (OAuth2User) principal;
            email = defaultUser.getAttribute("email");
            name = defaultUser.getAttribute("name");
        } else {
            log.error("CRÍTICO: Objeto Principal de autenticação inválido.");
            throw new RuntimeException("Falha crítica de autenticação: Objeto principal inválido.");
        }


        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    log.info("Usuário com email {} não encontrado. Iniciando REGISTRO...", email);
                    return registrationService.registerNewUser(email, name);
                });
        String token = jwtService.generateToken(user);
        log.info("Token gerado com sucesso para usuário: {}", email);

        response.sendRedirect("http://localhost:3000/auth/callback?token=" + token);
    }
}