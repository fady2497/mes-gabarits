import { Link } from 'react-router-dom';
import HeroCarousel from '../components/HeroCarousel';
import AdSlot from '../components/AdSlot';
import SeasonBanner from '../components/SeasonBanner';
import StoriesShowcase from '../components/StoriesShowcase';
import { useEffect, useMemo, useState } from 'react';
import { fetchAds, type AdsResponse } from '../services/adService';
import { Bike, ArrowRight, Sparkles } from 'lucide-react';
import { homeMotoImage, homeMotoLink } from '../config';

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
