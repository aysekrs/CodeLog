package com.codelog.comment;

import com.codelog.comment.dto.CreateCommentRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.springframework.http.HttpStatus.FORBIDDEN;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentServiceImpl commentService;

    public CommentController(CommentServiceImpl commentService) {
        this.commentService = commentService;
    }

    @PostMapping
    public ResponseEntity<Comment> createComment(@Valid @RequestBody CreateCommentRequest request) {
        // Burada kullanicidan gelen yorum kaydediliyor.
        // Yorum ilk etapta onaysiz olarak tutuluyor.
        Comment savedComment = commentService.createComment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedComment);
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<Comment>> getApprovedCommentsByPost(@PathVariable Long postId) {
        // Yazinin altinda sadece onayli yorumlar gosterilsin.
        return ResponseEntity.ok(commentService.getApprovedCommentsByPostId(postId));
    }

    @PatchMapping("/{commentId}/approve")
    public ResponseEntity<Comment> approveComment(@PathVariable Long commentId, Authentication authentication) {
        // Admin kontrolu acik bir sekilde burada yapiliyor.
        if (!isAdmin(authentication)) {
            throw new ResponseStatusException(FORBIDDEN, "Bu islemi yapmak icin yetkiniz yok!");
        }
        return ResponseEntity.ok(commentService.approveComment(commentId));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId, Authentication authentication) {
        // Yorumu sadece admin silebilsin.
        if (!isAdmin(authentication)) {
            throw new ResponseStatusException(FORBIDDEN, "Bu islemi yapmak icin yetkiniz yok!");
        }
        commentService.deleteComment(commentId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/admin/pending")
    public ResponseEntity<List<Comment>> getPendingComments(Authentication authentication) {
        // Moderasyon listesi sadece admin gorur.
        if (!isAdmin(authentication)) {
            throw new ResponseStatusException(FORBIDDEN, "Bu listeyi gormek icin admin yetkisi gerekiyor.");
        }
        return ResponseEntity.ok(commentService.getPendingComments());
    }

    private boolean isAdmin(Authentication authentication) {
        if (authentication == null) {
            return false;
        }
        if (!authentication.isAuthenticated()) {
            return false;
        }
        if (authentication instanceof AnonymousAuthenticationToken) {
            return false;
        }
        for (GrantedAuthority authority : authentication.getAuthorities()) {
            if ("ROLE_ADMIN".equals(authority.getAuthority())) {
                return true;
            }
        }
        return false;
    }
}
