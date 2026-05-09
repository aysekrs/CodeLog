import React, { useEffect, useState } from "react";

const AdminModerationPanel = () => {
  const [pendingComments, setPendingComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPendingComments = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/comments/pending");
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error("Bu sayfayı görüntülemek için admin olarak giriş yapmalısınız.");
        }
        throw new Error("Onay bekleyen yorumlar alınamadı.");
      }
      const data = await response.json();
      setPendingComments(data);
    } catch (err) {
      setError(err.message || "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingComments();
  }, []);

  const handleApprove = async (commentId) => {
    setError("");
    try {
      const response = await fetch(`/api/comments/${commentId}/approve`, {
        method: "PATCH",
      });
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error("Yorum onaylama yetkiniz yok.");
        }
        throw new Error("Yorum onaylanamadı.");
      }
      await fetchPendingComments();
    } catch (err) {
      setError(err.message || "Bir hata oluştu.");
    }
  };

  const handleDelete = async (commentId) => {
    setError("");
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error("Yorum silme yetkiniz yok.");
        }
        throw new Error("Yorum silinemedi.");
      }
      await fetchPendingComments();
    } catch (err) {
      setError(err.message || "Bir hata oluştu.");
    }
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "16px" }}>
      <h1>Admin Moderasyon Paneli</h1>

      {loading && <p>Yükleniyor...</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {!loading && !error && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid #ddd", textAlign: "left", padding: "8px" }}>ID</th>
              <th style={{ borderBottom: "1px solid #ddd", textAlign: "left", padding: "8px" }}>Post ID</th>
              <th style={{ borderBottom: "1px solid #ddd", textAlign: "left", padding: "8px" }}>User ID</th>
              <th style={{ borderBottom: "1px solid #ddd", textAlign: "left", padding: "8px" }}>Mesaj</th>
              <th style={{ borderBottom: "1px solid #ddd", textAlign: "left", padding: "8px" }}>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {pendingComments.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: "12px" }}>
                  Onay bekleyen yorum yok.
                </td>
              </tr>
            ) : (
              pendingComments.map((comment) => (
                <tr key={comment.id}>
                  <td style={{ borderBottom: "1px solid #f0f0f0", padding: "8px" }}>{comment.id}</td>
                  <td style={{ borderBottom: "1px solid #f0f0f0", padding: "8px" }}>{comment.postId}</td>
                  <td style={{ borderBottom: "1px solid #f0f0f0", padding: "8px" }}>{comment.userId}</td>
                  <td style={{ borderBottom: "1px solid #f0f0f0", padding: "8px" }}>{comment.message}</td>
                  <td style={{ borderBottom: "1px solid #f0f0f0", padding: "8px" }}>
                    <button onClick={() => handleApprove(comment.id)} style={{ marginRight: "8px" }}>
                      Onayla
                    </button>
                    <button onClick={() => handleDelete(comment.id)}>Sil</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminModerationPanel;
