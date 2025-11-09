package com.biblioteca.backend.document;

import com.biblioteca.backend.entity.User;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.util.Set;
import java.util.UUID;

@Getter
@Setter
@Document(indexName = "idx_users")
public class UserDocument {

    @Id
    private UUID id;

    @Field(type = FieldType.Text)
    private String name;

    @Field(type = FieldType.Keyword)
    private String email;

    @Field(type = FieldType.Keyword)
    private Set<String> roles;

    public static UserDocument from(User user) {
        UserDocument doc = new UserDocument();
        doc.setId(user.getId());
        doc.setName(user.getName());
        doc.setEmail(user.getEmail());
        doc.setRoles(user.getRoles());

        return doc;
    }
}
