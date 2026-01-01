package com.rolvin.dsaprep.submissions;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubmissionRepository extends JpaRepository<Submission, Long>
{
    List<Submission> findAllByUserIdAndProblemIdOrderByCreatedAtDesc(Long userId, Long problemId);
    List<Submission> findAllByUserIdOrderByCreatedAtDesc(Long userId);
}
