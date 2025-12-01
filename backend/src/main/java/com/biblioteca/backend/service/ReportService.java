package com.biblioteca.backend.service;

import com.biblioteca.backend.dto.mapperDTO.ReportMapper;
import com.biblioteca.backend.dto.request.ReportCreateDTO;
import com.biblioteca.backend.dto.response.ReportResponseDTO;
import com.biblioteca.backend.entity.*;
import com.biblioteca.backend.enums.*;
import com.biblioteca.backend.repository.*;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ReportService {

    private static final Logger logger = LoggerFactory.getLogger(ReportService.class);

    private final ReportRepository reportRepository;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final UserService userService; // <--- O SALVADOR DA PÁTRIA
    private final ReportMapper mapper;

    // Usamos @Lazy no UserService para evitar dependência circular se houver
    public ReportService(ReportRepository reportRepository,
                         CommentRepository commentRepository,
                         UserRepository userRepository,
                         @Lazy UserService userService,
                         ReportMapper mapper) {
        this.reportRepository = reportRepository;
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        this.userService = userService;
        this.mapper = mapper;
    }

    public void createReport(UUID reporterId, ReportCreateDTO dto) {
        User reporter = userRepository.findById(reporterId)
                .orElseThrow(() -> new RuntimeException("Repórter não encontrado"));

        Report report = new Report();
        report.setReporter(reporter);
        report.setReason(dto.reason());
        report.setStatus(ReportStatus.PENDING);

        if (dto.reportedCommentId() != null) {
            Comment comment = commentRepository.findById(UUID.fromString(dto.reportedCommentId()))
                    .orElseThrow(() -> new EntityNotFoundException("Comentário não encontrado"));
            report.setReportedComment(comment);
        } else if (dto.reportedUserId() != null) {
            User user = userRepository.findById(UUID.fromString(dto.reportedUserId()))
                    .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));
            report.setReportedUser(user);
        }
        reportRepository.save(report);
    }

    public List<ReportResponseDTO> listPending() {
        return reportRepository.findByStatusOrderByCreatedAtDesc(ReportStatus.PENDING)
                .stream()
                .map(mapper::toDTO)
                .toList();
    }

    public List<Report> getPendingReports() {
        return reportRepository.findByStatusOrderByCreatedAtDesc(ReportStatus.PENDING);
    }

    @Transactional
    public void resolveReport(UUID reportId, String action) {
        logger.info(">>> DEBUG: Iniciando resolveReport. ID: {}, Action: {}", reportId, action);

        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new EntityNotFoundException("Denúncia não encontrada"));

        switch (action) {
            case "DELETE_COMMENT":
                logger.info(">>> DEBUG: Entrou no case DELETE_COMMENT");
                if (report.getReportedComment() != null) {
                    commentRepository.delete(report.getReportedComment());
                    report.setReportedComment(null);
                }
                break;

            case "BAN_USER_COMMENT":
                logger.info(">>> DEBUG: Entrou no case BAN_USER_COMMENT");
                User targetUser = null;

                // Lógica para identificar quem banir
                if (report.getReportedComment() != null) {
                    targetUser = report.getReportedComment().getUser();
                } else if (report.getReportedUser() != null) {
                    targetUser = report.getReportedUser();
                }

                // 1. BANIR O UTILIZADOR
                if (targetUser != null) {
                    logger.info(">>> DEBUG: Banindo comentários do utilizador ID: {}", targetUser.getId());
                    targetUser.setCommentBanned(true);
                    userRepository.save(targetUser);
                }

                // 2. APAGAR O COMENTÁRIO DA DENÚNCIA (NOVA LÓGICA AQUI)
                if (report.getReportedComment() != null) {
                    logger.info(">>> DEBUG: Apagando o comentário tóxico que gerou o banimento...");
                    commentRepository.delete(report.getReportedComment());
                    report.setReportedComment(null); // Remove referência para evitar erros
                }
                break;

            case "DELETE_USER":
                // ... (mantenha a lógica do DELETE_USER que fizemos antes)
                logger.info(">>> DEBUG: Entrou no case DELETE_USER");
                User userToDelete = null;

                if (report.getReportedUser() != null) {
                    userToDelete = report.getReportedUser();
                } else if (report.getReportedComment() != null) {
                    userToDelete = report.getReportedComment().getUser();
                }

                if (userToDelete != null) {
                    report.setReportedUser(null);
                    report.setReportedComment(null);
                    userService.deleteUser(userToDelete.getId());
                }
                break;

            case "REJECT":
                logger.info(">>> DEBUG: Denúncia ignorada/rejeitada.");
                break;

            default:
                throw new IllegalArgumentException("Ação inválida: " + action);
        }

        report.setStatus(ReportStatus.RESOLVED);
        reportRepository.save(report);
    }
}