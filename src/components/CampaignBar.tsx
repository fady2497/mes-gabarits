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
    <div className="bg-[color-mix(in oklab,var(--accent-gold) 20%, transparent)] text-secondary-900">
      <div className="container-amazon py-2 flex items-center justify-between">
        <div className="font-semibold">
          {b.title}
          {b.subtitle ? ' — ' + b.subtitle : ''}
        </div>
        {b.ctaHref && b.ctaLabel && (
          <Link to={b.ctaHref} className="btn-primary">
            {b.ctaLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
