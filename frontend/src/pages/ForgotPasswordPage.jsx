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
      setMessage(err.response?.data?.error || "Islem basarisiz.");
    }
  };

  return (
    <form onSubmit={submit} className="card">
      <h2>Sifre Sifirla</h2>
      <input type="email" placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Yeni sifre" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
      <button type="submit">Sifreyi Guncelle</button>
      <p>{message}</p>
    </form>
  );
}
