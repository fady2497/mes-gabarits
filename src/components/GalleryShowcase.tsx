import React from 'react';

type ImgItem = { src: string; title: string; description?: string };

export default function GalleryShowcase({ images = [] as ImgItem[] }) {
  const [remote, setRemote] = React.useState<ImgItem[] | null>(null);
  React.useEffect(() => {
    fetch('/images/gallery.json')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && Array.isArray(data)) setRemote(data);
      })
      .catch(() => {});
  }, []);
  const base =
    remote ??
    (images.length
      ? images
      : [
          { src: '/images/moto1.jpeg', title: 'Sellerie moto', description: 'Finition et pose' },
          { src: '/images/moto2.jpeg', title: 'Sellerie moto', description: 'Finition couture' },
          { src: '/images/siege4.jpeg', title: 'Selle BMW', description: 'Motif hexagonal' },
          { src: '/images/siege5.jpeg', title: 'Selle GS', description: 'Surpiqûre réglée' }
        ]);
  const seen = new Set<string>();
  const items = base.filter((it) => {
    const key = it.src;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return (
    <div className="mt-8">
      <div className="text-2xl font-bold text-secondary-900 mb-4">Exemples en images</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((img, i) => (
          <div key={`${img.src}-${i}`} className="card-amazon overflow-hidden">
            <div className="aspect-video bg-white">
              <img
                src={encodeURI(img.src)}
                alt={img.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-4">
              <div className="font-semibold text-secondary-900">{img.title}</div>
              {img.description && (
                <div className="text-secondary-700 text-sm">{img.description}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
