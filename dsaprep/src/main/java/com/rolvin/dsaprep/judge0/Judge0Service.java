package com.rolvin.dsaprep.judge0;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
@RequiredArgsConstructor
public class Judge0Service
{
    private final RestTemplate restTemplate;

    public String submitCode(String source_code, int language_id, String stdin, String expected_output)
    {
        SubmitRequest submitRequest = SubmitRequest.builder()
                .sourceCode(source_code)
                .languageId(language_id)
                .stdin(stdin)
                .expectedOutput(expected_output)
                .build();

        SubmitResponse response = restTemplate.postForObject(
                "https://api.judge0.com/submissions",
                submitRequest,
                SubmitResponse.class
        );


        return response.getToken();
    }

    public boolean checkStatus(List<String> submissionTokens)
    {
        for (String token: submissionTokens)
        {


        }

        return false;
    }
}
