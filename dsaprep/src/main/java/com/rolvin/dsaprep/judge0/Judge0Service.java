package com.rolvin.dsaprep.judge0;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Service
@Slf4j
public class Judge0Service
{
    private final RestTemplate restTemplate;
    private final String judge0BaseUrl;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public Judge0Service(RestTemplate restTemplate, @Value("${judge0.api.url}") String judge0BaseUrl) {
        this.restTemplate = restTemplate;
        this.judge0BaseUrl = judge0BaseUrl;
        log.info("Judge0 API URL configured: {}", judge0BaseUrl);
    }

    private String encodeBase64(String value) {
        if (value == null) return null;
        return Base64.getEncoder().encodeToString(value.getBytes(StandardCharsets.UTF_8));
    }

    public String submitCode(String sourceCode, Integer languageId, String stdin, String expectedOutput)
    {
        // Encode all string fields as base64
        SubmitRequest submitRequest = SubmitRequest.builder()
                .sourceCode(encodeBase64(sourceCode))
                .languageId(languageId)
                .stdin(encodeBase64(stdin))
                .expectedOutput(encodeBase64(expectedOutput))
                .build();

        String submissionsUrl = judge0BaseUrl + "/submissions?base64_encoded=true&wait=false";
        
        // Set Content-Type header
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        log.info("Submitting to Judge0: URL={}, languageId={}, sourceCode length={}", 
                submissionsUrl, languageId, sourceCode != null ? sourceCode.length() : 0);
        
        // Serialize and send the JSON
        String jsonPayload;
        try {
            jsonPayload = objectMapper.writeValueAsString(submitRequest);
            log.info("Sending base64-encoded request to Judge0, payload: {}", jsonPayload);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize request", e);
            throw new RuntimeException("Failed to serialize request", e);
        }
        
        HttpEntity<String> jsonRequest = new HttpEntity<>(jsonPayload, headers);
        
        SubmitResponse response = restTemplate.postForObject(
                submissionsUrl, 
                jsonRequest,
                SubmitResponse.class
        );

        if (response != null && response.getToken() != null) {
            log.info("Received token from Judge0: {}", response.getToken());
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
