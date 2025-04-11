package com.biblioteca.backend.security;

import com.biblioteca.backend.entity.User;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
public class JwtService {

    private final JwtEncoder jwtEncoder;
    private static final long EXPIRATION_HOURS = 24;

    public JwtService(JwtEncoder jwtEncoder) {
        this.jwtEncoder = jwtEncoder;
    }

    public String generateToken(User user) {
        Instant now = Instant.now();

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("biblioteca-backend")
                .subject(user.getId().toString())
                .claim("roles", user.getRoles())
                .issuedAt(now)
                .expiresAt(now.plus(EXPIRATION_HOURS, ChronoUnit.HOURS))
                .build();

        return jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }
}
