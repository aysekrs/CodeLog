package com.nazli.blog.api.request;

import com.nazli.blog.domain.enums.PostStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.Set;

public record PostRequest(
        @NotBlank(message = "Baslik alani bos birakilamaz.") String title,
        @NotBlank(message = "Icerik alani bos birakilamaz.") String content,
        @NotNull(message = "Kategori secimi zorunludur.") Long categoryId,
        @NotNull(message = "Durum secimi zorunludur.") PostStatus status,
        Set<Long> tagIds
) {
}
