package com.nazli.blog.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

@Component
public class JwtTokenProvider {

    private final SecretKey signingKey;

    public JwtTokenProvider(@Value("${security.jwt.secret}") String secret) {
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String tokenOlustur(Long userId, String username) {
        return Jwts.builder()
                .subject(username)
                .claim("userId", userId)
                .issuedAt(new java.util.Date())
                .expiration(new java.util.Date(System.currentTimeMillis() + 86400000)) // 1 gun
                .signWith(signingKey)
                .compact();
    }

    public JwtUserPrincipal kullaniciyiCoz(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        Long kullaniciId = kullaniciIdCoz(claims);
        String kullaniciAdi = claims.getSubject() != null ? claims.getSubject() : "user-" + kullaniciId;
        return new JwtUserPrincipal(kullaniciId, kullaniciAdi);
    }

    private Long kullaniciIdCoz(Claims claims) {
        Object value = claims.get("userId");
        if (value != null) {
            return Long.parseLong(String.valueOf(value));
        }
        if (claims.getSubject() != null) {
            return Long.parseLong(claims.getSubject());
        }
        throw new IllegalArgumentException("Token icinde kullanici bilgisi bulunamadi.");
    }
}
