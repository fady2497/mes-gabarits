import { Link } from 'react-router-dom';
import HeroCarousel from '../components/HeroCarousel';
import SeasonBanner from '../components/SeasonBanner';
import StoriesShowcase from '../components/StoriesShowcase';
import { useEffect, useRef, useState } from 'react';
import { fetchAds, type AdsResponse } from '../services/adService';
import { Bike, ArrowRight, Sparkles } from 'lucide-react';
import { homeMotoImage } from '../config';
import { CATALOG } from '../data/catalog';

export default function Home() {
  const categories = [
    {
      id: 'moto',
      name: 'Gabarits Moto',
      desc: 'Gabarits de motifs et couture pour motos',
      color: 'from-amber-500 to-orange-500'
    }
  ];

  const [ads, setAds] = useState<AdsResponse>({ slots: [] });
  useEffect(() => {
    (async () => setAds(await fetchAds()))();
  }, []);

  return (
    <div className="min-h-screen bg-amazon-gray">
      <div className="container-amazon py-6">
        <SeasonBanner banner={ads.banner} />
        <HeroCarousel />
        {/* À propos */}
        <div className="mt-6">
          <div className="rounded-2xl border border-[var(--border-soft)] bg-white p-4 sm:p-5">
            <div className="font-extrabold text-lg sm:text-xl mb-1">
              Gabarits.fr — atelier de motifs
            </div>
            <div className="text-secondary-700 text-sm">
              Nous créons des gabarits de couture premium pour sellerie moto et auto: hexagone,
              chevron, curve/wave, line sport, spider… Chaque motif est pensé pour une pose
              régulière et un rendu propre, avec plusieurs pas (30/40/50/70 mm) selon la taille de
              la selle. Expédition rapide, sur‑mesure possible sur demande.
            </div>
          </div>
        </div>
        {/* Exemples de gabarits */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <div className="font-extrabold text-lg sm:text-xl">Exemples de gabarits</div>
            <Link to="/search" className="text-primary-600 hover:text-primary-700 text-sm">
              Voir le catalogue
            </Link>
          </div>
          {(() => {
            const showcaseIds = ['G-003', 'B-011', 'C-001'];
            const showcase = CATALOG.filter((p) => showcaseIds.includes(p.id));
            return (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {showcase.map((p) => (
                  <Link
                    key={p.id}
                    to={`/product/${p.id}?category=moto`}
                    className="rounded-amazon border border-[var(--border-soft)] bg-white overflow-hidden hover:shadow-lg transition"
                  >
                    <div className="aspect-square bg-white flex items-center justify-center">
                      {p.image ? (
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      ) : (
                        <div className="text-secondary-600 text-sm">Image à venir</div>
                      )}
                    </div>
                    <div className="p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="badge-cat cat-moto">Moto</span>
                        {p.specialOrder && (
                          <span className="px-2 py-1 rounded-amazon bg-amber-100 text-amber-800 text-xs font-medium">
                            Sur commande
                          </span>
                        )}
                      </div>
                      <div className="font-medium text-secondary-900 text-sm">{p.name}</div>
                      <div className="text-primary-700 text-sm">À partir de {p.basePrice}€</div>
                    </div>
                  </Link>
                ))}
              </div>
            );
          })()}
        </div>
        {/* Produits populaires */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <div className="font-extrabold text-lg sm:text-xl">Produits populaires</div>
            <Link to="/search" className="text-primary-600 hover:text-primary-700 text-sm">
              Voir tous les produits
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {CATALOG.filter((p) => p.popular)
              .slice(0, 8)
              .map((p) => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}?category=moto`}
                  className="rounded-amazon border border-[var(--border-soft)] bg-white overflow-hidden hover:shadow-lg transition"
                >
                  <div className="aspect-square bg-white flex items-center justify-center">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <div className="text-secondary-600 text-sm">Image à venir</div>
                    )}
                  </div>
                  <div className="p-3">
                    <div className="font-medium text-secondary-900 text-sm">{p.name}</div>
                    <div className="text-primary-700 text-sm">{p.basePrice}€</div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 mt-6">
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {categories.map((c) => (
                <Link
                  key={c.id}
                  to={`/search?category=${c.id}`}
                  className="relative rounded-amazon overflow-hidden group ring-1 ring-amber-500/30 hover:ring-amber-500 shadow-md hover:shadow-xl transition-transform hover:-translate-y-[2px]"
                >
                  <img
                    src={homeMotoImage}
                    alt="Moto sportive jaune"
                    className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
                  <div className="relative p-4 md:p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4 md:gap-7">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 rounded-full bg-amber-500/25 text-amber-100 flex items-center justify-center ring-2 ring-amber-500/60 shadow-xl">
                        <Bike className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20" />
                      </div>
                      <div>
                        <div className="font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl text-white group-hover:text-amber-300 transition-colors">
                          {c.name}
                        </div>
                        <div className="text-xs sm:text-sm md:text-base text-amber-100/90">
                          {c.desc}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/20 text-amber-200 text-xs">
                        <Sparkles className="w-3 h-3" />
                        Nouveaux motifs
                      </span>
                      <span className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs sm:text-sm">
                        Voir le catalogue
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <StoriesShowcase />
        </div>
      </div>
    </div>
  );
}
