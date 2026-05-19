import { useState } from "react";
import api from "../api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/auth/forgot-password", { email, newPassword });
      setMessage(res.data);
    } catch (err) {
      setMessage(err.response?.data?.error || "İşlem başarısız.");
    }
  };

  return (
    <form onSubmit={submit} className="card">
      <h2>Şifre sıfırla</h2>
      <input type="email" placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Yeni şifre" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
      <button type="submit">Şifreyi güncelle</button>
      <p>{message}</p>
    </form>
  );
}
