package com.biblioteca.backend.controller;

import com.biblioteca.backend.dto.request.UserCreateDTO;
import com.biblioteca.backend.dto.request.UserDTO;
import com.biblioteca.backend.dto.request.UserUpdateDTO;
import com.biblioteca.backend.dto.response.UserUpdateResponseDTO;
import com.biblioteca.backend.dto.response.UserRankingDTO;
import com.biblioteca.backend.entity.User;
import com.biblioteca.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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
public class UserController {

    private final UserService userService;

    @PostMapping
    @PreAuthorize("permitAll()")
    public ResponseEntity<UserDTO> createUser(@Valid @RequestBody UserCreateDTO dto) {
        UserDTO createdUser = userService.createUser(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    @PreAuthorize("@userService.getUserByEmail(principal.name).id == #id or hasRole('ADMIN')")
    public ResponseEntity<UserDTO> getUserById(@PathVariable UUID id) {
        UserDTO user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserDTO> getMyProfile(Principal principal) {
        UserDTO user = userService.getUserByEmail(principal.getName()); 
        return ResponseEntity.ok(user);
    }

    @GetMapping("/names")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<String>> getAllUserNames() {
        List<String> userNames = userService.getAllUserNames();
        return ResponseEntity.ok(userNames);
    }
    @GetMapping("/ranking")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<UserRankingDTO>> getUsersRanking() {
        List<UserRankingDTO> ranking = userService.getUsersRanking();
        return ResponseEntity.ok(ranking);
    }

    @PutMapping("/{id}")
    @PreAuthorize("@userService.getUserByEmail(principal.name).id == #id or hasRole('ADMIN')")
    public ResponseEntity<UserUpdateResponseDTO> updateUser(
            @PathVariable UUID id,
            @Valid @RequestBody UserUpdateDTO dto
    ) {
        UserUpdateResponseDTO response = userService.updateUser(id, dto);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/roles")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDTO> updateUserRoles(
            @PathVariable UUID id,
            @RequestBody Set<String> roles
    ) {
        UserDTO updatedUser = userService.updateUserRoles(id, roles);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        UUID userIdToDelete = UUID.fromString(id);
        userService.deleteUser(userIdToDelete);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteMyAccount(Principal principal) {
        User user = userService.getUserEntityByEmail(principal.getName()); 
        userService.deleteUser(user.getId());
        return ResponseEntity.noContent().build();
    }
}
