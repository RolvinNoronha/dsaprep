package com.rolvin.dsaprep.problems;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/problems")
@RequiredArgsConstructor
public class ProblemController {

    private final ProblemService problemService;

    @GetMapping
    public ResponseEntity<List<Problem>> getAllProblems() {
        return ResponseEntity.ok(problemService.getAllProblems());
    }

    @GetMapping("/{slug}")
    public ResponseEntity<Problem> getProblemBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(problemService.getProblemBySlug(slug));
    }

    @PostMapping
    public ResponseEntity<Problem> createProblem(@RequestBody Problem problem) {
        // ideally secure this with ADMIN role check
        return ResponseEntity.ok(problemService.createProblem(problem));
    }
}
