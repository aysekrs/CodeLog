package com.nazli.blog.api.request;

import jakarta.validation.constraints.NotBlank;

public record CategoryRequest(
        @NotBlank(message = "Kategori adi zorunludur.") String name,
        @NotBlank(message = "Kategori slug'i zorunludur.") String slug
) {
}
