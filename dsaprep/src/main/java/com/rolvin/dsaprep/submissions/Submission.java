package com.rolvin.dsaprep.submissions;

import com.rolvin.dsaprep.problems.Problem;
import com.rolvin.dsaprep.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "\"Submission\"")
public class Submission
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String code;
    private int languageId;
    private String error;
    private float runTime;
    private float memory;
    private String message;
    private Date createdAt;
    private String status;
    private String testCase;
    private String yourOutput;
    private String expectedOutput;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id")
    private Problem problem;
}
