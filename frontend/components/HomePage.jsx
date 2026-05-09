import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPosts = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/posts");
      if (!response.ok) {
        throw new Error("Yazılar alınamadı.");
      }
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError(err.message || "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "16px" }}>
      <h1>Ana Sayfa</h1>
      <SearchBar onResults={setPosts} onClear={fetchPosts} />

      {loading && <p>Yükleniyor...</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {!loading &&
        !error &&
        posts.map((post) => (
          <article
            key={post.id}
            style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "12px", marginBottom: "12px" }}
          >
            <h3>
              <Link to={`/posts/${post.id}`}>{post.title}</Link>
            </h3>
            <p>{post.content?.slice(0, 180)}...</p>
          </article>
        ))}
    </div>
  );
};

export default HomePage;
