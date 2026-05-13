package com.codelog.comment;

import com.codelog.comment.dto.CreateCommentRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class CommentServiceImpl {

    private final CommentRepository commentRepository;

    public CommentServiceImpl(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    @Transactional
    public Comment createComment(CreateCommentRequest request) {
        // Formdan gelen verilerle yeni yorumu olusturuyoruz
        Comment comment = new Comment();
        comment.setPostId(request.getPostId());
        comment.setUserId(request.getUserId());
        comment.setMessage(request.getMessage());

        // Hocam senaryo geregi her yorum ilk basta onaysiz olarak kaydediliyor (Senaryo 2)
        comment.setIsApproved(false);
        return commentRepository.save(comment);
    }

    @Transactional
    public List<Comment> getApprovedCommentsByPostId(Long postId) {
        // Sitede sadece onaylanmis yorumlarin listelenmesi lazim
        return commentRepository.findByPostIdAndIsApprovedTrue(postId);
    }

    @Transactional
    public Comment approveComment(Long commentId) {
        // Veritabanindan yorumu buluyoruz
        Optional<Comment> bulananYorum = commentRepository.findById(commentId);
        
        if (bulananYorum.isPresent()) {
            Comment guncellenecekYorum = bulananYorum.get();
            guncellenecekYorum.setIsApproved(true); // Durumu onayli yapiyoruz (Senaryo 4)
            return commentRepository.save(guncellenecekYorum);
        } else {
            // Yorum bulunamazsa null donelim, controller tarafında kontrol ederiz
            return null; 
        }
    }

    @Transactional
    public List<Comment> getPendingComments() {
        // Admin panelinde onaylanmayi bekleyen yorumlari gosteren metod
        return commentRepository.findByIsApprovedFalse();
    }

    @Transactional
    public void deleteComment(Long commentId) {
        // Yorum var mi kontrol edip siliyoruz (Senaryo 10)
        if (commentRepository.existsById(commentId)) {
            commentRepository.deleteById(commentId);
        }
    }
}