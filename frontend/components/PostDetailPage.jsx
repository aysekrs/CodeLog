import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import LikeButton from "./LikeButton";
import CommentSection from "./CommentSection";

const PostDetailPage = () => {
  const { postId } = useParams();
  const [yazi, setYazi] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState("");

  // Hocam verileri cekmek icin useEffect kullaniyorum
  useEffect(() => {
    const verileriGetir = async () => {
      try {
        setYukleniyor(true);
        // Backend'deki ilgili adrese istek atiyoruz
        const response = await fetch(`/api/posts/${postId}`);
        
        if (response.ok) {
          const data = await response.json();
          setYazi(data);
        } else {
          setHata("Yazı bulunamadı.");
        }
      } catch (err) {
        setHata("Sunucuya bağlanırken bir sorun oluştu.");
      } finally {
        setYukleniyor(false);
      }
    };

    if (postId) {
      verileriGetir();
    }
  }, [postId]);

  if (yukleniyor) return <p>Yükleniyor...</p>;
  if (hata) return <p style={{ color: "red" }}>{hata}</p>;
  if (!yazi) return <p>Yazı detayı yok.</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "20px auto", padding: "10px", border: "1px solid #ddd" }}>
      {/* SEO Gereksinimi: Baslik ve aciklama otomatik doluyor */}
      <Helmet>
        <title>{yazi.title} | CodeLog Blog</title>
        <meta name="description" content={yazi.content ? yazi.content.substring(0, 100) : ""} />
      </Helmet>

      <h1 style={{ color: "#333" }}>{yazi.title}</h1>
      <hr />
      <p style={{ lineHeight: "1.6" }}>{yazi.content}</p>
      
      <div style={{ marginTop: "30px", backgroundColor: "#f9f9f9", padding: "15px" }}>
        {/* Senaryo 8: Like Butonu buraya geliyor */}
        <LikeButton 
          postId={yazi.id} 
          initialLikeCount={yazi.likeCount || 0} 
        />
        
        <br />
        {/* Senaryo 2: Yorumlar ve Form */}
        <h3>Yorumlar</h3>
        <CommentSection postId={yazi.id} />
      </div>

      {/* TODO: Buraya bir 'Geri Don' butonu eklenebilir */}
    </div>
  );
};

export default PostDetailPage;