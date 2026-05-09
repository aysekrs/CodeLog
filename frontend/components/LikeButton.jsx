import React, { useState } from "react";

const LikeButton = ({ postId, initialLiked = false, initialLikeCount = 0 }) => {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [warning, setWarning] = useState("");
  const [loading, setLoading] = useState(false);

  const handleToggleLike = async () => {
    setLoading(true);
    setWarning("");

    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Beğenmek için giriş yapmalısınız.");
        }
        throw new Error("Beğeni işlemi tamamlanamadı.");
      }

      const data = await response.json();
      setLiked(Boolean(data.liked));
      setLikeCount(Number.isFinite(data.likeCount) ? data.likeCount : likeCount);
    } catch (err) {
      setWarning(err.message || "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleToggleLike} disabled={loading} style={{ padding: "8px 12px" }}>
        {liked ? "Beğeniyi Geri Al" : "Beğen"} ({likeCount})
      </button>
      {warning && <p style={{ color: "crimson", marginTop: "8px" }}>{warning}</p>}
    </div>
  );
};

export default LikeButton;
