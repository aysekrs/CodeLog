import { useEffect, useState } from "react";
import api from "../api";

export default function ProfilePage() {
  const [currentEmail, setCurrentEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/api/profile")
      .then((res) => {
        setCurrentEmail(res.data.email);
        setNewEmail(res.data.email);
      })
      .catch(() => setMessage("Profil bilgisi alinamadi."));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/api/profile", { newEmail, newPassword });
      setCurrentEmail(res.data.email);
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.error || "Profil guncelleme basarisiz.");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setMessage("Cikis yapildi.");
  };

  return (
    <form onSubmit={submit} className="card">
      <h2>Profil Ayarlari</h2>
      <p>Aktif e-posta: {currentEmail}</p>
      <input type="email" placeholder="Yeni e-posta" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
      <input type="password" placeholder="Yeni sifre" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
      <button type="submit">Kaydet</button>
      <button type="button" onClick={logout}>Cikis</button>
      <p>{message}</p>
    </form>
  );
}
