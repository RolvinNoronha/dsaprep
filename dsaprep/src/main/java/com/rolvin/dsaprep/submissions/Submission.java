package com.rolvin.dsaprep.submissions;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Submission
{
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;
    private String code;
    private int languageId;
    private String error;
    private float runtTime;
    private float memory;
    private String message;
    private Date createdAt;
    private String status;
    private String testCase;
    private String yourOutput;
    private String expectedOutput;
}
