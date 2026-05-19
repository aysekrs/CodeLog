package com.nazli.blog.api.controller;

import com.nazli.blog.security.JwtTokenProvider;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final JwtTokenProvider tokenProvider;

    public AuthController(JwtTokenProvider tokenProvider) {
        this.tokenProvider = tokenProvider;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String email = request.getOrDefault("email", "demo@codelog.dev");
        // Her e-posta için tutarlı bir kullanici ID'si üret
        // Ayni e-posta her zaman aynı ID'yi alır → kendi yazılarını görür
        long userId = Math.abs((long) email.hashCode()) % 1000 + 1;
        String token = tokenProvider.tokenOlustur(userId, email);
        return ResponseEntity.ok(Map.of("accessToken", token, "email", email, "userId", userId));
    }
}
