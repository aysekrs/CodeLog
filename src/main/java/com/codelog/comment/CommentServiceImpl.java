package com.codelog.comment;

import com.codelog.comment.dto.CreateCommentRequest;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CommentServiceImpl {

    private final CommentRepository commentRepository;

    public CommentServiceImpl(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    @Transactional
    public Comment createComment(CreateCommentRequest request) {
        // Yeni yorum nesnesi olusturuluyor.
        Comment comment = new Comment();
        comment.setPostId(request.getPostId());
        comment.setUserId(request.getUserId());
        comment.setMessage(request.getMessage());

        // Senaryo geregi yorum ilk basta onaysiz.
        comment.setIsApproved(false);
        return commentRepository.save(comment);
    }

    @Transactional(readOnly = true)
    public List<Comment> getApprovedCommentsByPostId(Long postId) {
        // Yazi altinda sadece onayli yorumlar listelenir.
        return commentRepository.findByPostIdAndIsApprovedTrue(postId);
    }

    @Transactional
    public Comment approveComment(Long commentId) {
        // Id ile yorumu bulup onayli hale getiriyoruz.
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("Comment not found: " + commentId));
        comment.setIsApproved(true);
        return commentRepository.save(comment);
    }

    @Transactional(readOnly = true)
    public List<Comment> getPendingComments() {
        // Moderasyon panelinde kullanilacak bekleyen yorumlar.
        return commentRepository.findByIsApprovedFalse();
    }

    @Transactional
    public void deleteComment(Long commentId) {
        // Once var mi diye bakiyoruz, sonra siliyoruz.
        if (!commentRepository.existsById(commentId)) {
            throw new EntityNotFoundException("Comment not found: " + commentId);
        }
        commentRepository.deleteById(commentId);
    }
}
