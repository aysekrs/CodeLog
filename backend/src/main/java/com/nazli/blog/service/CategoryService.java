package com.nazli.blog.service;

import com.nazli.blog.api.dto.CategoryDto;
import com.nazli.blog.api.request.CategoryRequest;

import java.util.List;

public interface CategoryService {
    CategoryDto kategoriEkle(CategoryRequest istek);
    List<CategoryDto> kategorileriGetir();
}
