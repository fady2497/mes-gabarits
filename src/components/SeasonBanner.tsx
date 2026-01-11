import React from 'react'
import { Link } from 'react-router-dom'
import type { AdBanner } from '../services/adService'

export default function SeasonBanner({ banner }: { banner?: AdBanner }) {
  if (!banner) return null
  return (
    <div className="mb-4">
      <div className="rounded-2xl border border-[var(--border-soft)] p-4 sm:p-5 bg-gradient-to-br from-amber-50 to-white">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="font-extrabold text-lg sm:text-xl">{banner.title}</div>
            {banner.subtitle && (
              <div className="text-secondary-700 text-sm">{banner.subtitle}</div>
            )}
          </div>
          {banner.ctaHref && banner.ctaLabel && (
            <Link
              to={banner.ctaHref}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-orange-500 text-white text-sm hover:bg-orange-600 transition"
            >
              {banner.ctaLabel}
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
