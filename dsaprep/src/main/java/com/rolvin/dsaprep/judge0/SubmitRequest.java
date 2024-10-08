package com.rolvin.dsaprep.judge0;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;

@Builder
public class SubmitRequest
{
    @JsonProperty("source_code")
    private String sourceCode;

    @JsonProperty("language_id")
    private int languageId;

    private String stdin;

    @JsonProperty("expected_output")
    private String expectedOutput;
}
