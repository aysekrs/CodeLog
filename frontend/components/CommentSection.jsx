import React, { useEffect, useState } from "react";

const CommentSection = ({ postId, userId = 1 }) => {
  const [yorumlar, setYorumlar] = useState([]);
  const [yorumMetni, setYorumMetni] = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hataMesaji, setHataMesaji] = useState("");
  const [bilgiMesaji, setBilgiMesaji] = useState("");

  const fetchApprovedComments = async () => {
    // Sadece onayli yorumlar bu endpointten geliyor.
    setYukleniyor(true);
    setHataMesaji("");
    try {
      const response = await fetch(`/api/comments/post/${postId}`);
      if (!response.ok) {
        throw new Error("Yorumlar şu an getirilemedi.");
      }
      const data = await response.json();
      setYorumlar(Array.isArray(data) ? data : []);
    } catch (err) {
      setHataMesaji(err.message || "Bir hata oluştu.");
    } finally {
      setYukleniyor(false);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchApprovedComments();
    }
  }, [postId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const temizYorum = yorumMetni.trim();

    // Bos yorum gondermeyi engelliyoruz.
    if (!temizYorum) {
      return;
    }

    setHataMesaji("");
    setBilgiMesaji("");

    try {
      // Burada yeni yorum gonderiliyor.
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          userId,
          message: temizYorum,
        }),
      });

      if (!response.ok) {
        throw new Error("Yorum gönderilemedi, tekrar deneyebilirsin.");
      }

      setYorumMetni("");
      // Yorum direkt listede gozukmez, once admin onayi beklenir.
      setBilgiMesaji("Yorum alındı, admin onayından sonra görünecek.");
    } catch (err) {
      setHataMesaji(err.message || "Bir hata oluştu.");
    }
  };

  return (
    <section style={{ marginTop: "20px" }}>
      <h3>Yorumlar</h3>
      {yukleniyor && <p>Yorumlar yükleniyor...</p>}
      {hataMesaji && <p style={{ color: "crimson" }}>{hataMesaji}</p>}
      {bilgiMesaji && <p style={{ color: "seagreen" }}>{bilgiMesaji}</p>}

      {!yukleniyor && !hataMesaji && yorumlar.length === 0 && <p>Henüz onaylı yorum yok.</p>}

      {!yukleniyor &&
        yorumlar.map((comment) => (
          <div key={comment.id} style={{ borderBottom: "1px solid #eee", padding: "10px 0" }}>
            <p style={{ margin: 0 }}>{comment.message}</p>
          </div>
        ))}

      <h4 style={{ marginTop: "16px" }}>Yorum Yap</h4>
      <form onSubmit={handleSubmit}>
        <textarea
          value={yorumMetni}
          onChange={(event) => setYorumMetni(event.target.value)}
          rows={4}
          placeholder="Yorumunuzu yazın..."
          style={{ width: "100%", padding: "7px" }}
        />
        <button type="submit" style={{ marginTop: "8px", padding: "8px 12px" }}>
          Gönder
        </button>
      </form>
    </section>
  );
};

export default CommentSection;
