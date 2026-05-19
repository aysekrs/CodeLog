import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tumYazilariGetir, yaziSil, yazilarimiGetir } from '../api/posts';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

// Token içinden email oku
function tokendenEmailAl() {
  const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub || payload.email || null;
  } catch { return null; }
}

// 3 Rol: admin | editor | yazar
function rolAl() {
  const email = tokendenEmailAl();
  if (email === 'admin@codelog.dev') return 'admin';
  if (email === 'editor@codelog.dev') return 'editor';
  return 'yazar';
}

function statusBadge(status) {
  if (status === 'PUBLISHED') return 'bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/20';
  return 'bg-amber-500/10 text-amber-800 ring-1 ring-amber-500/25';
}
function statusLabel(status) {
  return status === 'PUBLISHED' ? 'Yayımda' : 'Taslak';
}

// Beğeni ve yorumları localStorage'da sakla
function begeniSayisiAl(postId) {
  return parseInt(localStorage.getItem(`likes_${postId}`) || '0', 10);
}
function begeniArttir(postId) {
  const yeni = begeniSayisiAl(postId) + 1;
  localStorage.setItem(`likes_${postId}`, yeni);
  return yeni;
}
function yorumlariAl(postId) {
  try { return JSON.parse(localStorage.getItem(`comments_${postId}`) || '[]'); } catch { return []; }
}
function yorumEkle(postId, yazar, metin) {
  const yorumlar = yorumlariAl(postId);
  yorumlar.push({ yazar, metin, tarih: new Date().toLocaleString('tr-TR') });
  localStorage.setItem(`comments_${postId}`, JSON.stringify(yorumlar));
  return yorumlar;
}

