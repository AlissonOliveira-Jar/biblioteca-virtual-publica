package com.biblioteca.backend.dto.response;

import com.biblioteca.backend.dto.request.UserDTO;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Resposta da atualização de perfil bem-sucedida")
public record UserUpdateResponseDTO(
        @Schema(description = "Os dados atualizados do usuário")
        UserDTO user,

        @Schema(description = "O novo token JWT com as informações atualizadas")
        String token
) {
}
