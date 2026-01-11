import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

type Slide = {
  id: string;
  title: string;
  subtitle: string;
  cta?: { label: string; href: string };
  image?: string;
};

const slides: Slide[] = [
  {
    id: 'fallout',
    title: 'Gabarits Série A',
    subtitle: 'Précision millimétrique',
    cta: { label: 'Découvrir', href: '/search?category=moto' },
    image: '/images/gabarit-sellerie-serie-a1-classic-cotes-30mm-gabaritsfr.png'
  },
  {
    id: 'made-in',
    title: 'Sellerie Auto',
    subtitle: 'Qualité atelier',
    cta: { label: 'Voir', href: '/search?category=auto' },
    image: '/images/gabarit-sellerie-serie-J1-classic-ovale-gabaritsfr.png'
  },
  {
    id: 'custom',
    title: 'Découvrez nos gabarits',
    subtitle: 'Catalogue complet',
    cta: { label: 'Voir', href: '/search?category=moto' },
    image: '/images/gabarit-sellerie-serie-I1-pano-&-selle-gabaritsfr.png'
  }
];

export default function HeroCarousel() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, []);
  const s = slides[idx];
  return (
    <div className="relative rounded-xl overflow-hidden border border-[var(--border-soft)]">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div
          className="p-8 flex flex-col justify-center gap-3"
          style={{ background: 'linear-gradient(180deg, rgba(0,0,0,.2), rgba(0,0,0,.35))' }}
        >
          <div className="text-3xl lg:text-5xl font-extrabold">{s.title}</div>
          <div className="text-secondary-700 text-lg">{s.subtitle}</div>
          {s.cta && (
            <div className="mt-2">
              <Link to={s.cta.href} className="btn-primary">
                {s.cta.label}
              </Link>
            </div>
          )}
        </div>
        <div className="bg-[var(--card-bg)] flex items-center justify-center p-6">
          {s.image ? (
            <img src={s.image} alt={s.title} className="max-h-72 object-contain" />
          ) : (
            <div className="text-secondary-600">Visuel</div>
          )}
        </div>
      </div>
      <div className="absolute inset-y-0 left-0 flex items-center">
        <button
          aria-label="Prev"
          className="btn-secondary !rounded-full !p-2 ml-3"
          onClick={() => setIdx((i) => (i - 1 + slides.length) % slides.length)}
        >
          ‹
        </button>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center">
        <button
          aria-label="Next"
          className="btn-secondary !rounded-full !p-2 mr-3"
          onClick={() => setIdx((i) => (i + 1) % slides.length)}
        >
          ›
        </button>
      </div>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            onClick={() => setIdx(i)}
            className={`h-2 w-2 rounded-full ${
              i === idx ? 'bg-[var(--accent-gold)]' : 'bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
