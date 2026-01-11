import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchAds, type AdsResponse } from '../services/adService';

export default function CampaignBar() {
  const [ads, setAds] = useState<AdsResponse>({ slots: [] });
  useEffect(() => {
    (async () => setAds(await fetchAds()))();
  }, []);
  const b = ads.banner;
  if (!b) return null;
  return (
    <div className="hidden md:block bg-[color-mix(in oklab,var(--accent-gold) 18%, transparent)] text-secondary-900">
      <div className="container-amazon py-2 flex items-center justify-between">
        <div className="font-medium">
          {b.title}
          {b.subtitle ? ' — ' + b.subtitle : ''}
        </div>
        {b.ctaHref && b.ctaLabel && (
          <Link to={b.ctaHref} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500 text-white text-sm hover:bg-orange-600 transition">
            {b.ctaLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
