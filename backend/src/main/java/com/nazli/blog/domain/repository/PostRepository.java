package com.nazli.blog.domain.repository;

import com.nazli.blog.domain.entity.Post;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {

    @Override
    @EntityGraph(attributePaths = {"category", "tags"})
    List<Post> findAll();

    @Override
    @EntityGraph(attributePaths = {"category", "tags"})
    Optional<Post> findById(Long id);

    @EntityGraph(attributePaths = {"category", "tags"})
    List<Post> findByAuthorId(Long authorId);
}
