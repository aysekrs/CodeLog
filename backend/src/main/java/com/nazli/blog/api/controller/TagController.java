package com.nazli.blog.api.controller;

import com.nazli.blog.api.dto.TagDto;
import com.nazli.blog.api.request.TagRequest;
import com.nazli.blog.api.response.ApiResponse;
import com.nazli.blog.service.TagService;
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
@RequestMapping("/api/tags")
public class TagController {

    private final TagService tagService;

    public TagController(TagService tagService) {
        this.tagService = tagService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TagDto>> etiketEkle(@Valid @RequestBody TagRequest istek) {
        TagDto sonuc = tagService.etiketEkle(istek);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Etiket basariyla eklendi.", sonuc));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TagDto>>> etiketleriGetir() {
        return ResponseEntity.ok(ApiResponse.success("Etiketler listelendi.", tagService.etiketleriGetir()));
    }
}
