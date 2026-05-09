package com.codelog.like;

import com.codelog.like.dto.LikeToggleResponse;

public interface LikeService {

    LikeToggleResponse toggleLike(Long postId, String username);
}
