package com.nazli.blog.service;

import com.nazli.blog.api.dto.PostDto;
import com.nazli.blog.api.request.PostRequest;

import java.util.List;

public interface PostService {
    PostDto yaziOlustur(PostRequest istek, Long aktifKullaniciId);
    List<PostDto> yazilarimiGetir(Long aktifKullaniciId);
    List<PostDto> tumYazilariGetir();
    PostDto yaziDetayGetir(Long yaziId, Long aktifKullaniciId);
    PostDto yaziGuncelle(Long yaziId, PostRequest istek, Long aktifKullaniciId);
    void yaziSil(Long yaziId, Long aktifKullaniciId);
}
