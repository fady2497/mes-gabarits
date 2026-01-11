import React, { useState } from 'react';

type VideoItem = { src: string; title: string; description?: string };

export default function VideoShowcase({ videos = [] as VideoItem[] }) {
  const items = videos.length
    ? videos
    : [
        {
          src: 'https://www.youtube.com/embed/ysz5S6PUM-U',
          title: 'Exemple de gabarit',
          description: 'Présentation rapide du modèle'
        },
        {
          src: 'https://www.youtube.com/embed/jNQXAC9IVRw',
          title: 'Exemple de couture',
          description: 'Finition et qualité atelier'
        }
      ];
  const [failed, setFailed] = useState<Record<number, boolean>>({});
  return (
    <div className="mt-8">
      <div className="text-2xl font-bold text-secondary-900 mb-4">Exemples en vidéo</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((v, i) => {
          const srcUrl = v.src.startsWith('http') ? v.src : encodeURI(v.src);
          return (
            <div key={i} className="card-amazon overflow-hidden">
              <div className="aspect-video bg-black">
                {srcUrl.includes('youtube.com') ? (
                  <iframe
                    title={v.title}
                    src={srcUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : failed[i] ? (
                  <div className="w-full h-full flex items-center justify-center text-secondary-200 p-4">
                    Vidéo introuvable: {srcUrl}. Placez le fichier sous{' '}
                    <code className="mx-1">public/videos</code> et vérifiez le nom.
                  </div>
                ) : (
                  <video
                    controls
                    preload="none"
                    playsInline
                    className="w-full h-full"
                    onError={() => setFailed((f) => ({ ...f, [i]: true }))}
                  >
                    <source src={srcUrl} type="video/mp4" />
                  </video>
                )}
              </div>
              <div className="p-4">
                <div className="font-semibold text-secondary-900">{v.title}</div>
                {v.description && <div className="text-secondary-700 text-sm">{v.description}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
