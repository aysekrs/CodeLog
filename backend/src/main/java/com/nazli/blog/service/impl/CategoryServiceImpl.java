package com.nazli.blog.service.impl;

import com.nazli.blog.api.dto.CategoryDto;
import com.nazli.blog.api.exception.BadRequestException;
import com.nazli.blog.api.request.CategoryRequest;
import com.nazli.blog.domain.entity.Category;
import com.nazli.blog.domain.repository.CategoryRepository;
import com.nazli.blog.service.CategoryService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public CategoryDto kategoriEkle(CategoryRequest istek) {
        if (categoryRepository.existsByNameIgnoreCase(istek.name())) {
            throw new BadRequestException("Bu kategori adi zaten var.");
        }
        if (categoryRepository.existsBySlugIgnoreCase(istek.slug())) {
            throw new BadRequestException("Bu kategori slug'i zaten var.");
        }

        // Kategori kaydini burada olusturuyoruz.
        Category kategori = new Category();
        kategori.setName(istek.name());
        kategori.setSlug(istek.slug());

        Category kayit = categoryRepository.save(kategori);
        return new CategoryDto(kayit.getId(), kayit.getName(), kayit.getSlug());
    }

    @Override
    public List<CategoryDto> kategorileriGetir() {
        return categoryRepository.findAll().stream()
                .map(c -> new CategoryDto(c.getId(), c.getName(), c.getSlug()))
                .toList();
    }
}
