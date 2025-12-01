package com.biblioteca.backend.controller;

import com.biblioteca.backend.dto.request.ReportCreateDTO;
import com.biblioteca.backend.dto.response.ReportResponseDTO;
import com.biblioteca.backend.entity.User;
import com.biblioteca.backend.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired private ReportService service;

    @PostMapping
    public ResponseEntity<Void> create(@RequestBody ReportCreateDTO dto, @AuthenticationPrincipal User user) {
        service.createReport(user.getId(), dto);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReportResponseDTO>> listPending() {
        return ResponseEntity.ok(service.listPending());
    }

    @PostMapping("/admin/{id}/resolve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> resolve(@PathVariable String id, @RequestParam String action) {
        service.resolveReport(UUID.fromString(id), action);
        return ResponseEntity.ok().build();
    }
}