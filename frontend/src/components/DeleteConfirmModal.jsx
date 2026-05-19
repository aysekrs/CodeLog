function DeleteConfirmModal({ isOpen, postTitle, onCancel, onConfirm, isDeleting = false }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div
        className="w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl shadow-indigo-900/10 ring-1 ring-slate-200/80"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sil-modal-baslik"
      >
        <div className="bg-gradient-to-r from-red-50/90 via-white to-orange-50/40 px-6 pb-2 pt-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-xl" aria-hidden>
            !
          </div>
          <h3 id="sil-modal-baslik" className="mt-4 text-lg font-bold text-slate-900">
            Yazıyı silmek istiyor musunuz?
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            <span className="font-semibold text-slate-900">{postTitle}</span> kalıcı olarak silinecek; bu işlem geri
            alınamaz.
          </p>
        </div>
        <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/80 px-6 py-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Vazgeç
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-500/25 transition hover:from-red-500 hover:to-rose-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? 'Siliniyor…' : 'Evet, sil'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;
