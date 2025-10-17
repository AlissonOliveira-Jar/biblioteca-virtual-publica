package com.biblioteca.backend.controller;

import com.biblioteca.backend.dto.request.UserCreateDTO;
import com.biblioteca.backend.dto.request.UserDTO;
import com.biblioteca.backend.dto.request.UserUpdateDTO;
import com.biblioteca.backend.entity.User;
import com.biblioteca.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "Gerenciamento de Utilizadores")
public class UserController {

    private final UserService userService;

    @PostMapping
    @PreAuthorize("permitAll()")
    @Operation(
            summary = "Criar novo utilizador",
            description = "Registra um novo utilizador no sistema. Endpoint acessível publicamente.",
            responses = {
                    @ApiResponse(responseCode = "201", description = "Utilizador criado com sucesso",
                            content = @Content(schema = @Schema(implementation = UserDTO.class))),
                    @ApiResponse(responseCode = "400", description = "Dados inválidos ou email já em uso",
                            content = @Content(schema = @Schema(example = "{\"timestamp\":\"...\",\"status\":400,\"error\":\"Bad Request\",\"message\":\"Erro nos campos fornecidos\",\"details\":{\"email\":\"Email inválido\"}}")))
            }
    )
    public ResponseEntity<UserDTO> createUser(@Valid @RequestBody(description = "Dados para criação do utilizador", required = true) UserCreateDTO dto) {
        UserDTO createdUser = userService.createUser(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Obter todos os utilizadores",
            description = "Retorna uma lista de todos os utilizadores registados. Requer autenticação com papel ADMIN.",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @ApiResponse(responseCode = "200", description = "Lista de utilizadores retornada com sucesso",
                            content = @Content(schema = @Schema(implementation = List.class, subTypes = {UserDTO.class}))),
                    @ApiResponse(responseCode = "401", description = "Não autenticado"),
                    @ApiResponse(responseCode = "403", description = "Sem permissão (não é ADMIN)")
            }
    )
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    @PreAuthorize("#id == principal.id or hasRole('ADMIN')")
    @Operation(
            summary = "Obter utilizador por ID",
            description = "Retorna os dados de um utilizador específico pelo seu ID. Requer autenticação. O utilizador deve ser o próprio ou ter papel ADMIN.",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @ApiResponse(responseCode = "200", description = "Dados do utilizador retornados com sucesso",
                            content = @Content(schema = @Schema(implementation = UserDTO.class))),
                    @ApiResponse(responseCode = "401", description = "Não autenticado"),
                    @ApiResponse(responseCode = "403", description = "Sem permissão (não é o próprio utilizador ou não é ADMIN)"),
                    @ApiResponse(responseCode = "404", description = "Utilizador não encontrado")
            }
    )
    public ResponseEntity<UserDTO> getUserById(@Parameter(description = "ID do utilizador (UUID)", example = "a1b2c3d4-e5f6-7890-1234-567890abcdef") @PathVariable UUID id) {
        UserDTO user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }


    @GetMapping("/names")
    @PreAuthorize("hasRole('USER')")
    @Operation(
            summary = "Obter nomes de todos os utilizadores",
            description = "Retorna uma lista contendo apenas os nomes de todos os utilizadores registados. Requer autenticação com papel USER.",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @ApiResponse(responseCode = "200", description = "Lista de nomes retornada com sucesso",
                            content = @Content(schema = @Schema(implementation = List.class, subTypes = {String.class}))),
                    @ApiResponse(responseCode = "401", description = "Não autenticado"),
                    @ApiResponse(responseCode = "403", description = "Sem permissão (não tem papel USER)")
            }
    )
    public ResponseEntity<List<String>> getAllUserNames() {
        List<String> userNames = userService.getAllUserNames();
        return ResponseEntity.ok(userNames);
    }

    @PutMapping("/{id}")
    @PreAuthorize("#id == principal.id or hasRole('ADMIN')")
    @Operation(
            summary = "Atualizar utilizador por ID",
            description = "Atualiza os dados de um utilizador específico pelo seu ID. Requer autenticação. O utilizador deve ser o próprio ou ter papel ADMIN.",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @ApiResponse(responseCode = "200", description = "Utilizador atualizado com sucesso",
                            content = @Content(schema = @Schema(implementation = UserDTO.class))),
                    @ApiResponse(responseCode = "400", description = "Dados inválidos"),
                    @ApiResponse(responseCode = "401", description = "Não autenticado"),
                    @ApiResponse(responseCode = "403", description = "Sem permissão (não é o próprio utilizador ou não é ADMIN)"),
                    @ApiResponse(responseCode = "404", description = "Utilizador não encontrado")
            }
    )
    public ResponseEntity<UserDTO> updateUser(
            @Parameter(description = "ID do utilizador (UUID)", example = "a1b2c3d4-e5f6-7890-1234-567890abcdef") @PathVariable UUID id,
            @Valid @RequestBody(description = "Dados para atualização do utilizador", required = true) UserUpdateDTO dto
    ) {
        UserDTO updatedUser = userService.updateUser(id, dto);
        return ResponseEntity.ok(updatedUser);
    }

    @PatchMapping("/{id}/roles")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Atualizar papéis (roles) do utilizador",
            description = "Atualiza os papéis (roles) de um utilizador específico. Requer autenticação com papel ADMIN.",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @ApiResponse(responseCode = "200", description = "Papéis do utilizador atualizados com sucesso",
                            content = @Content(schema = @Schema(implementation = UserDTO.class))),
                    @ApiResponse(responseCode = "400", description = "Dados inválidos (formato dos papéis)"),
                    @ApiResponse(responseCode = "401", description = "Não autenticado"),
                    @ApiResponse(responseCode = "403", description = "Sem permissão (não é ADMIN)"),
                    @ApiResponse(responseCode = "404", description = "Utilizador não encontrado")
            }
    )
    public ResponseEntity<UserDTO> updateUserRoles(
            @Parameter(description = "ID do utilizador (UUID)", example = "a1b2c3d4-e5f6-7890-1234-567890abcdef") @PathVariable UUID id,
            @RequestBody(description = "Lista de papéis (strings) para o utilizador", required = true, content = @Content(schema = @Schema(implementation = Set.class, subTypes = {String.class}, example = "[\"USER\", \"ADMIN\"]"))) Set<String> roles
    ) {
        UserDTO updatedUser = userService.updateUserRoles(id, roles);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("#id == principal.id or hasRole('ADMIN')")
    @Operation(
            summary = "Excluir utilizador por ID",
            description = "Exclui um utilizador específico pelo seu ID. Requer autenticação. O utilizador deve ser o próprio ou ter papel ADMIN.",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @ApiResponse(responseCode = "204", description = "Utilizador excluído com sucesso"),
                    @ApiResponse(responseCode = "401", description = "Não autenticado"),
                    @ApiResponse(responseCode = "403", description = "Sem permissão (não é o próprio utilizador ou não é ADMIN)"),
                    @ApiResponse(responseCode = "404", description = "Utilizador não encontrado")
            }
    )
    public ResponseEntity<Void> deleteUser(@Parameter(description = "ID do utilizador (UUID)", example = "a1b2c3d4-e5f6-7890-1234-567890abcdef") @PathVariable UUID id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    @PreAuthorize("hasRole('USER')")
    @Operation(
            summary = "Excluir conta do utilizador autenticado",
            description = "Exclui a conta do utilizador que está atualmente autenticado. Requer autenticação com papel USER.",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @ApiResponse(responseCode = "204", description = "Conta excluída com sucesso"),
                    @ApiResponse(responseCode = "401", description = "Não autenticado"),
                    @ApiResponse(responseCode = "403", description = "Sem permissão (não tem papel USER)"),
            }
    )
    public ResponseEntity<Void> deleteMyAccount(Principal principal) {
        User user = userService.getUserByEmail(principal.getName());
        userService.deleteUser(user.getId());
        return ResponseEntity.noContent().build();
    }
}
