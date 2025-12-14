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

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Service
public class ReportService {

    private static final Logger logger = LoggerFactory.getLogger(ReportService.class);

    private final ReportRepository reportRepository;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final ReportMapper mapper;
    private final ForumTopicRepository topicRepository;
    private final ForumPostRepository postRepository;

    public ReportService(ReportRepository reportRepository,
                         CommentRepository commentRepository,
                         UserRepository userRepository,
                         @Lazy UserService userService,
                         ReportMapper mapper,
                         ForumTopicRepository topicRepository,
                         ForumPostRepository postRepository) {
        this.reportRepository = reportRepository;
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        this.userService = userService;
        this.mapper = mapper;
        this.topicRepository = topicRepository;
        this.postRepository = postRepository;
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
        } else if (dto.reportedTopicId() != null) {
            ForumTopic topic = topicRepository.findById(UUID.fromString(dto.reportedTopicId()))
                    .orElseThrow(() -> new EntityNotFoundException("Tópico não encontrado"));
            report.setReportedTopic(topic);
        } else if (dto.reportedPostId() != null) {
            ForumPost post = postRepository.findById(UUID.fromString(dto.reportedPostId()))
                    .orElseThrow(() -> new EntityNotFoundException("Resposta não encontrada"));
            report.setReportedPost(post);
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
    public void resolveReport(UUID reportId, String action, String duration) {
        logger.info(">>> DEBUG: Iniciando resolveReport. ID: {}, Action: {}, Duration: {}", reportId, action, duration);

        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new EntityNotFoundException("Denúncia não encontrada"));

        switch (action) {
            case "DELETE_COMMENT":
                if (report.getReportedComment() != null) {
                    commentRepository.delete(report.getReportedComment());
                    report.setReportedComment(null);
                }
                break;

            case "DELETE_TOPIC":
                if (report.getReportedTopic() != null) {
                    topicRepository.delete(report.getReportedTopic());
                    report.setReportedTopic(null);
                }
                break;

            case "DELETE_POST":
                if (report.getReportedPost() != null) {
                    postRepository.delete(report.getReportedPost());
                    report.setReportedPost(null);
                }
                break;

            case "BAN_USER_COMMENT":
                User targetUser = extractTargetUser(report);

                if (targetUser != null) {
                    targetUser.setCommentBanned(true);

                    Instant expiryDate = calculateExpiryDate(duration);
                    targetUser.setCommentBanExpiresAt(expiryDate);

                    userRepository.save(targetUser);
                    logger.info("Usuário {} banido. Expira em: {}", targetUser.getEmail(), expiryDate);
                    deleteContentFromReport(report);
                }
                break;

            case "UNBAN_USER":
                User userToUnban = extractTargetUser(report);
                if (userToUnban != null) {
                    userToUnban.setCommentBanned(false);
                    userToUnban.setCommentBanExpiresAt(null);
                    userRepository.save(userToUnban);
                    logger.info("Usuário {} desbanido.", userToUnban.getEmail());
                }
                break;

            case "DELETE_USER":
                User userToDelete = extractTargetUser(report);

                if (userToDelete != null) {
                    report.setReportedUser(null);
                    report.setReportedComment(null);
                    report.setReportedTopic(null);
                    report.setReportedPost(null);
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

    private User extractTargetUser(Report report) {
        if (report.getReportedComment() != null) return report.getReportedComment().getUser();
        if (report.getReportedUser() != null) return report.getReportedUser();
        if (report.getReportedTopic() != null) return report.getReportedTopic().getAuthor();
        if (report.getReportedPost() != null) return report.getReportedPost().getAuthor();
        return null;
    }

    private void deleteContentFromReport(Report report) {
        if (report.getReportedComment() != null) {
            commentRepository.delete(report.getReportedComment());
            report.setReportedComment(null);
        } else if (report.getReportedTopic() != null) {
            topicRepository.delete(report.getReportedTopic());
            report.setReportedTopic(null);
        } else if (report.getReportedPost() != null) {
            postRepository.delete(report.getReportedPost());
            report.setReportedPost(null);
        }
    }

    private Instant calculateExpiryDate(String duration) {
        if (duration == null || duration.isEmpty()) {
            return null;
        }

        Instant now = Instant.now();

        return switch (duration.toUpperCase()) {
            case "2H" -> now.plus(2, ChronoUnit.HOURS);
            case "12H" -> now.plus(12, ChronoUnit.HOURS);
            case "1D" -> now.plus(1, ChronoUnit.DAYS);
            case "1W" -> now.plus(7, ChronoUnit.DAYS);
            case "1M" -> now.plus(30, ChronoUnit.DAYS);
            case "1Y" -> now.plus(365, ChronoUnit.DAYS);
            case "PERMANENT" -> null;
            default -> null;
        };
    }
}