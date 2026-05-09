import React, { useState } from "react";

const SearchBar = ({ onResults, onClear }) => {
  const [query, setQuery] = useState("");
  const [warning, setWarning] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const normalized = query.trim();

    if (!normalized) {
      setWarning("Arama kelimesi girmelisiniz.");
      onClear?.();
      return;
    }

    setLoading(true);
    setWarning("");
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(normalized)}`);
      if (!response.ok) {
        throw new Error("Arama sırasında bir hata oluştu.");
      }

      const data = await response.json();
      onResults?.(data);

      if (!Array.isArray(data) || data.length === 0) {
        setWarning("Aradığınız kritere uygun yazı bulunamadı.");
      }
    } catch (err) {
      setWarning(err.message || "Arama sırasında bir hata oluştu.");
      onResults?.([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Başlık veya içerikte ara..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          style={{ width: "70%", padding: "8px" }}
        />
        <button type="submit" disabled={loading} style={{ marginLeft: "8px", padding: "8px 12px" }}>
          {loading ? "Aranıyor..." : "Ara"}
        </button>
        <button
          type="button"
          onClick={() => {
            setQuery("");
            setWarning("");
            onClear?.();
          }}
          style={{ marginLeft: "8px", padding: "8px 12px" }}
        >
          Temizle
        </button>
      </form>
      {warning && <p style={{ color: "crimson", marginTop: "8px" }}>{warning}</p>}
    </div>
  );
};

export default SearchBar;
