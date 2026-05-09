# DOKUMANTASYON - AYSE

Bu dokuman, 3. kisi (Ayse) sorumluluk alanindaki Senaryo 2, 4, 5, 8 ve 10 icin teknik kullanim kilavuzu ve proje raporu taslagi olarak hazirlanmistir.

---

## 1) Senaryo 2 - Yorum Yapma ve Onayli Yorumlari Gosterme

### Amac
Kullanicilarin yazi altina yorum birakmasi, yorumlarin moderasyon surecinden gecmesi ve yalnizca onayli yorumlarin gorunmesi.

### Nasil Kullanilir?
1. Kullanici yazi detay sayfasina gider (`/posts/:postId`).
2. "Yorum Yap" alanina mesajini yazar.
3. "Gonder" butonuna tiklar.
4. Sistem yorumu kaydeder, yorum otomatik olarak onaysiz (`isApproved = false`) olarak tutulur.
5. Yorum hemen listede gorunmez; admin onayladiginda yazinin yorumlarinda listelenir.

### Teknik Endpoint ve Akis
- `POST /api/comments`
  - Yeni yorum olusturur.
  - Istek govdesi: `postId`, `userId`, `message`
- `GET /api/comments/post/{postId}`
  - Sadece onayli yorumlari (`isApproved = true`) listeler.

### Ilgili Dosyalar
- Backend:
  - `src/main/java/com/codelog/comment/Comment.java`
  - `src/main/java/com/codelog/comment/dto/CreateCommentRequest.java`
  - `src/main/java/com/codelog/comment/CommentRepository.java`
  - `src/main/java/com/codelog/comment/CommentService.java`
  - `src/main/java/com/codelog/comment/CommentServiceImpl.java`
  - `src/main/java/com/codelog/comment/CommentController.java`
- Frontend:
  - `frontend/components/CommentSection.jsx`
  - `frontend/components/PostDetailPage.jsx`

---

## 2) Senaryo 4 - Admin Moderasyon Paneli (Onayla/Sil)

### Amac
Yorum icerik kalitesini korumak icin admin tarafinda onay/sil mekanizmasi sunmak.

### Nasil Kullanilir?
1. Admin moderasyon ekranina gider (`/admin/moderation`).
2. Panel acildiginda sistem onay bekleyen yorumlari listeler.
3. Admin:
   - "Onayla" butonuna basarak yorumu yayinlar.
   - "Sil" butonuna basarak yorumu kaldirir.
4. Islem sonrasi tablo otomatik yenilenir.

### Teknik Endpoint ve Akis
- `GET /api/admin/comments/pending`
  - Onay bekleyen yorumlari listeler.
- `PATCH /api/comments/{commentId}/approve`
  - Yorumu onaylar (`isApproved = true`).
- `DELETE /api/comments/{commentId}`
  - Yorumu kalici olarak siler.
- Yetkilendirme:
  - Kritik endpointlerde `@PreAuthorize("hasRole('ADMIN')")`
  - Yetkisiz erisimde 401/403 doner.

### Ilgili Dosyalar
- Backend:
  - `src/main/java/com/codelog/comment/AdminCommentController.java`
  - `src/main/java/com/codelog/comment/CommentController.java`
  - `src/main/java/com/codelog/comment/CommentService.java`
  - `src/main/java/com/codelog/comment/CommentServiceImpl.java`
  - `src/main/java/com/codelog/comment/CommentRepository.java`
  - `src/main/java/com/codelog/config/SecurityConfig.java`
- Frontend:
  - `frontend/components/AdminModerationPanel.jsx`

---

## 3) Senaryo 5 - Icerik Arama ve Filtreleme

### Amac
Kullanicinin baslik ve icerik uzerinden hizli arama yapabilmesi.

### Nasil Kullanilir?
1. Kullanici ana sayfaya gider (`/`).
2. Ustteki arama cubuguna anahtar kelime yazar.
3. "Ara" butonuna basar.
4. Sistem baslik veya icerikte kelime eslesmesi olan yazilari listeler.
5. Sonuc yoksa kullaniciya "yazi bulunamadi" uyari mesaji gosterilir.
6. "Temizle" butonu ile arama sifirlanir, tum yazilar tekrar listelenir.

### Teknik Endpoint ve Akis
- `GET /api/search?q=arananKelime`
  - Baslik ve icerikte case-insensitive arama yapar.
- Arama repository metodu:
  - `findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(...)`

### Ilgili Dosyalar
- Backend:
  - `src/main/java/com/codelog/post/PostRepository.java`
  - `src/main/java/com/codelog/search/SearchController.java`
  - `src/main/java/com/codelog/search/SearchService.java`
  - `src/main/java/com/codelog/search/SearchServiceImpl.java`
- Frontend:
  - `frontend/components/SearchBar.jsx`
  - `frontend/components/HomePage.jsx`
  - `frontend/App.js`

