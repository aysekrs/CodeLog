package com.codelog.post;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(String title, String content);

    List<Post> findTop10ByPublishedAtIsNotNullOrderByPublishedAtDesc();
}
