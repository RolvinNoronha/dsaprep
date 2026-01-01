package com.rolvin.dsaprep.submissions;

import lombok.Data;

@Data
public class RunCodeRequest {
    private String sourceCode;
    private int languageId;
    private Long problemId;
}
