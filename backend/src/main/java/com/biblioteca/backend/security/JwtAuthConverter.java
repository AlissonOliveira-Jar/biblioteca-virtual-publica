package com.biblioteca.backend.security;

import com.biblioteca.backend.entity.User;
import com.biblioteca.backend.repository.UserRepository;
import org.springframework.core.convert.converter.Converter;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class JwtAuthConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    private final JwtGrantedAuthoritiesConverter authoritiesConverter = new JwtGrantedAuthoritiesConverter();
    private final UserRepository userRepository;

    public JwtAuthConverter(UserRepository userRepository) {
        this.userRepository = userRepository;
        authoritiesConverter.setAuthorityPrefix("ROLE_");
        authoritiesConverter.setAuthoritiesClaimName("roles");
    }

    @Transactional
    @Override
    public AbstractAuthenticationToken convert(@NonNull Jwt jwt) {
        Collection<GrantedAuthority> authorities = authoritiesConverter.convert(jwt).stream()
                .map(GrantedAuthority.class::cast)
                .collect(Collectors.toList());

        String userId = jwt.getSubject();
        User user = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado a partir do token"));

        return new UsernamePasswordAuthenticationToken(user, "n/a", authorities);
    }
}