---

## 4) Senaryo 8 - Yazi Begeni Etkilesimi (Like/Unlike)

### Amac
Kullanicinin bir yaziyi begenebilmesi ve tekrar bastiginda begenisini geri alabilmesi.

### Nasil Kullanilir?
1. Kullanici yazi detayina gider (`/posts/:postId`).
2. "Begen" butonuna tiklar.
3. Sistem:
   - Daha once begenmediyse begeni ekler.
   - Daha once begendiyse begeniyi kaldirir (toggle).
4. Buton metni ve begeni sayisi anlik guncellenir.
5. Giris yapmamis kullanici tiklarsa "Giris yapmalisiniz" uyarisi gorur.

### Teknik Endpoint ve Akis
- `POST /api/posts/{postId}/like`
  - Like/Unlike toggle islemini yapar.
- Kurallar:
  - Ayni kullanici ayni yaziyi tek sefer begenebilir.
  - Veritabani seviyesinde `UNIQUE(post_id, username)` ile guvenceye alinmistir.
  - Girissiz kullanicida `401 Unauthorized`.

### Ilgili Dosyalar
- Backend:
  - `src/main/java/com/codelog/post/Post.java`
  - `src/main/java/com/codelog/post/PostLike.java`
  - `src/main/java/com/codelog/post/PostLikeRepository.java`
  - `src/main/java/com/codelog/like/LikeController.java`
  - `src/main/java/com/codelog/like/LikeService.java`
  - `src/main/java/com/codelog/like/LikeServiceImpl.java`
  - `src/main/java/com/codelog/like/dto/LikeToggleResponse.java`
- Frontend:
  - `frontend/components/LikeButton.jsx`
  - `frontend/components/PostDetailPage.jsx`

---

## 5) Senaryo 10 - RSS Beslemesi

### Amac
Platformdaki son yayimlanan yazilari RSS XML formati ile dis sistemlere acmak.

### Nasil Kullanilir?
1. Kullanici veya RSS okuyucu istemci su endpointi cagirir:
   - `GET /api/rss/latest`
2. Sistem en son yayimlanan yazilari ceker.
3. Sonuclar RSS 2.0 XML formati ile dondurulur.
4. RSS okuyucu uygulamalari bu feed URL'ini takip ederek yeni icerikleri otomatik alir.

### Teknik Endpoint ve Akis
- `GET /api/rss/latest` (`application/xml`)
- Servis katmani son yazilari su sorgu ile alir:
  - `findTop10ByPublishedAtIsNotNullOrderByPublishedAtDesc()`
- XML iceriginde kanal bilgileri ve her yazi icin `item` bloklari olusturulur.

### Ilgili Dosyalar
- Backend:
  - `src/main/java/com/codelog/rss/RssController.java`
  - `src/main/java/com/codelog/rss/RssService.java`
  - `src/main/java/com/codelog/rss/RssServiceImpl.java`
  - `src/main/java/com/codelog/post/PostRepository.java`
- Frontend:
  - RSS bu projede backend endpoint olarak sunulur; zorunlu ayri bir RSS ekrani yoktur.

---

## 6) Teknik Rapor - SEO ve RSS Gereksinimleri

### SEO Teknik Ozet
- Yazi detay sayfasinda React Helmet kullanilmistir.
- Her yazi sayfasi icin dinamik meta alanlari uretilir:
  - `title`, `description`, `keywords`
  - Open Graph: `og:title`, `og:description`, `og:type`, `og:url`
  - Twitter: `twitter:card`, `twitter:title`, `twitter:description`
- Bu yaklasim, arama motoru gorunurlugunu ve sosyal medya onizlemelerini iyilestirir.

Ilgili dosyalar:
- `frontend/components/PostDetailPage.jsx`
- `frontend/App.js` (routing ile URL bazli sayfa gecisi)

### RSS Teknik Ozet
- RSS feed backend tarafinda uretilir ve XML olarak yayinlanir.
- Son yayimlanan icerikler tarih bazli siralanarak feed'e eklenir.
- RSS yapisi kanal + item formatinda olusturulur ve `application/xml` doner.

Ilgili dosyalar:
- `src/main/java/com/codelog/rss/RssController.java`
- `src/main/java/com/codelog/rss/RssService.java`
- `src/main/java/com/codelog/rss/RssServiceImpl.java`
- `src/main/java/com/codelog/post/PostRepository.java`

---

## 7) Sonuc

Ayse sorumluluk kapsamindaki Senaryo 2, 4, 5, 8 ve 10 icin:
- Kullanim akisleri tanimlanmis,
- Backend endpointleri uygulanmis,
- Frontend bilesenleri entegre edilmis,
- SEO ve RSS teknik gereksinimleri karsilanmistir.

Bu dokuman, hem gelistirme hem de teslim sunumu icin referans kilavuz olarak kullanilabilir.
