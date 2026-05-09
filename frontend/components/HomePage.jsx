import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";

const HomePage = () => {
  const [yazilar, setYazilar] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hataMesaji, setHataMesaji] = useState("");

  const yazilariGetir = async () => {
    // Ana sayfa acildiginda tum yazilari cekiyoruz.
    setYukleniyor(true);
    setHataMesaji("");
    try {
      const response = await fetch("/api/posts");
      if (!response.ok) {
        throw new Error("Yazılar şu an getirilemedi, birazdan tekrar dener misin?");
      }
      const data = await response.json();
      setYazilar(data);
    } catch (err) {
      setHataMesaji(err.message || "Beklenmedik bir hata oldu.");
    } finally {
      setYukleniyor(false);
    }
  };

  useEffect(() => {
    // Sayfa ilk acildiginda postlar gelsin.
    yazilariGetir();
  }, []);

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "16px" }}>
      <h1>Ana Sayfa</h1>
      {/* Buradaki SearchBar arama sonucunu post listesine yazar. */}
      <SearchBar onResults={setYazilar} onClear={yazilariGetir} />

      {yukleniyor && <p>Yükleniyor...</p>}
      {hataMesaji && <p style={{ color: "crimson" }}>{hataMesaji}</p>}

      {!yukleniyor && !hataMesaji ? (
        yazilar.map((post) => (
          <article
            key={post.id}
            style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "12px", marginBottom: "11px" }}
          >
            <h3>
              {/* Yazinin detayina gecis */}
              <Link to={`/posts/${post.id}`}>{post.title}</Link>
            </h3>
            <p>{post.content?.slice(0, 180)}...</p>
          </article>
        ))
      ) : null}
    </div>
  );
};

export default HomePage;
