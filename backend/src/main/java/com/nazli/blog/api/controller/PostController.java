package com.nazli.blog.api.controller;

import com.nazli.blog.api.dto.PostDto;
import com.nazli.blog.api.request.PostRequest;
import com.nazli.blog.api.response.ApiResponse;
import com.nazli.blog.security.JwtUserPrincipal;
import com.nazli.blog.service.PostService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    // Token olmadan gelen istekler icin varsayilan kullanici ID'si (demo modu)
    private static final long DEMO_USER_ID = 1L;

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    private long kullaniciId(JwtUserPrincipal kullanici) {
        return kullanici != null ? kullanici.userId() : DEMO_USER_ID;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PostDto>> yaziOlustur(@Valid @RequestBody PostRequest istek,
                                                             @AuthenticationPrincipal JwtUserPrincipal kullanici) {
        PostDto sonuc = postService.yaziOlustur(istek, kullaniciId(kullanici));
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Yazi basariyla olusturuldu.", sonuc));
    }

    @GetMapping("/mine")
    public ResponseEntity<ApiResponse<List<PostDto>>> yazilarimiListele(@AuthenticationPrincipal JwtUserPrincipal kullanici) {
        return ResponseEntity.ok(ApiResponse.success("Yazilarin listelendi.", postService.yazilarimiGetir(kullaniciId(kullanici))));
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<PostDto>>> tumYazilariListele() {
        return ResponseEntity.ok(ApiResponse.success("Tum yazilar listelendi.", postService.tumYazilariGetir()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PostDto>> yaziDetay(@PathVariable Long id,
                                                          @AuthenticationPrincipal JwtUserPrincipal kullanici) {
        return ResponseEntity.ok(ApiResponse.success("Yazi detayi getirildi.", postService.yaziDetayGetir(id, kullaniciId(kullanici))));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PostDto>> yaziGuncelle(@PathVariable Long id,
                                                              @Valid @RequestBody PostRequest istek,
                                                              @AuthenticationPrincipal JwtUserPrincipal kullanici) {
        PostDto sonuc = postService.yaziGuncelle(id, istek, kullaniciId(kullanici));
        return ResponseEntity.ok(ApiResponse.success("Yazi basariyla guncellendi.", sonuc));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> yaziSil(@PathVariable Long id,
                                                       @AuthenticationPrincipal JwtUserPrincipal kullanici) {
        postService.yaziSil(id, kullaniciId(kullanici));
        return ResponseEntity.ok(ApiResponse.success("Yazi basariyla silindi.", null));
    }
}
