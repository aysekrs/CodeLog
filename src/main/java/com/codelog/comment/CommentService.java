package com.codelog.comment;

import com.codelog.comment.dto.CreateCommentRequest;

import java.util.List;

public interface CommentService {

    Comment createComment(CreateCommentRequest request);

    List<Comment> getApprovedCommentsByPostId(Long postId);

    Comment approveComment(Long commentId);

    List<Comment> getPendingComments();

    void deleteComment(Long commentId);
}
