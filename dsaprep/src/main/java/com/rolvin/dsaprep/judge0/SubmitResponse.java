package com.rolvin.dsaprep.judge0;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SubmitResponse
{
    @JsonProperty("token")
    private String token;
}
