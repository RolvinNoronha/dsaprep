package com.rolvin.dsaprep.problems;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "\"Problem\"")
public class Problem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String difficulty; // Easy, Medium, Hard

    @Column(name = "exampletestcases", columnDefinition = "TEXT")
    private String exampleTestCases; // JSON or formatted string for example I/O

    @Column(columnDefinition = "TEXT")
    private String constraints;
    
    // We might want to store driver code or templates separately, 
    // but for now, we'll keep it simple.
}
