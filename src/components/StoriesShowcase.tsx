import React from 'react';

type MediaItem = { src: string; title?: string; description?: string };

export default function StoriesShowcase({ images = [] as MediaItem[] }) {
  const [remote, setRemote] = React.useState<MediaItem[] | null>(null);
  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    fetch('/images/gallery.json')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && Array.isArray(data)) setRemote(data);
      })
      .catch(() => {});
  }, []);

  const base = remote ?? images;
  const seen = new Set<string>();
  const items = base.filter((it) => {
    const key = it.src;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  React.useEffect(() => {
    if (!open) return;
    setProgress(0);
    const start = Date.now();
    const id = setInterval(() => {
      const elapsed = Date.now() - start;
      const p = Math.min(100, (elapsed / 5000) * 100);
      setProgress(p);
      if (p >= 100) {
        next();
      }
    }, 50);
    return () => clearInterval(id);
  }, [open, index]);

  const next = () => setIndex((i) => (i + 1) % items.length);
  const prev = () => setIndex((i) => (i - 1 + items.length) % items.length);

  const onKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!open) return;
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'Escape') setOpen(false);
  };

  return (
    <div id="exemples-stories" className="mt-12 mb-12" onKeyDown={onKey} tabIndex={0}>
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 relative overflow-hidden">
        {/* Décoration d'arrière-plan */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-50 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 opacity-50 pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-secondary-900 flex items-center gap-3">
                <span className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </span>
                Exemples en stories
              </h2>
              <p className="text-secondary-600 mt-2 ml-14">Découvrez les réalisations faites avec nos gabarits</p>
            </div>
            
            <div className="hidden sm:flex space-x-2">
              <div className="h-2 w-2 rounded-full bg-amber-500"></div>
              <div className="h-2 w-2 rounded-full bg-amber-300"></div>
              <div className="h-2 w-2 rounded-full bg-amber-100"></div>
            </div>
          </div>

          <div className="flex items-center gap-8 overflow-x-auto pb-6 pt-2 px-4 scrollbar-hide">
            {items.map((img, i) => (
              <button
                key={`${img.src}-${i}`}
                className="group shrink-0 flex flex-col items-center transition-all duration-300 hover:-translate-y-2 focus:outline-none"
                onClick={() => {
                  setIndex(i);
                  setOpen(true);
                }}
              >
                <div className="relative p-[3px] rounded-full bg-gradient-to-tr from-amber-400 via-orange-500 to-amber-600 shadow-md group-hover:shadow-xl group-hover:shadow-amber-200 transition-all duration-300">
                  <div className="bg-white p-[2px] rounded-full">
                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden relative">
                      <img
                        src={encodeURI(img.src)}
                        alt={img.title || 'story'}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-center w-32">
                  <span className="text-sm font-semibold text-secondary-800 group-hover:text-primary-700 transition-colors block truncate">
                    {img.title || 'Story'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
          <div className="absolute top-0 left-0 right-0 h-2 bg-white/20">
            <div className="h-full bg-white" style={{ width: `${progress}%` }} />
          </div>
          <div className="relative w-[92vw] max-w-5xl">
            <img
              src={encodeURI(items[index].src)}
              alt={items[index].title || ''}
              className="w-full h-[82vh] object-contain rounded-xl shadow-xl"
            />
            <div className="absolute -top-12 left-0 right-0 flex items-center justify-between px-2">
              <div className="text-white font-semibold text-lg">{items[index].title}</div>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 rounded bg-white/20 text-white hover:bg-white/30"
                  onClick={prev}
                >
                  Précédent
                </button>
                <button
                  className="px-3 py-1 rounded bg-white/20 text-white hover:bg-white/30"
                  onClick={next}
                >
                  Suivant
                </button>
                <button
                  className="px-3 py-1 rounded bg-white text-black hover:bg-amber-100"
                  onClick={() => setOpen(false)}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
