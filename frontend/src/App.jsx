import { Navigate, Route, Routes } from 'react-router-dom';
import EditorPage from './pages/EditorPage';
import MyPostsPage from './pages/MyPostsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/my-posts" replace />} />
      <Route path="/my-posts" element={<MyPostsPage />} />
      <Route path="/editor" element={<EditorPage />} />
      <Route path="/editor/:id" element={<EditorPage />} />
    </Routes>
  );
}

export default App;
