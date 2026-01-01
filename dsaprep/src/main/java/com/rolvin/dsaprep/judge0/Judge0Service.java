package com.rolvin.dsaprep.judge0;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@Slf4j
public class Judge0Service
{
    private final RestTemplate restTemplate;
    private final String judge0BaseUrl;

    public Judge0Service(RestTemplate restTemplate, @Value("${judge0.api.url}") String judge0BaseUrl) {
        this.restTemplate = restTemplate;
        this.judge0BaseUrl = judge0BaseUrl;
        log.info("Judge0 API URL configured: {}", judge0BaseUrl);
    }

    public String submitCode(String sourceCode, int languageId, String stdin, String expectedOutput)
    {
        SubmitRequest submitRequest = SubmitRequest.builder()
                .sourceCode(sourceCode)
                .languageId(languageId)
                .stdin(stdin)
                .expectedOutput(expectedOutput)
                .build();

        String submissionsUrl = judge0BaseUrl + "/submissions?base64_encoded=false&wait=false";
        log.debug("Submitting code to Judge0: {}", submissionsUrl);
        
        SubmitResponse response = restTemplate.postForObject(
                submissionsUrl, 
                submitRequest,
                SubmitResponse.class
        );

        if (response != null && response.getToken() != null) {
            log.debug("Received token from Judge0: {}", response.getToken());
            return response.getToken();
        }
        throw new RuntimeException("Failed to submit code to Judge0");
    }

    public StatusResponse getSubmission(String token) {
        String url = judge0BaseUrl + "/submissions/" + token + "?base64_encoded=false&fields=stdout,stderr,status,message,compile_output,time,memory";
        return restTemplate.getForObject(url, StatusResponse.class);
    }

    /**
     * Poll for submission result with retry logic
     */
    public StatusResponse getSubmissionWithPolling(String token, int maxAttempts, long delayMs) {
        for (int attempt = 0; attempt < maxAttempts; attempt++) {
            StatusResponse response = getSubmission(token);
            
            if (response != null && response.getStatus() != null) {
                int statusId = response.getStatus().getId();
                // Status 1 = In Queue, Status 2 = Processing
                if (statusId != 1 && statusId != 2) {
                    return response;
                }
            }
            
            try {
                Thread.sleep(delayMs);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new RuntimeException("Polling interrupted", e);
            }
        }
        
        // Return last status even if still processing
        return getSubmission(token);
    }
}
