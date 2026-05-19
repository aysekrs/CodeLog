package com.nazli.blog.service.impl;

import com.nazli.blog.api.dto.PostDto;
import com.nazli.blog.api.dto.TagDto;
import com.nazli.blog.api.exception.ResourceNotFoundException;
import com.nazli.blog.api.request.PostRequest;
import com.nazli.blog.domain.entity.Category;
import com.nazli.blog.domain.entity.Post;
import com.nazli.blog.domain.entity.Tag;
import com.nazli.blog.domain.repository.CategoryRepository;
import com.nazli.blog.domain.repository.PostRepository;
import com.nazli.blog.domain.repository.TagRepository;
import com.nazli.blog.service.PostService;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;

    public PostServiceImpl(PostRepository postRepository,
                           CategoryRepository categoryRepository,
                           TagRepository tagRepository) {
        this.postRepository = postRepository;
        this.categoryRepository = categoryRepository;
        this.tagRepository = tagRepository;
    }

    @Override
    public PostDto yaziOlustur(PostRequest istek, Long aktifKullaniciId) {
        Post yazi = new Post();
        // burdaistekten gelen alanlari entitye dolduruyoruz.
        istegiYaziyaIsle(yazi, istek, aktifKullaniciId);
        return dtoyaCevir(postRepository.save(yazi));
    }

    @Override
    public List<PostDto> yazilarimiGetir(Long aktifKullaniciId) {
        return postRepository.findByAuthorId(aktifKullaniciId).stream()
                .map(this::dtoyaCevir)
                .toList();
    }

    @Override
    public List<PostDto> tumYazilariGetir() {
        return postRepository.findAll().stream()
                .map(this::dtoyaCevir)
                .toList();
    }

    @Override
    public PostDto yaziDetayGetir(Long yaziId, Long aktifKullaniciId) {
        Post yazi = banaAitYaziyiBul(yaziId, aktifKullaniciId);
        return dtoyaCevir(yazi);
    }

    @Override
    public PostDto yaziGuncelle(Long yaziId, PostRequest istek, Long aktifKullaniciId) {
        Post yazi = banaAitYaziyiBul(yaziId, aktifKullaniciId);
        istegiYaziyaIsle(yazi, istek, aktifKullaniciId);
        return dtoyaCevir(postRepository.save(yazi));
    }

    @Override
    public void yaziSil(Long yaziId, Long aktifKullaniciId) {
        Post yazi = banaAitYaziyiBul(yaziId, aktifKullaniciId);
        postRepository.delete(yazi);
    }

    private void istegiYaziyaIsle(Post yazi, PostRequest istek, Long aktifKullaniciId) {
        Category kategori = categoryRepository.findById(istek.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Kategori bulunamadi: " + istek.categoryId()));

        Set<Tag> etiketler = new HashSet<>();
        if (istek.tagIds() != null && !istek.tagIds().isEmpty()) {
            etiketler = new HashSet<>(tagRepository.findAllById(istek.tagIds()));
            if (etiketler.size() != istek.tagIds().size()) {
                throw new ResourceNotFoundException("Secilen etiketlerden bazilari bulunamadi.");
            }
        }

        yazi.setTitle(istek.title());
        yazi.setContent(istek.content());
        yazi.setAuthorId(aktifKullaniciId);
        yazi.setCategory(kategori);
        yazi.setStatus(istek.status());
        yazi.setTags(etiketler);
    }

    private Post banaAitYaziyiBul(Long yaziId, Long aktifKullaniciId) {
        Post yazi = postRepository.findById(yaziId)
                .orElseThrow(() -> new ResourceNotFoundException("Yazi bulunamadi: " + yaziId));
        if (!yazi.getAuthorId().equals(aktifKullaniciId)) {
            // guvenlik icin "yetkin yok" yerine "bulunamadi" donuyoruz.
            throw new ResourceNotFoundException("Yazi bulunamadi: " + yaziId);
        }
        return yazi;
    }

    private PostDto dtoyaCevir(Post yazi) {
        List<TagDto> etiketDtoListesi = yazi.getTags().stream()
                .map(etiket -> new TagDto(etiket.getId(), etiket.getName(), etiket.getSlug()))
                .toList();

        return new PostDto(
                yazi.getId(),
                yazi.getTitle(),
                yazi.getContent(),
                yazi.getAuthorId(),
                yazi.getCategory().getId(),
                yazi.getCategory().getName(),
                yazi.getStatus(),
                etiketDtoListesi,
                yazi.getCreatedAt(),
                yazi.getUpdatedAt()
        );
    }
}
