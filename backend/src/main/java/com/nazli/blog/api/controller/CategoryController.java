package com.nazli.blog.api.controller;

import com.nazli.blog.api.dto.CategoryDto;
import com.nazli.blog.api.request.CategoryRequest;
import com.nazli.blog.api.response.ApiResponse;
import com.nazli.blog.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CategoryDto>> kategoriEkle(@Valid @RequestBody CategoryRequest istek) {
        CategoryDto sonuc = categoryService.kategoriEkle(istek);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Kategori basariyla eklendi.", sonuc));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryDto>>> kategorileriGetir() {
        return ResponseEntity.ok(ApiResponse.success("Kategoriler listelendi.", categoryService.kategorileriGetir()));
    }
}
