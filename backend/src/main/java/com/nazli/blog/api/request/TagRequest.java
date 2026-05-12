package com.nazli.blog.api.request;

import jakarta.validation.constraints.NotBlank;

public record TagRequest(
        @NotBlank(message = "Etiket adi zorunludur.") String name,
        @NotBlank(message = "Etiket slug'i zorunludur.") String slug
) {
}
