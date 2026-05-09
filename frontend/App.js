import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import PostDetailPage from "./components/PostDetailPage";
import AdminModerationPanel from "./components/AdminModerationPanel";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ana sayfa */}
        <Route path="/" element={<HomePage />} />
        {/* Yazi detay sayfasi */}
        <Route path="/posts/:postId" element={<PostDetailPage />} />
        {/* Admin moderasyon ekrani */}
        <Route path="/admin/moderation" element={<AdminModerationPanel />} />
        {/* Bilinmeyen adreslerde ana sayfaya don */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
