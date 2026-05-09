import React, { useState } from "react";

const LikeButton = ({ postId, initialLiked = false, initialLikeCount = 0 }) => {
  const [begenildiMi, setBegenildiMi] = useState(initialLiked);
  const [begeniSayisi, setBegeniSayisi] = useState(initialLikeCount);
  const [uyariMesaji, setUyariMesaji] = useState("");
  const [istekAtiliyor, setIstekAtiliyor] = useState(false);

  const handleToggleLike = async () => {
    // Butona basinca like/unlike istegi atiyoruz.
    setIstekAtiliyor(true);
    setUyariMesaji("");

    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
      });

      if (!response.ok) {
        // Giris yoksa ogrenci seviyesinde net bir uyari verelim.
        if (response.status === 401) {
          throw new Error("Bu işlemi yapmak için önce giriş yapmalısın.");
        } else {
          throw new Error("Beğeni işlemi şu an yapılamadı.");
        }
      }

      const data = await response.json();
      setBegenildiMi(Boolean(data.liked));
      if (Number.isFinite(data.likeCount)) {
        setBegeniSayisi(data.likeCount);
      } else {
        setBegeniSayisi(begeniSayisi);
      }
    } catch (err) {
      setUyariMesaji(err.message || "Bir hata oluştu.");
    } finally {
      setIstekAtiliyor(false);
    }
  };

  return (
    <div>
      {/* TODO: Sunumdan sonra kalp ikonu eklenebilir */}
      <button onClick={handleToggleLike} disabled={istekAtiliyor} style={{ padding: "8px 12px" }}>
        {begenildiMi ? "Beğeniyi Geri Al" : "Beğen"} ({begeniSayisi})
      </button>
      {uyariMesaji && <p style={{ color: "crimson", marginTop: "8px" }}>{uyariMesaji}</p>}
    </div>
  );
};

export default LikeButton;
