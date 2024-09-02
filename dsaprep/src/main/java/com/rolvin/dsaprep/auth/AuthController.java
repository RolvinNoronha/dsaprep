package com.rolvin.dsaprep.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController
{
    private final AuthService service;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request)
    {
        AuthResponse authResponse = service.register(request);
        return new ResponseEntity<>(authResponse, HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request)
    {
        AuthResponse authResponse = service.login(request);
        if (authResponse == null) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }

        if (authResponse.token == "") {

            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        }

        return new ResponseEntity<>(authResponse, HttpStatus.OK);
    }
}
