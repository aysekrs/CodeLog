package com.nazli.blog.service.impl;

import com.nazli.blog.api.dto.TagDto;
import com.nazli.blog.api.exception.BadRequestException;
import com.nazli.blog.api.request.TagRequest;
import com.nazli.blog.domain.entity.Tag;
import com.nazli.blog.domain.repository.TagRepository;
import com.nazli.blog.service.TagService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TagServiceImpl implements TagService {

    private final TagRepository tagRepository;

    public TagServiceImpl(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    @Override
    public TagDto etiketEkle(TagRequest istek) {
        if (tagRepository.existsByNameIgnoreCase(istek.name())) {
            throw new BadRequestException("Bu etiket adi zaten var.");
        }
        if (tagRepository.existsBySlugIgnoreCase(istek.slug())) {
            throw new BadRequestException("Bu etiket slug'i zaten var.");
        }

        // Etiketi kaydetmeden once temel alanlari dolduruyoruz.
        Tag etiket = new Tag();
        etiket.setName(istek.name());
        etiket.setSlug(istek.slug());

        Tag kayit = tagRepository.save(etiket);
        return new TagDto(kayit.getId(), kayit.getName(), kayit.getSlug());
    }

    @Override
    public List<TagDto> etiketleriGetir() {
        return tagRepository.findAll().stream()
                .map(t -> new TagDto(t.getId(), t.getName(), t.getSlug()))
                .toList();
    }
}
