package com.rolvin.dsaprep.submissions;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/")
public class SubmissionsController
{
    @GetMapping
    ResponseEntity<String> getAllSubmissions()
    {

        return null;
    }

    @PostMapping("/run-code")
    ResponseEntity<String> runCode()
    {

        return null;
    }

    @PostMapping("/submit-code")
    ResponseEntity<String> submitCode()
    {
        return null;
    }
}
