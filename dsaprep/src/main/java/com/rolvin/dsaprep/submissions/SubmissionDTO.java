package com.rolvin.dsaprep.submissions;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionDTO {
    private Long id;
    private String code;
    private int languageId;
    private String status;
    private float runTime;
    private float memory;
    private String error;
    private String message;
    private Date createdAt;
    private Long problemId;
    private String problemTitle;

    public static SubmissionDTO fromSubmission(Submission submission) {
        return SubmissionDTO.builder()
                .id(submission.getId())
                .code(submission.getCode())
                .languageId(submission.getLanguageId())
                .status(submission.getStatus())
                .runTime(submission.getRunTime())
                .memory(submission.getMemory())
                .error(submission.getError())
                .message(submission.getMessage())
                .createdAt(submission.getCreatedAt())
                .problemId(submission.getProblem() != null ? submission.getProblem().getId() : null)
                .problemTitle(submission.getProblem() != null ? submission.getProblem().getTitle() : null)
                .build();
    }
}
