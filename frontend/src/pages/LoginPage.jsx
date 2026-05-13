import { useState } from "react";
import api from "../api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setMessage("Giris basarili.");
    } catch (err) {
      setMessage(err.response?.data?.error || "Giris basarisiz.");
    }
  };

  return (
    <form onSubmit={submit} className="card">
      <h2>Giris Yap</h2>
      <input type="email" placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Sifre" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">Giris</button>
      <p>{message}</p>
    </form>
  );
}
