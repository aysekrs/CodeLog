package com.codelog.comment;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.springframework.http.HttpStatus.FORBIDDEN;

@RestController
@RequestMapping("/api/admin/comments")
public class AdminCommentController {

    private final CommentServiceImpl commentService;

    public AdminCommentController(CommentServiceImpl commentService) {
        this.commentService = commentService;
    }

    @GetMapping("/pending")
    public ResponseEntity<List<Comment>> getPendingComments(Authentication authentication) {
        // Bu endpoint admin paneli icin. Admin degilse listeyi vermiyoruz.
        boolean isAdmin = false;
        if (authentication != null && authentication.isAuthenticated()
                && !(authentication instanceof AnonymousAuthenticationToken)) {
            for (GrantedAuthority authority : authentication.getAuthorities()) {
                if ("ROLE_ADMIN".equals(authority.getAuthority())) {
                    isAdmin = true;
                    break;
                }
            }
        }

        if (!isAdmin) {
            throw new ResponseStatusException(FORBIDDEN, "Bu listeye erismek icin admin olmalisiniz.");
        }
        return ResponseEntity.ok(commentService.getPendingComments());
    }
}
