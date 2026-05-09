# CHECKLIST - Ayse Gorev Kapsami

Bu dosya, Ayse'nin sorumlu oldugu Senaryo 2, 4, 5, 8 ve 10 kapsamindaki teslimleri listeler.

## Senaryo 2 - Yorum Yapma ve Onayli Yorumlari Gosterme

Kabul Kriteri (Backend - Java):
- `src/main/java/com/codelog/comment/Comment.java`
- `src/main/java/com/codelog/comment/dto/CreateCommentRequest.java`
- `src/main/java/com/codelog/comment/CommentRepository.java`
- `src/main/java/com/codelog/comment/CommentService.java`
- `src/main/java/com/codelog/comment/CommentServiceImpl.java`
- `src/main/java/com/codelog/comment/CommentController.java`

Kabul Kriteri (Frontend - JSX):
- `frontend/components/CommentSection.jsx`
- `frontend/components/PostDetailPage.jsx`

## Senaryo 4 - Admin Yorum Moderasyonu (Onayla/Sil)

Kabul Kriteri (Backend - Java):
- `src/main/java/com/codelog/comment/AdminCommentController.java`
- `src/main/java/com/codelog/comment/CommentController.java`
- `src/main/java/com/codelog/comment/CommentService.java`
- `src/main/java/com/codelog/comment/CommentServiceImpl.java`
- `src/main/java/com/codelog/comment/CommentRepository.java`
- `src/main/java/com/codelog/config/SecurityConfig.java`

Kabul Kriteri (Frontend - JSX):
- `frontend/components/AdminModerationPanel.jsx`

## Senaryo 5 - Icerik Arama ve Filtreleme

Kabul Kriteri (Backend - Java):
- `src/main/java/com/codelog/post/PostRepository.java`
- `src/main/java/com/codelog/search/SearchController.java`
- `src/main/java/com/codelog/search/SearchService.java`
- `src/main/java/com/codelog/search/SearchServiceImpl.java`

Kabul Kriteri (Frontend - JSX):
- `frontend/components/SearchBar.jsx`
- `frontend/components/HomePage.jsx`
- `frontend/App.js`

## Senaryo 8 - Yazi Begeni Etkilesimi (Like/Unlike)

Kabul Kriteri (Backend - Java):
- `src/main/java/com/codelog/post/Post.java`
- `src/main/java/com/codelog/post/PostLike.java`
- `src/main/java/com/codelog/post/PostLikeRepository.java`
- `src/main/java/com/codelog/like/LikeController.java`
- `src/main/java/com/codelog/like/LikeService.java`
- `src/main/java/com/codelog/like/LikeServiceImpl.java`
- `src/main/java/com/codelog/like/dto/LikeToggleResponse.java`

Kabul Kriteri (Frontend - JSX):
- `frontend/components/LikeButton.jsx`
- `frontend/components/PostDetailPage.jsx`

## Senaryo 10 - RSS Beslemesi

Kabul Kriteri (Backend - Java):
- `src/main/java/com/codelog/rss/RssController.java`
- `src/main/java/com/codelog/rss/RssService.java`
- `src/main/java/com/codelog/rss/RssServiceImpl.java`
- `src/main/java/com/codelog/post/PostRepository.java`

Kabul Kriteri (Frontend - JSX):
- Senaryo 10 icin dogrudan zorunlu bir frontend bileseni bulunmamaktadir (RSS XML backend endpoint olarak sunulur).

## Teknik Gereksinimler - RSS ve SEO Eslestirmesi

RSS teknik maddesi hangi dosyalarda cozuldu:
- `src/main/java/com/codelog/rss/RssController.java`
- `src/main/java/com/codelog/rss/RssService.java`
- `src/main/java/com/codelog/rss/RssServiceImpl.java`
- `src/main/java/com/codelog/post/PostRepository.java`

SEO teknik maddesi hangi dosyalarda cozuldu:
- `frontend/components/PostDetailPage.jsx` (React Helmet ile yazi bazli meta etiketleri)
- `frontend/App.js` (sayfa gecis/routing yapisi)

## Son Kontrol Onayi

Ayse'nin tum gorevleri dokumana uygun sekilde tamamlanmistir.
