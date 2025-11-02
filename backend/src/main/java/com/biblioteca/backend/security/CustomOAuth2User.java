package com.biblioteca.backend.security.oauth2;

import com.biblioteca.backend.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import java.util.Collection;
import java.util.Map;
import java.util.UUID;


public class CustomOAuth2User extends DefaultOAuth2User {

    private final UUID dbUserId;
    private final String email;
    private final User dbUser;
    public CustomOAuth2User(Collection<? extends GrantedAuthority> authorities,
                            Map<String, Object> attributes,
                            String nameAttributeKey,
                            User dbUser) {

        super(authorities, attributes, nameAttributeKey);
        this.dbUserId = dbUser.getId();
        this.email = dbUser.getEmail();
        this.dbUser = dbUser;
    }

    public UUID getDbUserId() {
        return dbUserId;
    }

    public User getDbUser() {
        return dbUser;
    }

    @Override
    public String getName() {
        return this.email;
    }
}