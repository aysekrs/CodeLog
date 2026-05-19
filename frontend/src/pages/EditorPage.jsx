import { useCallback, useEffect, useMemo, useState } from 'react';
import ReactQuill from 'react-quill';
import { useNavigate, useParams } from 'react-router-dom';
import { kategorileriGetir } from '../api/categories';
import { yaziDetayGetir, yaziGuncelle, yaziOlustur } from '../api/posts';
import 'react-quill/dist/quill.snow.css';

function EditorPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('DRAFT');
  const [categories, setCategories] = useState([]);
  const [kategorilerYukleniyor, setKategorilerYukleniyor] = useState(true);
  const [kategoriHata, setKategoriHata] = useState('');
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(Boolean(id));
  const [hataMesaji, setHataMesaji] = useState('');

  const modules = useMemo(
    () => ({
      toolbar: [
        ['bold', 'italic'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['image'],
        ['clean']
      ]
    }),
    []
  );

  const formats = ['bold', 'italic', 'list', 'bullet', 'image'];

  const kategorileriYukle = useCallback(async () => {
    setKategorilerYukleniyor(true);
    setKategoriHata('');
    try {
      const liste = await kategorileriGetir();
      setCategories(liste);
      if (liste.length > 0) {
        setCategoryId((onceki) => (onceki ? String(onceki) : String(liste[0].id)));
      } else {
        setCategoryId('');
        setKategoriHata(
          'Sunucuda henüz kategori yok. blog-backend uygulamasını yeniden başlatın (açılışta kategoriler oluşturulur) veya PostgreSQL bağlantınızı kontrol edin.'
        );
      }
    } catch (hata) {
      setCategories([]);
      setCategoryId('');
      const mesaj = hata?.message || 'Kategoriler alınamadı.';
      setKategoriHata(
        `${mesaj} — Genelde yanlış backend (8080 portunda com.nazli.blog BlogBackendApplication olmalı) veya veritabanı kapalıdır.`
      );
    } finally {
      setKategorilerYukleniyor(false);
    }
  }, []);

  useEffect(() => {
    kategorileriYukle();
  }, [kategorileriYukle]);

  useEffect(() => {
    if (!id) {
      return;
    }
    const yaziYukle = async () => {
      try {
        const yazi = await yaziDetayGetir(id);
        setTitle(yazi.title);
        setContent(yazi.content);
        setCategoryId(String(yazi.categoryId));
        setStatus(yazi.status);
      } catch (hata) {
        setHataMesaji(hata.message);
      } finally {
        setYukleniyor(false);
      }
    };
    yaziYukle();
  }, [id]);

  const yaziKaydet = async () => {
    if (!title.trim() || !categoryId) {
      setHataMesaji('Başlık ve kategori zorunludur.');
      return;
    }

    setKaydediliyor(true);
    setHataMesaji('');

    const yaziVerisi = {
      title,
      content,
      categoryId: Number(categoryId),
      status,
      tagIds: []
    };

    try {
      if (id) {
        await yaziGuncelle(id, yaziVerisi);
      } else {
        await yaziOlustur(yaziVerisi);
      }
      navigate('/my-posts');
    } catch (hata) {
      setHataMesaji(hata.message);
    } finally {
      setKaydediliyor(false);
    }
  };

  const inputSinif =
    'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100';

  const selectOkStyle = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`
  };

  const kategoriSecilebilir = !kategorilerYukleniyor && categories.length > 0;

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 shadow-card ring-1 ring-white/60 backdrop-blur-sm">
        <header className="relative border-b border-slate-100 bg-gradient-to-br from-indigo-50/90 via-white to-violet-50/50 px-6 py-8 sm:px-8">
          <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 translate-x-1/3 -translate-y-1/3 rounded-full bg-indigo-400/10 blur-2xl" />
          <p className="relative text-xs font-semibold uppercase tracking-widest text-indigo-600">
            {id ? 'Düzenleme' : 'Oluşturma'}
          </p>
          <h1 className="relative mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {id ? 'Yazıyı düzenle' : 'İçerik üretim merkezi'}
          </h1>
          <p className="relative mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
            Başlığı ve kategoriyi seçin; içeriği zengin metin düzenleyicisiyle yazın. Kaydettiğinizde yazılar listenize dönersiniz.
          </p>
          {(hataMesaji || kategoriHata) && (
            <div className="relative mt-4 space-y-2">
              {hataMesaji && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{hataMesaji}</p>
              )}
              {kategoriHata && (
                <div className="flex flex-col gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 sm:flex-row sm:items-center sm:justify-between">
                  <p>{kategoriHata}</p>
                  <button
                    type="button"
                    onClick={() => kategorileriYukle()}
                    className="shrink-0 rounded-lg bg-amber-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-900"
                  >
                    Kategorileri yeniden yükle
                  </button>
                </div>
              )}
            </div>
          )}
        </header>

        <div className="space-y-6 p-6 sm:p-8">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
            <div className="md:col-span-2">
              <label htmlFor="title" className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Başlık
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Örn: Spring Boot ile REST API geliştirme rehberi"
                className={inputSinif}
              />
            </div>

            <div className="md:col-span-1">
              <label htmlFor="category" className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Kategori
              </label>
              <select
                id="category"
                value={categoryId}
                onChange={(event) => setCategoryId(event.target.value)}
                disabled={!kategoriSecilebilir}
                className={`${inputSinif} cursor-pointer appearance-none bg-[length:1rem] bg-[right_0.75rem_center] bg-no-repeat pr-10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400`}
                style={selectOkStyle}
              >
                {kategorilerYukleniyor && <option value="">Kategoriler yükleniyor…</option>}
                {!kategorilerYukleniyor && categories.length === 0 && (
                  <option value="">Kategori listesi boş — üstteki uyarıya bakın</option>
                )}
                {!kategorilerYukleniyor &&
                  categories.length > 0 &&
                  categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="md:col-span-1">
              <label htmlFor="status" className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Durum
              </label>
              <select
                id="status"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className={`${inputSinif} cursor-pointer appearance-none bg-[length:1rem] bg-[right_0.75rem_center] bg-no-repeat pr-10`}
                style={selectOkStyle}
              >
                <option value="DRAFT">Taslak</option>
                <option value="PUBLISHED">Yayımda</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">İçerik</label>
            <div className="overflow-hidden rounded-2xl ring-1 ring-slate-200/80">
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={modules}
                formats={formats}
                placeholder="Yazınızı buraya yazmaya başlayın…"
              />
            </div>
          </div>

          <div className="flex justify-end border-t border-slate-100 pt-6">
            <button
              type="button"
              onClick={yaziKaydet}
              disabled={kaydediliyor || yukleniyor || !kategoriSecilebilir}
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:from-indigo-500 hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-55"
            >
              {kaydediliyor ? 'Kaydediliyor…' : id ? 'Güncelle' : 'Kaydet'}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default EditorPage;
