package com.codelog.like.dto;

public class LikeToggleResponse {

    private final Long postId;
    private final boolean liked;
    private final long likeCount;
    private final String message;

    public LikeToggleResponse(Long postId, boolean liked, long likeCount, String message) {
        this.postId = postId;
        this.liked = liked;
        this.likeCount = likeCount;
        this.message = message;
    }

    public Long getPostId() {
        return postId;
    }

    public boolean isLiked() {
        return liked;
    }

    public long getLikeCount() {
        return likeCount;
    }

    public String getMessage() {
        return message;
    }
}
