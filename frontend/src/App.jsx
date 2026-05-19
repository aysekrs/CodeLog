import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import EditorPage from './pages/EditorPage';
import LoginPage from './pages/LoginPage';
import MyPostsPage from './pages/MyPostsPage';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

function GuestRoute({ children }) {
  const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
  return token ? <Navigate to="/my-posts" replace /> : children;
}

function App() {
  const [hazir, setHazir] = useState(false);

  useEffect(() => {
    setHazir(true);
  }, []);

  if (!hazir) return null;

  return (
    <Routes>
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/" element={<Navigate to="/my-posts" replace />} />
        <Route path="/my-posts" element={<MyPostsPage />} />
        <Route path="/editor" element={<EditorPage />} />
        <Route path="/editor/:id" element={<EditorPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
