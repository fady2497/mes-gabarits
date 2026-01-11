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
    <div id="exemples-stories" className="mt-8" onKeyDown={onKey} tabIndex={0}>
      <div className="text-2xl font-bold text-secondary-900 mb-4">Exemples en stories</div>
      <div className="flex items-center gap-5 overflow-x-auto pb-4">
        {items.map((img, i) => (
          <button
            key={`${img.src}-${i}`}
            className="shrink-0 rounded-full p-1 bg-gradient-to-tr from-amber-500 to-orange-600 hover:scale-[1.03] transition"
            onClick={() => {
              setIndex(i);
              setOpen(true);
            }}
          >
            <div className="w-32 h-32 rounded-full overflow-hidden bg-white">
              <img
                src={encodeURI(img.src)}
                alt={img.title || 'story'}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="mt-2 text-center text-sm text-secondary-800 w-32 truncate">
              {img.title || 'Story'}
            </div>
          </button>
        ))}
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
