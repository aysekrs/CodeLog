package com.codelog.like;

import com.codelog.like.dto.LikeToggleResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@RestController
@RequestMapping("/api/posts")
public class LikeController {

    private final LikeServiceImpl likeService;

    public LikeController(LikeServiceImpl likeService) {
        this.likeService = likeService;
    }

    @PostMapping("/{postId}/like")
    public ResponseEntity<LikeToggleResponse> toggleLike(@PathVariable Long postId, Authentication authentication) {
        // Giris yapmayan kullanicinin begeni atmasini engelliyoruz.
        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication instanceof AnonymousAuthenticationToken) {
            throw new ResponseStatusException(UNAUTHORIZED, "Begeni verebilmek icin lutfen once giris yapin.");
        }

        // Giris yapan kullanici icin like/unlike islemi.
        LikeToggleResponse response = likeService.toggleLike(postId, authentication.getName());
        return ResponseEntity.ok(response);
    }
}
