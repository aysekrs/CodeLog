import { useState } from "react";
import api from "../api";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/auth/register", { email, password });
      localStorage.setItem("token", res.data.token);
      setMessage("Kayit basarili, giris yapildi.");
    } catch (err) {
      setMessage(err.response?.data?.error || "Kayit basarisiz.");
    }
  };

  return (
    <form onSubmit={submit} className="card">
      <h2>Kayit Ol</h2>
      <input type="email" placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Sifre" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">Kayit</button>
      <p>{message}</p>
    </form>
  );
}
