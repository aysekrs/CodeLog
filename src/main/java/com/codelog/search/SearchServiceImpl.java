package com.codelog.search;

import com.codelog.post.Post;
import com.codelog.post.PostRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

@Service
public class SearchServiceImpl implements SearchService {

    private final PostRepository postRepository;

    public SearchServiceImpl(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Post> searchPosts(String query) {
        if (query == null || query.trim().isEmpty()) {
            return Collections.emptyList();
        }
        String normalizedQuery = query.trim();
        return postRepository.findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(
                normalizedQuery, normalizedQuery
        );
    }
}
