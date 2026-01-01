package com.rolvin.dsaprep.submissions;

import com.rolvin.dsaprep.judge0.Judge0Service;
import com.rolvin.dsaprep.judge0.StatusResponse;
import com.rolvin.dsaprep.problems.Problem;
import com.rolvin.dsaprep.problems.ProblemService;
import com.rolvin.dsaprep.problems.TestCase;
import com.rolvin.dsaprep.user.User;
import com.rolvin.dsaprep.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/v1/submissions")
@RequiredArgsConstructor
@Slf4j
public class SubmissionsController
{
    private final Judge0Service judge0Service;
    private final ProblemService problemService;
    private final SubmissionRepository submissionRepository;
    private final UserRepository userRepository;

    private static final int MAX_POLL_ATTEMPTS = 10;
    private static final long POLL_DELAY_MS = 1000;

    /**
     * Get all submissions for the authenticated user
     */
    @GetMapping
    public ResponseEntity<List<SubmissionDTO>> getAllSubmissions(@AuthenticationPrincipal UserDetails userDetails)
    {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        List<Submission> submissions = submissionRepository.findAllByUserIdOrderByCreatedAtDesc(user.getId());
        List<SubmissionDTO> dtos = submissions.stream()
                .map(SubmissionDTO::fromSubmission)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    /**
     * Get submissions for a specific problem by the authenticated user
     */
    @GetMapping("/problem/{problemId}")
    public ResponseEntity<List<SubmissionDTO>> getSubmissionsForProblem(
            @PathVariable Long problemId,
            @AuthenticationPrincipal UserDetails userDetails)
    {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        List<Submission> submissions = submissionRepository.findAllByUserIdAndProblemIdOrderByCreatedAtDesc(user.getId(), problemId);
        List<SubmissionDTO> dtos = submissions.stream()
                .map(SubmissionDTO::fromSubmission)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    /**
     * Run code against the first test case (no auth required for quick testing)
     */
    @PostMapping("/run")
    public ResponseEntity<RunCodeResponse> runCode(@RequestBody RunCodeRequest request)
    {
        Problem problem = problemService.getProblemById(request.getProblemId());
        
        // Get the first test case
        TestCase testCase = TestCase.getFirstTestCase(problem.getExampleTestCases());
        String input = testCase.getInput();
        String expectedOutput = testCase.getExpectedOutput();
        
        log.debug("Running code for problem {} with input: {}", problem.getId(), input);
        
        // Submit to Judge0
        String token = judge0Service.submitCode(
                request.getSourceCode(), 
                request.getLanguageId(), 
                input, 
                expectedOutput
        );
        
        // Poll for result
        StatusResponse result = judge0Service.getSubmissionWithPolling(token, MAX_POLL_ATTEMPTS, POLL_DELAY_MS);
        
        // Build response with test case context
        RunCodeResponse response = RunCodeResponse.fromStatusResponse(result, input, expectedOutput);
        return ResponseEntity.ok(response);
    }

    /**
     * Submit code - runs against all test cases and saves the submission
     */
    @PostMapping("/submit")
    public ResponseEntity<RunCodeResponse> submitCode(
            @RequestBody RunCodeRequest request, 
            @AuthenticationPrincipal UserDetails userDetails)
    {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        Problem problem = problemService.getProblemById(request.getProblemId());

        // Get all test cases
        List<TestCase> testCases = TestCase.parseTestCases(problem.getExampleTestCases());
        
        if (testCases.isEmpty()) {
            // If no test cases, just run the code without validation
            testCases.add(TestCase.builder().input("").expectedOutput("").build());
        }

        List<RunCodeResponse.TestCaseResult> testCaseResults = new ArrayList<>();
        int passedCount = 0;
        String overallStatus = "Accepted";
        float totalTime = 0f;
        long maxMemory = 0L;
        String lastError = null;

        // Run against each test case
        for (int i = 0; i < testCases.size(); i++) {
            TestCase tc = testCases.get(i);
            
            String token = judge0Service.submitCode(
                    request.getSourceCode(),
                    request.getLanguageId(),
                    tc.getInput(),
                    tc.getExpectedOutput()
            );
            
            StatusResponse result = judge0Service.getSubmissionWithPolling(token, MAX_POLL_ATTEMPTS, POLL_DELAY_MS);
            
            String actualOutput = result.getStdout() != null ? result.getStdout().trim() : "";
            String expected = tc.getExpectedOutput() != null ? tc.getExpectedOutput().trim() : "";
            boolean passed = actualOutput.equals(expected) && result.getStatus() != null && result.getStatus().getId() == 3;
            
            if (passed) {
                passedCount++;
            } else if (result.getStatus() != null) {
                overallStatus = result.getStatus().getDescription();
                if (result.getStderr() != null) {
                    lastError = result.getStderr();
                } else if (result.getCompileOutput() != null) {
                    lastError = result.getCompileOutput();
                }
            }

            if (result.getTime() != null) {
                try {
                    totalTime += Float.parseFloat(result.getTime());
                } catch (NumberFormatException e) {
                    // ignore
                }
            }
            if (result.getMemory() != 0 && result.getMemory() > maxMemory) {
                maxMemory = result.getMemory();
            }

            testCaseResults.add(RunCodeResponse.TestCaseResult.builder()
                    .testCaseNumber(i + 1)
                    .input(tc.getInput())
                    .expectedOutput(tc.getExpectedOutput())
                    .actualOutput(actualOutput)
                    .passed(passed)
                    .time(result.getTime())
                    .memory(result.getMemory())
                    .errorMessage(result.getStderr() != null ? result.getStderr() : result.getCompileOutput())
                    .build());
        }

        // Determine final status
        if (passedCount == testCases.size()) {
            overallStatus = "Accepted";
        } else if (!"Accepted".equals(overallStatus)) {
            // Keep the error status
        } else {
            overallStatus = "Wrong Answer";
        }

        // Save submission
        Submission submission = Submission.builder()
                .code(request.getSourceCode())
                .languageId(request.getLanguageId())
                .status(overallStatus)
                .runTime(totalTime)
                .memory(maxMemory)
                .error(lastError)
                .createdAt(new Date())
                .user(user)
                .problem(problem)
                .build();
        
        submissionRepository.save(submission);

        // Build response
        RunCodeResponse response = RunCodeResponse.builder()
                .status(RunCodeResponse.StatusInfo.builder()
                        .id(passedCount == testCases.size() ? 3 : 4)
                        .description(overallStatus)
                        .build())
                .testCaseResults(testCaseResults)
                .passedCount(passedCount)
                .totalCount(testCases.size())
                .time(String.valueOf(totalTime))
                .memory(maxMemory)
                .passed(passedCount == testCases.size())
                .build();

        return ResponseEntity.ok(response);
    }
}
