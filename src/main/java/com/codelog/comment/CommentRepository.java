package com.codelog.comment;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByPostIdAndIsApprovedTrue(Long postId);

    List<Comment> findByPostId(Long postId);

    List<Comment> findByIsApprovedFalse();
}
