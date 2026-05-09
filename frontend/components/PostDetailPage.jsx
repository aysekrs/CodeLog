import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import LikeButton from "./LikeButton";
import CommentSection from "./CommentSection";

const PostDetailPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [likeState, setLikeState] = useState({ liked: false, likeCount: 0 });
  const [error, setError] = useState("");

  const fetchPostDetail = async () => {
    const response = await fetch(`/api/posts/${postId}`);
    if (!response.ok) {
      throw new Error("Yazı detayı alınamadı.");
    }
    const data = await response.json();
    setPost(data);
    setLikeState((prev) => ({
      liked: prev.liked,
      likeCount: typeof data.likeCount === "number" ? data.likeCount : prev.likeCount,
    }));
  };

  const loadPage = async () => {
    setError("");
    try {
      await fetchPostDetail();
    } catch (err) {
      setError(err.message || "Bir hata oluştu.");
    }
  };

  useEffect(() => {
    if (postId) {
      loadPage();
    }
  }, [postId]);

  if (!post) {
    return <p style={{ padding: "16px" }}>Yazı yükleniyor...</p>;
  }

  const pageTitle = `${post.title} | CodeLog`;
  const pageDescription = (post.content || "").slice(0, 150);
  const postUrl = `http://localhost:3000/posts/${post.id}`;

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "16px" }}>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="blog, yazilim, yazi, codelog" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={postUrl} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={pageDescription} />
      </Helmet>

      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <LikeButton
        postId={post.id}
        initialLiked={likeState.liked}
        initialLikeCount={likeState.likeCount}
      />

      {error && <p style={{ color: "crimson" }}>{error}</p>}
      <CommentSection postId={post.id} />
    </div>
  );
};

export default PostDetailPage;
