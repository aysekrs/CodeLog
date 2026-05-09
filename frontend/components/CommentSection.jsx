import React, { useEffect, useState } from "react";

const CommentSection = ({ postId, userId = 1 }) => {
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const fetchApprovedComments = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/comments/post/${postId}`);
      if (!response.ok) {
        throw new Error("Yorumlar alınamadı.");
      }
      const data = await response.json();
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchApprovedComments();
    }
  }, [postId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const normalized = message.trim();
    if (!normalized) {
      return;
    }

    setError("");
    setInfo("");

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          userId,
          message: normalized,
        }),
      });

      if (!response.ok) {
        throw new Error("Yorum gönderilemedi.");
      }

      setMessage("");
      setInfo("Yorumunuz alındı. Onaylandıktan sonra görünecektir.");
    } catch (err) {
      setError(err.message || "Bir hata oluştu.");
    }
  };

  return (
    <section style={{ marginTop: "20px" }}>
      <h3>Yorumlar</h3>
      {loading && <p>Yorumlar yükleniyor...</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      {info && <p style={{ color: "seagreen" }}>{info}</p>}

      {!loading && !error && comments.length === 0 && <p>Henüz onaylı yorum yok.</p>}

      {!loading &&
        comments.map((comment) => (
          <div key={comment.id} style={{ borderBottom: "1px solid #eee", padding: "10px 0" }}>
            <p style={{ margin: 0 }}>{comment.message}</p>
          </div>
        ))}

      <h4 style={{ marginTop: "16px" }}>Yorum Yap</h4>
      <form onSubmit={handleSubmit}>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={4}
          placeholder="Yorumunuzu yazın..."
          style={{ width: "100%", padding: "8px" }}
        />
        <button type="submit" style={{ marginTop: "8px", padding: "8px 12px" }}>
          Gönder
        </button>
      </form>
    </section>
  );
};

export default CommentSection;
