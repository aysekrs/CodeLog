package com.nazli.blog.service;

import com.nazli.blog.api.dto.TagDto;
import com.nazli.blog.api.request.TagRequest;

import java.util.List;

public interface TagService {
    TagDto etiketEkle(TagRequest istek);
    List<TagDto> etiketleriGetir();
}
