import React from 'react'
import { Link } from 'react-router-dom'
import type { AdBanner } from '../services/adService'

export default function SeasonBanner({ banner }: { banner?: AdBanner }) {
  if (!banner) return null
  return (
    <div className="mb-4">
      <div className="rounded-xl border border-[var(--border-soft)] p-4 lg:p-5" style={{ background: 'linear-gradient(180deg, rgba(201,162,77,.15), rgba(201,162,77,.05))' }}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="font-extrabold text-xl">{banner.title}</div>
            {banner.subtitle && (
              <div className="text-secondary-700 text-sm">{banner.subtitle}</div>
            )}
          </div>
          {banner.ctaHref && banner.ctaLabel && (
            <Link to={banner.ctaHref} className="btn-primary">{banner.ctaLabel}</Link>
          )}
        </div>
      </div>
    </div>
  )
}

