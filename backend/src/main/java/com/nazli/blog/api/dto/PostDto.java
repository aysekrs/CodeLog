package com.nazli.blog.api.dto;

import com.nazli.blog.domain.enums.PostStatus;

import java.time.Instant;
import java.util.List;

public record PostDto(
        Long id,
        String title,
        String content,
        Long authorId,
        Long categoryId,
        String categoryName,
        PostStatus status,
        List<TagDto> tags,
        Instant createdAt,
        Instant updatedAt
) {
}
