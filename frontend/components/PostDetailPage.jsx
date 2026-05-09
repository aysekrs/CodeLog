import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import LikeButton from "./LikeButton";
import CommentSection from "./CommentSection";

const PostDetailPage = () => {
  const { postId } = useParams();
  const [yaziDetayi, setYaziDetayi] = useState(null);
  const [begeniDurumu, setBegeniDurumu] = useState({ liked: false, likeCount: 0 });
  const [hataMesaji, setHataMesaji] = useState("");

  const fetchPostDetail = async () => {
    // URL'den gelen postId ile yazi detayini cekiyoruz.
    const response = await fetch(`/api/posts/${postId}`);
    if (!response.ok) {
      throw new Error("Yazı detayı alınamadı, birazdan tekrar deneyelim.");
    }
    const data = await response.json();
    setYaziDetayi(data);

    // Like sayisini yazi bilgisinden dolduruyoruz.
    setBegeniDurumu((prev) => ({
      liked: prev.liked,
      likeCount: typeof data.likeCount === "number" ? data.likeCount : prev.likeCount,
    }));
  };

  const loadPage = async () => {
    setHataMesaji("");
    try {
      await fetchPostDetail();
    } catch (err) {
      setHataMesaji(err.message || "Bir hata oluştu.");
    }
  };

  useEffect(() => {
    // postId degisince detay tekrar yuklenir.
    if (postId) {
      loadPage();
    }
  }, [postId]);

  if (!yaziDetayi) {
    return <p style={{ padding: "16px" }}>Yazı yükleniyor...</p>;
  }

  const sayfaBasligi = `${yaziDetayi.title} | CodeLog`;
  const sayfaAciklamasi = (yaziDetayi.content || "").slice(0, 150);
  const yaziUrl = `http://localhost:3000/posts/${yaziDetayi.id}`;

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "16px" }}>
      {/* SEO etiketleri burada ayarlaniyor. */}
      <Helmet>
        <title>{sayfaBasligi}</title>
        <meta name="description" content={sayfaAciklamasi} />
        <meta name="keywords" content="blog, yazilim, yazi, codelog" />
        <meta property="og:title" content={yaziDetayi.title} />
        <meta property="og:description" content={sayfaAciklamasi} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={yaziUrl} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={yaziDetayi.title} />
        <meta name="twitter:description" content={sayfaAciklamasi} />
      </Helmet>

      <h1>{yaziDetayi.title}</h1>
      <p>{yaziDetayi.content}</p>

      {/* Senaryo 8: Like/Unlike */}
      <LikeButton
        postId={yaziDetayi.id}
        initialLiked={begeniDurumu.liked}
        initialLikeCount={begeniDurumu.likeCount}
      />

      {hataMesaji && <p style={{ color: "crimson" }}>{hataMesaji}</p>}

      {/* Senaryo 2: Onayli yorumlari listele + yeni yorum formu */}
      {/* TODO: Sunumdan sonra yazar bilgisi de eklenecek */}
      <CommentSection postId={yaziDetayi.id} />
    </div>
  );
};

export default PostDetailPage;
