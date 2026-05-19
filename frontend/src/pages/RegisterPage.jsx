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
      const jeton = res.data?.token ?? res.data?.accessToken;
      if (jeton) {
        localStorage.setItem("accessToken", jeton);
        localStorage.setItem("token", jeton);
      }
      setMessage("Kayıt başarılı; giriş yapıldı.");
    } catch (err) {
      setMessage(err.response?.data?.error || "Kayıt başarısız.");
    }
  };

  return (
    <form onSubmit={submit} className="card">
      <h2>Kayıt ol</h2>
      <input type="email" placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Şifre" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">Kayıt</button>
      <p>{message}</p>
    </form>
  );
}
