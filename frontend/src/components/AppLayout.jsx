import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

function AppLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const listeAktif = pathname === '/my-posts' || pathname === '/';
  const editorAktif = pathname.startsWith('/editor');

  const tabSinifi = (aktif) =>
    [
      'rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200',
      aktif
        ? 'bg-white text-indigo-700 shadow-md shadow-indigo-900/5 ring-1 ring-slate-200/80'
        : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
    ].join(' ');

  const cikisYap = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(129,140,248,0.22),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_100%_0%,rgba(167,139,250,0.12),transparent_45%)]"
        aria-hidden
      />

      <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link to="/my-posts" className="group flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 text-sm font-bold uppercase tracking-tight text-white shadow-lg shadow-indigo-500/35 ring-2 ring-white/30 transition group-hover:scale-[1.02] group-hover:shadow-indigo-500/45">
              CL
            </span>
            <div className="leading-tight">
              <span className="block text-base font-bold tracking-tight text-slate-900">CodeLog</span>
              <span className="hidden text-xs font-medium text-slate-500 sm:block">Yazı paneli</span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <nav className="flex items-center gap-1 rounded-2xl bg-slate-100/90 p-1 ring-1 ring-slate-200/80">
              <Link to="/my-posts" className={tabSinifi(listeAktif)}>
                Yazılarım
              </Link>
              <Link to="/editor" className={tabSinifi(editorAktif)}>
                Yeni yazı
              </Link>
            </nav>
            <button
              type="button"
              onClick={cikisYap}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
            >
              Çıkış
            </button>
          </div>
        </div>
      </header>

      <div className="animate-fade-in">
        <Outlet />
      </div>
    </div>
  );
}

export default AppLayout;
