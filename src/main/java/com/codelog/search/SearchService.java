package com.codelog.search;

import com.codelog.post.Post;

import java.util.List;

public interface SearchService {

    List<Post> searchPosts(String query);
}
