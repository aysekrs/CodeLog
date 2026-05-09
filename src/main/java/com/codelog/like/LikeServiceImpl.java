package com.codelog.like;

import com.codelog.like.dto.LikeToggleResponse;
import com.codelog.post.Post;
import com.codelog.post.PostLike;
import com.codelog.post.PostLikeRepository;
import com.codelog.post.PostRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class LikeServiceImpl {

    private final PostRepository postRepository;
    private final PostLikeRepository postLikeRepository;

    public LikeServiceImpl(PostRepository postRepository, PostLikeRepository postLikeRepository) {
        this.postRepository = postRepository;
        this.postLikeRepository = postLikeRepository;
    }

    @Transactional
    public LikeToggleResponse toggleLike(Long postId, String username) {
        // Ilgili yazi var mi kontrolu.
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Post not found: " + postId));

        // Ogrenci seviyesinde daha acik bir if-else akisiyla toggle mantigi.
        PostLike existingLike = postLikeRepository.findByPostIdAndUsername(postId, username).orElse(null);

        if (existingLike != null) {
            // Daha once begenmisse, bu tiklama begeniyi geri alir.
            postLikeRepository.delete(existingLike);
            long likeCount = postLikeRepository.countByPostId(postId);
            return new LikeToggleResponse(postId, false, likeCount, "Like removed");
        } else {
            // Daha once begenmemisse yeni begeni kaydi olusturulur.
            PostLike like = new PostLike();
            like.setPost(post);
            like.setUsername(username);
            postLikeRepository.save(like);
            long likeCount = postLikeRepository.countByPostId(postId);
            return new LikeToggleResponse(postId, true, likeCount, "Post liked");
        }
    }
}
