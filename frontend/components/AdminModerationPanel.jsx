import React, { useEffect, useState } from "react";

const AdminModerationPanel = () => {
  const [bekleyenYorumlar, setBekleyenYorumlar] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hataMesaji, setHataMesaji] = useState("");

  const fetchPendingComments = async () => {
    // Admin paneli acilinca onay bekleyen yorumlari cekiyoruz.
    setYukleniyor(true);
    setHataMesaji("");
    try {
      const response = await fetch("/api/admin/comments/pending");
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error("Bu işlemi yapmak için yetkiniz yok!");
        }
        throw new Error("Onay bekleyen yorumlar alınamadı, sonra tekrar deneriz.");
      }
      const data = await response.json();
      setBekleyenYorumlar(data);
    } catch (err) {
      setHataMesaji(err.message || "Bir hata oluştu.");
    } finally {
      setYukleniyor(false);
    }
  };

  useEffect(() => {
    fetchPendingComments();
  }, []);

  const handleApprove = async (commentId) => {
    // Bu buton yorumu onaylar.
    setHataMesaji("");
    try {
      const response = await fetch(`/api/comments/${commentId}/approve`, {
        method: "PATCH",
      });
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error("Bu işlemi yapmak için yetkiniz yok!");
        }
        throw new Error("Yorum onaylanamadı.");
      }
      await fetchPendingComments();
    } catch (err) {
      setHataMesaji(err.message || "Bir hata oluştu.");
    }
  };

  const handleDelete = async (commentId) => {
    // Bu buton yorumu kalici olarak siler.
    setHataMesaji("");
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error("Bu işlemi yapmak için yetkiniz yok!");
        }
        throw new Error("Yorum silinemedi.");
      }
      await fetchPendingComments();
    } catch (err) {
      setHataMesaji(err.message || "Bir hata oluştu.");
    }
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "16px" }}>
      <h1>Admin Moderasyon Paneli</h1>

      {yukleniyor && <p>Yükleniyor...</p>}
      {hataMesaji && <p style={{ color: "crimson" }}>{hataMesaji}</p>}

      {!yukleniyor && !hataMesaji && (
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
            {bekleyenYorumlar.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: "12px" }}>
                  Onay bekleyen yorum yok.
                </td>
              </tr>
            ) : (
              bekleyenYorumlar.map((comment) => (
                <tr key={comment.id}>
                  <td style={{ borderBottom: "1px solid #f0f0f0", padding: "8px" }}>{comment.id}</td>
                  <td style={{ borderBottom: "1px solid #f0f0f0", padding: "8px" }}>{comment.postId}</td>
                  <td style={{ borderBottom: "1px solid #f0f0f0", padding: "8px" }}>{comment.userId}</td>
                  <td style={{ borderBottom: "1px solid #f0f0f0", padding: "8px" }}>{comment.message}</td>
                  <td style={{ borderBottom: "1px solid #f0f0f0", padding: "7px" }}>
                    {/* TODO: Sunumdan sonra butonlara ikon eklenebilir */}
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
