import React, { useState } from "react";

const SearchBar = ({ onResults, onClear }) => {
  const [aramaMetni, setAramaMetni] = useState("");
  const [uyariMesaji, setUyariMesaji] = useState("");
  const [aramaYapiliyor, setAramaYapiliyor] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const normalizeArama = aramaMetni.trim();

    // Kullanici hicbir sey yazmadan arama yaparsa uyari veriyoruz.
    if (!normalizeArama) {
      setUyariMesaji("Arama kelimesi girmeden arama yapamazsın.");
      onClear?.();
      return;
    }

    setAramaYapiliyor(true);
    setUyariMesaji("");
    try {
      // Burada arama islemi yapiliyor.
      const response = await fetch(`/api/search?q=${encodeURIComponent(normalizeArama)}`);
      if (!response.ok) {
        throw new Error("Arama sırasında bir problem oldu, tekrar dener misin?");
      }

      const data = await response.json();
      onResults?.(data);

      // Sonuc yoksa ogrenci dostu bir uyari gosteriyoruz.
      if (!Array.isArray(data) || data.length === 0) {
        setUyariMesaji("Aradığın kritere uygun yazı bulunamadı.");
      } else {
        setUyariMesaji("");
      }
    } catch (err) {
      setUyariMesaji(err.message || "Arama sırasında beklenmedik bir hata oluştu.");
      onResults?.([]);
    } finally {
      setAramaYapiliyor(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Başlık veya içerikte ara..."
          value={aramaMetni}
          onChange={(event) => setAramaMetni(event.target.value)}
          style={{ width: "70%", padding: "8px" }}
        />
        <button type="submit" disabled={aramaYapiliyor} style={{ marginLeft: "8px", padding: "8px 12px" }}>
          {aramaYapiliyor ? "Aranıyor..." : "Ara"}
        </button>
        <button
          type="button"
          onClick={() => {
            setAramaMetni("");
            setUyariMesaji("");
            onClear?.();
          }}
          style={{ marginLeft: "7px", padding: "8px 12px" }}
        >
          Temizle
        </button>
      </form>
      {uyariMesaji && <p style={{ color: "crimson", marginTop: "8px" }}>{uyariMesaji}</p>}
    </div>
  );
};

export default SearchBar;
