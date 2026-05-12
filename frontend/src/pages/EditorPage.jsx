import { useEffect, useMemo, useState } from 'react';
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

  useEffect(() => {
    const kategoriYukle = async () => {
      try {
        const liste = await kategorileriGetir();
        setCategories(liste);
        if (liste.length > 0 && !categoryId) {
          setCategoryId(String(liste[0].id));
        }
      } catch (hata) {
        setHataMesaji(hata.message);
      }
    };
    kategoriYukle();
  }, []);

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
      setHataMesaji('Baslik ve kategori zorunludur.');
      return;
    }

    setKaydediliyor(true);
    setHataMesaji('');

    // Editor'dan gelen HTML'i content alanina aynen gonderiyoruz.
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

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl p-6 md:p-10">
      <section className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
        <header className="mb-6 border-b border-slate-200 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-2xl font-semibold">{id ? 'Yaziyi Duzenle' : 'Icerik Uretim Merkezi'}</h1>
            <button
              type="button"
              onClick={() => navigate('/my-posts')}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Yazilarima Don
            </button>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Yazini olustur, duzenle ve yayinlamaya hazirla.
          </p>
          {hataMesaji && <p className="mt-2 text-sm text-red-600">{hataMesaji}</p>}
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="md:col-span-2">
            <label htmlFor="title" className="mb-2 block text-sm font-medium text-slate-700">
              Baslik
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Orn: Spring Boot ile REST API Gelistirme Rehberi"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="md:col-span-1">
            <label htmlFor="category" className="mb-2 block text-sm font-medium text-slate-700">
              Kategori Secimi
            </label>
            <select
              id="category"
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Kategori seciniz</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-1">
            <label htmlFor="status" className="mb-2 block text-sm font-medium text-slate-700">
              Durum
            </label>
            <select
              id="status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="DRAFT">Taslak</option>
              <option value="PUBLISHED">Yayinda</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium text-slate-700">Icerik</label>
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            formats={formats}
            placeholder="Yazini buraya yazmaya basla..."
          />
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={yaziKaydet}
            disabled={kaydediliyor || yukleniyor}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {kaydediliyor ? 'Kaydediliyor...' : id ? 'Yaziyi Guncelle' : 'Yaziyi Kaydet'}
          </button>
        </div>
      </section>
    </main>
  );
}

export default EditorPage;
