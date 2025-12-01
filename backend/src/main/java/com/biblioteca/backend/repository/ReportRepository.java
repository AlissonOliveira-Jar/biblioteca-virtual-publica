package com.biblioteca.backend.repository;

import com.biblioteca.backend.entity.Report;
import com.biblioteca.backend.entity.User; // <--- Importe o User
import com.biblioteca.backend.enums.ReportStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ReportRepository extends JpaRepository<Report, UUID> {

    @EntityGraph(attributePaths = {"reporter", "reportedComment", "reportedUser", "reportedComment.user"})
    List<Report> findByStatusOrderByCreatedAtDesc(ReportStatus status);

    List<Report> findByReporter(User reporter);
    List<Report> findByReportedUser(User reportedUser);
}