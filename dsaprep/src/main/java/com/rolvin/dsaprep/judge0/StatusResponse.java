package com.rolvin.dsaprep.judge0;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class StatusResponse {
    private String stdout;
    private String time;
    private long memory;
    private String stderr;
    private String token;
    
    @JsonProperty("compile_output")
    private String compileOutput;
    
    private String message;
    
    private Status status;

    @Data
    public static class Status {
        private int id;
        private String description;
    }
}
