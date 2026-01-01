package com.rolvin.dsaprep.submissions;

import com.rolvin.dsaprep.judge0.StatusResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RunCodeResponse {
    private String stdout;
    private String stderr;
    private String compileOutput;
    private String message;
    private String time;
    private Long memory;
    private StatusInfo status;
    
    // Test case details
    private String input;
    private String expectedOutput;
    private String actualOutput;
    private boolean passed;
    
    // For submit: results of all test cases
    private List<TestCaseResult> testCaseResults;
    private int passedCount;
    private int totalCount;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StatusInfo {
        private int id;
        private String description;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TestCaseResult {
        private int testCaseNumber;
        private String input;
        private String expectedOutput;
        private String actualOutput;
        private boolean passed;
        private String time;
        private Long memory;
        private String errorMessage;
    }

    public static RunCodeResponse fromStatusResponse(StatusResponse response, String input, String expectedOutput) {
        String actualOutput = response.getStdout() != null ? response.getStdout().trim() : "";
        String expected = expectedOutput != null ? expectedOutput.trim() : "";
        boolean passed = actualOutput.equals(expected) && response.getStatus() != null && response.getStatus().getId() == 3;

        return RunCodeResponse.builder()
                .stdout(response.getStdout())
                .stderr(response.getStderr())
                .compileOutput(response.getCompileOutput())
                .message(response.getMessage())
                .time(response.getTime())
                .memory(response.getMemory())
                .status(response.getStatus() != null 
                        ? StatusInfo.builder()
                            .id(response.getStatus().getId())
                            .description(response.getStatus().getDescription())
                            .build()
                        : null)
                .input(input)
                .expectedOutput(expectedOutput)
                .actualOutput(actualOutput)
                .passed(passed)
                .build();
    }
}