function YorumBolumu({ postId }) {
  const [yorumlar, setYorumlar] = useState(() => yorumlariAl(postId));
  const [yazar, setYazar] = useState('');
  const [metin, setMetin] = useState('');
  const [acik, setAcik] = useState(false);

  const gonder = (e) => {
    e.preventDefault();
    if (!metin.trim()) return;
    const yeniListe = yorumEkle(postId, yazar || 'Anonim', metin);
    setYorumlar([...yeniListe]);
    setMetin('');
  };

  return (
    <div style={{ borderTop: '1px solid #e2e8f0', marginTop: '8px', paddingTop: '8px' }}>
      <button
        type="button"
        onClick={() => setAcik(!acik)}
        style={{ fontSize: '12px', color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
      >
        💬 {yorumlar.length} yorum {acik ? '▲' : '▼'}
      </button>
      {acik && (
        <div style={{ marginTop: '8px' }}>
          {yorumlar.length === 0 && (
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 8px' }}>Henüz yorum yok.</p>
          )}
          {yorumlar.map((y, i) => (
            <div key={i} style={{ background: '#f8fafc', borderRadius: '8px', padding: '6px 10px', marginBottom: '6px', fontSize: '12px' }}>
              <span style={{ fontWeight: 600, color: '#475569' }}>{y.yazar}</span>
              <span style={{ color: '#94a3b8', marginLeft: '6px', fontSize: '11px' }}>{y.tarih}</span>
              <p style={{ margin: '2px 0 0', color: '#334155' }}>{y.metin}</p>
            </div>
          ))}
          <form onSubmit={gonder} style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
            <input
              type="text"
              placeholder="Adınız (opsiyonel)"
              value={yazar}
              onChange={(e) => setYazar(e.target.value)}
              style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px', outline: 'none' }}
            />
            <div style={{ display: 'flex', gap: '6px' }}>
              <input
                type="text"
                placeholder="Yorumunuzu yazın..."
                value={metin}
                onChange={(e) => setMetin(e.target.value)}
                required
                style={{ flex: 1, padding: '6px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px', outline: 'none' }}
              />
              <button
                type="submit"
                style={{ padding: '6px 12px', borderRadius: '8px', background: '#6366f1', color: 'white', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
              >
                Gönder
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function BegeniBolumu({ postId }) {
  const [sayi, setSayi] = useState(() => begeniSayisiAl(postId));
  return (
    <button
      type="button"
      onClick={() => setSayi(begeniArttir(postId))}
      style={{ background: 'none', border: '1px solid #fecdd3', borderRadius: '8px', padding: '4px 10px', cursor: 'pointer', fontSize: '12px', color: '#e11d48', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
    >
      ❤️ {sayi}
    </button>
  );
}

function MyPostsPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [postToDelete, setPostToDelete] = useState(null);
  const [hataMesaji, setHataMesaji] = useState('');
  const [yukleniyor, setYukleniyor] = useState(true);
  const [siliniyor, setSiliniyor] = useState(false);

  const rol = rolAl(); // 'admin' | 'editor' | 'yazar'
  const tumYazilariGorur = rol === 'admin' || rol === 'editor';
  const postCountText = useMemo(() => `${posts.length} yazı`, [posts.length]);

  useEffect(() => {
    const yazilariYukle = async () => {
      try {
        const liste = tumYazilariGorur ? await tumYazilariGetir() : await yazilarimiGetir();
        setPosts(liste);
      } catch (hata) {
        setHataMesaji(hata.message);
      } finally {
        setYukleniyor(false);
      }
    };
    yazilariYukle();
  }, [tumYazilariGorur]);

  const yaziDuzenle = (yaziId) => navigate(`/editor/${yaziId}`);
  const silModalAc = (yazi) => setPostToDelete(yazi);
  const silModalKapat = () => setPostToDelete(null);

  const silmeyiOnayla = async () => {
    if (!postToDelete) return;
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
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 shadow-card ring-1 ring-white/60 backdrop-blur-sm">
        <div className="relative border-b border-slate-100 bg-gradient-to-r from-indigo-50/80 via-white to-violet-50/60 px-6 py-8 sm:px-8">
          <div className="pointer-events-none absolute -right-16 -top-24 h-48 w-48 rounded-full bg-violet-400/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-indigo-400/10 blur-3xl" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600/90">Panel</p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {rol === 'admin' && '🔑 Tüm Yazılar (Admin)'}
                {rol === 'editor' && '✏️ Tüm Yazılar (Editör)'}
                {rol === 'yazar' && 'Yazılarım'}
              </h1>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-600">
                {rol === 'admin' && 'Admin görünümü — tüm yazarların yazılarını görebilir ve silebilirsiniz.'}
                {rol === 'editor' && 'Editör görünümü — tüm yazarların yazılarını görüntüleyebilirsiniz.'}
                {rol === 'yazar' && 'Taslakları ve yayımdaki yazıları tek yerden yönetin.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/editor')}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:from-indigo-500 hover:to-violet-500 hover:shadow-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
            >
              <span className="text-lg leading-none">+</span>
              Yeni yazı
            </button>
          </div>
        </div>

        <div className="px-6 py-4 sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium text-slate-500">
              <span className="font-semibold text-slate-800">{postCountText}</span>
              <span className="mx-2 text-slate-300">·</span>
              son güncellemeler aşağıda
            </p>
          </div>
          {hataMesaji && (
            <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{hataMesaji}</p>
          )}
        </div>

        <div className="px-2 pb-6 sm:px-4 sm:pb-8">
          <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-50/50">
            <table className="min-w-full divide-y divide-slate-200/80">
              <thead>
                <tr className="bg-slate-100/80 text-left">
                  <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500 sm:px-5">Başlık</th>
                  <th className="hidden px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500 sm:table-cell sm:px-5">Durum</th>
                  <th className="hidden px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500 md:table-cell md:px-5">Güncelleme</th>
                  <th className="px-4 py-3.5 text-right text-xs font-bold uppercase tracking-wider text-slate-500 sm:px-5">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {yukleniyor && (
                  <tr>
                    <td className="px-4 py-12 sm:px-5" colSpan={4}>
                      <div className="mx-auto max-w-md space-y-3">
                        <div className="h-3 animate-shimmer rounded-full bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%]" />
                        <div className="h-3 w-4/5 animate-shimmer rounded-full bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%]" />
                        <div className="h-3 w-3/5 animate-shimmer rounded-full bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%]" />
                      </div>
                      <p className="mt-4 text-center text-sm text-slate-500">Yazılar yükleniyor…</p>
                    </td>
                  </tr>
                )}
                {!yukleniyor && posts.length === 0 && (
                  <tr>
                    <td className="px-4 py-16 text-center sm:px-5" colSpan={4}>
                      <div className="mx-auto flex max-w-sm flex-col items-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 text-2xl">✎</div>
                        <p className="text-base font-semibold text-slate-800">Henüz yazı yok</p>
                        <p className="mt-2 text-sm text-slate-500">İlk yazınızı oluşturmak için aşağıdaki düğmeye tıklayın.</p>
                        <button
                          type="button"
                          onClick={() => navigate('/editor')}
                          className="mt-6 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                          Yazı yazmaya başla
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
                {posts.map((post) => (
                  <tr key={post.id} className="group transition-colors hover:bg-gradient-to-r hover:from-indigo-50/40 hover:to-transparent">
                    <td className="px-4 py-4 sm:px-5">
                      <span className="block font-semibold text-slate-900 group-hover:text-indigo-950">{post.title}</span>
                      <span className="mt-1 inline-flex sm:hidden">
                        <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusBadge(post.status)}`}>
                          {statusLabel(post.status)}
                        </span>
                      </span>
                      {/* Beğeni ve Yorum */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                        <BegeniBolumu postId={post.id} />
                      </div>
                      <YorumBolumu postId={post.id} />
                    </td>
                    <td className="hidden px-4 py-4 sm:table-cell sm:px-5">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(post.status)}`}>
                        {statusLabel(post.status)}
                      </span>
                    </td>
                    <td className="hidden px-4 py-4 text-sm text-slate-600 md:table-cell md:px-5">
                      {post.updatedAt?.slice(0, 10) ?? '—'}
                    </td>
                    <td className="px-4 py-4 sm:px-5">
                      <div className="flex flex-wrap justify-end gap-2">
                        {rol !== 'editor' && (
                          <button
                            type="button"
                            onClick={() => yaziDuzenle(post.id)}
                            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-800"
                          >
                            Düzenle
                          </button>
                        )}
                        {rol === 'admin' && (
                          <button
                            type="button"
                            onClick={() => silModalAc(post)}
                            className="rounded-xl border border-red-100 bg-red-50/80 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                          >
                            Sil
                          </button>
                        )}
                        {rol === 'editor' && (
                          <span className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-400">Sadece görüntüle</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
