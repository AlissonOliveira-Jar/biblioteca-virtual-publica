package com.biblioteca.backend.dto.mapperDTO;

import com.biblioteca.backend.dto.response.ReportResponseDTO;
import com.biblioteca.backend.entity.Comment;
import com.biblioteca.backend.entity.Report;
import com.biblioteca.backend.entity.User;
import org.springframework.stereotype.Component;

@Component
public class ReportMapper {

    public ReportResponseDTO toDTO(Report report) {
        return new ReportResponseDTO(
                report.getId().toString(),
                report.getReason(),
                report.getStatus(),
                report.getCreatedAt(),
                toUserSummary(report.getReporter()),
                toCommentDTO(report.getReportedComment()),
                toUserSummary(report.getReportedUser())
        );
    }

    private ReportResponseDTO.UserSummaryDTO toUserSummary(User user) {
        if (user == null) return null;
        return new ReportResponseDTO.UserSummaryDTO(
                user.getId().toString(),
                user.getName(),
                user.getEmail()
        );
    }

    private ReportResponseDTO.ReportedCommentDTO toCommentDTO(Comment comment) {
        if (comment == null) return null;
        return new ReportResponseDTO.ReportedCommentDTO(
                comment.getId().toString(),
                comment.getContent(),
                toUserSummary(comment.getUser())
        );
    }
}