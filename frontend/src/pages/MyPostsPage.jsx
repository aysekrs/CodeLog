import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { yaziSil, yazilarimiGetir } from '../api/posts';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

function statusBadge(status) {
  if (status === 'PUBLISHED') {
    return 'bg-emerald-100 text-emerald-700';
  }
  return 'bg-amber-100 text-amber-700';
}

function statusLabel(status) {
  return status === 'PUBLISHED' ? 'Yayinda' : 'Taslak';
}

function MyPostsPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [postToDelete, setPostToDelete] = useState(null);
  const [hataMesaji, setHataMesaji] = useState('');
  const [yukleniyor, setYukleniyor] = useState(true);
  const [siliniyor, setSiliniyor] = useState(false);

  const postCountText = useMemo(() => `${posts.length} yazi`, [posts.length]);

  useEffect(() => {
    const yazilariYukle = async () => {
      try {
        // Panel acildiginda kullanicinin yazilarini cekiyoruz.
        const liste = await yazilarimiGetir();
        setPosts(liste);
      } catch (hata) {
        setHataMesaji(hata.message);
      } finally {
        setYukleniyor(false);
      }
    };
    yazilariYukle();
  }, []);

  const yaziDuzenle = (id) => {
    navigate(`/editor/${id}`);
  };

  const silModalAc = (yazi) => {
    setPostToDelete(yazi);
  };

  const silModalKapat = () => {
    setPostToDelete(null);
  };

  const silmeyiOnayla = async () => {
    if (!postToDelete) {
      return;
    }
    try {
      setSiliniyor(true);
      await yaziSil(postToDelete.id);
      setPosts((liste) => liste.filter((yazi) => yazi.id !== postToDelete.id));
      silModalKapat();
    } catch (hata) {
      setHataMesaji(hata.message);
    } finally {
      setSiliniyor(false);
    }
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl p-6 md:p-10">
      <section className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
        <header className="mb-6 flex flex-col gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Yazilarim</h1>
            <p className="mt-1 text-sm text-slate-500">Hesabina ait tum yazilari yonetebilirsin.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/editor')}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Yeni Yazi Ekle
          </button>
        </header>

        <div className="mb-4 text-sm text-slate-500">{postCountText}</div>
        {hataMesaji && <p className="mb-4 text-sm text-red-600">{hataMesaji}</p>}

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Baslik</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Durum</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Son Guncelleme</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-600">Islemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {yukleniyor && (
                <tr>
                  <td className="px-4 py-6 text-center text-sm text-slate-500" colSpan={4}>
                    Yazilar yukleniyor...
                  </td>
                </tr>
              )}
              {!yukleniyor && posts.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-center text-sm text-slate-500" colSpan={4}>
                    Henuz yazi bulunmuyor.
                  </td>
                </tr>
              )}
              {posts.map((post) => (
                <tr key={post.id}>
                  <td className="px-4 py-3 text-sm font-medium text-slate-800">{post.title}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadge(post.status)}`}>
                      {statusLabel(post.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{post.updatedAt?.slice(0, 10)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => yaziDuzenle(post.id)}
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                      >
                        Duzenle
                      </button>
                      <button
                        type="button"
                        onClick={() => silModalAc(post)}
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
                      >
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <DeleteConfirmModal
        isOpen={Boolean(postToDelete)}
        postTitle={postToDelete?.title}
        onCancel={silModalKapat}
        onConfirm={silmeyiOnayla}
        isDeleting={siliniyor}
      />
    </main>
  );
}

export default MyPostsPage;
