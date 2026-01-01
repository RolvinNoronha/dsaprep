package com.rolvin.dsaprep.problems;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Collections;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TestCase {
    private String input;
    private String expectedOutput;

    private static final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Parse test cases from JSON string stored in Problem.exampleTestCases
     * Expected format: [{"input": "...", "expectedOutput": "..."}, ...]
     */
    public static List<TestCase> parseTestCases(String jsonTestCases) {
        if (jsonTestCases == null || jsonTestCases.isBlank()) {
            return Collections.emptyList();
        }

        try {
            return objectMapper.readValue(jsonTestCases, new TypeReference<List<TestCase>>() {});
        } catch (JsonProcessingException e) {
            // If parsing fails, try to treat it as a simple input/output pair
            return Collections.singletonList(
                    TestCase.builder()
                            .input(jsonTestCases)
                            .expectedOutput("")
                            .build()
            );
        }
    }

    /**
     * Get the first test case or return an empty test case
     */
    public static TestCase getFirstTestCase(String jsonTestCases) {
        List<TestCase> testCases = parseTestCases(jsonTestCases);
        if (testCases.isEmpty()) {
            return TestCase.builder().input("").expectedOutput("").build();
        }
        return testCases.get(0);
    }
}
