import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CATALOG, SERIES_BY_CATEGORY, getCategoryForSeries } from '../data/catalog';
import TarifsBanner from '../components/TarifsBanner';

// classification importée depuis le module de catalogue

const CATEGORIES = [{ id: 'moto', label: 'Catalogue' }];
const LEGACY_CATEGORIES = [
  { id: 'moto', label: 'Moto' },
  { id: 'auto', label: 'Voiture' },
  { id: 'maison', label: 'Maison / Mur' },
  { id: 'bateau', label: 'Bateau' }
];
const SERIES_CHIPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];
const MOTIF_TAGS = ['cotes', 'chevron', 'curve', 'spider', 'line', 'losange', 'ovale', 'pano'];
const SORT_LABELS: Record<string, string> = {
  series_asc: 'Série A→M',
  price_asc: 'Prix ↑',
  price_desc: 'Prix ↓',
  rating_desc: 'Note ↓',
  rating_asc: 'Note ↑',
  popularity: 'Popularité',
  date_desc: 'Date ↓',
  date_asc: 'Date ↑'
};

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [sp, setSp] = useSearchParams();
  const currentCat = sp.get('category') || 'moto';
  // SEO Dynamique simple
  React.useEffect(() => {
    document.title = `Catalogue ${currentCat === 'moto' ? 'Moto' : currentCat === 'auto' ? 'Auto' : ''} | Gabarits.fr`;
  }, [currentCat]);

  const legacy = sp.get('legacy') === '1';
  const [selectedSeries, setSelectedSeries] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [popularOnly, setPopularOnly] = useState(false);
  const [sort, setSort] = useState<
    | 'price_asc'
    | 'price_desc'
    | 'series_asc'
    | 'rating_desc'
    | 'rating_asc'
    | 'popularity'
    | 'date_desc'
    | 'date_asc'
  >('series_asc');
  const maxPrice = useMemo(() => Math.max(...CATALOG.map((p) => p.basePrice)), []);
  const [priceMax, setPriceMax] = useState<number>(maxPrice);
  const [minCote, setMinCote] = useState<number>(0);
  const [maxCote, setMaxCote] = useState<number>(0);

  const getTags = (p: { name: string; description: string }) => {
    const text = (p.name + ' ' + p.description).toLowerCase();
    return MOTIF_TAGS.filter((t) => text.includes(t));
  };

  const filtered = useMemo(() => {
    const seriesPool = SERIES_BY_CATEGORY[currentCat] || SERIES_BY_CATEGORY['moto'] || [];
    let list = CATALOG.filter((p) => seriesPool.includes(p.series));
    if (selectedSeries.length > 0) list = list.filter((p) => selectedSeries.includes(p.series));
    if (selectedTags.length > 0)
      list = list.filter((p) => {
        const ptags = getTags({ name: p.name, description: p.description });
        return selectedTags.every((t) => ptags.includes(t));
      });
    list = list
      .filter((p) => (p.name + ' ' + p.description).toLowerCase().includes(query.toLowerCase()))
      .filter((p) => p.basePrice <= priceMax)
      .filter((p) => (popularOnly ? p.popular : true));
    if (minCote > 0) {
      list = list.filter((p) => {
        const text = (p.photoNotes || p.description || '').toLowerCase();
        const m = text.match(/(\d{2,3})\s*mm/);
        const val = m ? parseInt(m[1]) : undefined;
        if (val === undefined) return false;
        return val >= minCote;
      });
    }
    if (maxCote > 0) {
      list = list.filter((p) => {
        const text = (p.photoNotes || p.description || '').toLowerCase();
        const m = text.match(/(\d{2,3})\s*mm/);
        const val = m ? parseInt(m[1]) : undefined;
        if (val === undefined) return true;
        return val <= maxCote;
      });
    }
    list = list.sort((a, b) => {
      if (sort === 'price_asc') return a.basePrice - b.basePrice;
      if (sort === 'price_desc') return b.basePrice - a.basePrice;
      if (sort === 'rating_desc') return Number(b.rating) - Number(a.rating);
      if (sort === 'rating_asc') return Number(a.rating) - Number(b.rating);
      if (sort === 'popularity') {
        if (a.popular !== b.popular) return a.popular ? -1 : 1;
        return Number(b.rating) - Number(a.rating);
      }
      if (sort === 'date_desc')
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sort === 'date_asc')
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      // series_asc: order by series letter then model number
      if (a.series === b.series) return Number(a.model) - Number(b.model);
      return a.series.localeCompare(b.series);
    });
    return list.slice(0, 24);
  }, [
    query,
    currentCat,
    selectedSeries,
    selectedTags,
    priceMax,
    popularOnly,
    sort,
    minCote,
    maxCote
  ]);

  return (
    <div className="container-amazon py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <div className="flex gap-2 flex-wrap">
          {(legacy ? LEGACY_CATEGORIES : CATEGORIES).map((c) => (
            <button
              key={c.id}
              onClick={() => setSp({ category: c.id, legacy: legacy ? '1' : undefined })}
              className={`px-3 py-2 rounded-amazon text-sm font-medium ${
                currentCat === c.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2 w-full md:w-auto">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher des gabarits"
            className="input-amazon w-full"
          />
          <button
            className="btn-secondary"
            onClick={() => setSp({ category: currentCat, legacy: legacy ? undefined : '1' })}
            title={legacy ? 'Mode moderne' : 'Mode classique'}
          >
            {legacy ? 'Mode moderne' : 'Mode classique'}
          </button>
        </div>
      </div>

      {/* Résumé des filtres */}
      <div className="filters-bar text-sm mb-4">
        <span className="text-secondary-700">Tri:</span>
        <span className="px-2 py-1 rounded-amazon bg-secondary-100 text-secondary-800">
          {SORT_LABELS[sort]}
        </span>
        {popularOnly && (
          <span className="px-2 py-1 rounded-amazon bg-secondary-100 text-secondary-800">
            Populaires
          </span>
        )}
        {(minCote > 0 || maxCote > 0) && (
          <span className="px-2 py-1 rounded-amazon bg-secondary-100 text-secondary-800">
            Taille {minCote > 0 ? `≥ ${minCote}mm` : ''}
            {maxCote > 0 ? `${minCote > 0 ? ' • ' : ''}≤ ${maxCote}mm` : ''}
          </span>
        )}
        {selectedSeries.length > 0 && (
          <span className="px-2 py-1 rounded-amazon bg-secondary-100 text-secondary-800">
            Séries: {selectedSeries.join(', ')}
          </span>
        )}
        {selectedTags.length > 0 && (
          <span className="px-2 py-1 rounded-amazon bg-secondary-100 text-secondary-800">
            Motifs: {selectedTags.join(', ')}
          </span>
        )}
      </div>

      {/* Filtres séries */}
      <div className="filters-bar mb-4">
        <div className="flex flex-wrap items-center gap-2">
          {SERIES_CHIPS.map((s) => {
            const active = selectedSeries.includes(s);
            return (
              <button
                key={s}
                onClick={() =>
                  setSelectedSeries((prev) => (active ? prev.filter((x) => x !== s) : [...prev, s]))
                }
                className={`chip ${active ? 'chip-active' : ''}`}
              >
                Série {s}
              </button>
            );
          })}
        </div>
        <div className="mt-3 sm:mt-0 ml-0 sm:ml-auto flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 w-full">
            <span className="text-sm text-black shrink-0">Prix max</span>
            <input
              type="range"
              min={0}
              max={maxPrice}
              value={priceMax}
              onChange={(e) => setPriceMax(parseInt(e.target.value))}
              className="flex-1 min-w-0"
            />
            <span className="text-sm text-black shrink-0">{priceMax}€</span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-sm text-black shrink-0">Taille (mm) min</span>
            <input
              type="number"
              className="input-amazon w-full sm:w-24 text-black"
              value={minCote}
              onChange={(e) => setMinCote(parseInt(e.target.value || '0'))}
              placeholder="ex: 40"
              title="Filtre sur la cote (mm) quand disponible"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-sm text-black shrink-0">Taille (mm) max</span>
            <input
              type="number"
              className="input-amazon w-full sm:w-24 text-black"
              value={maxCote}
              onChange={(e) => setMaxCote(parseInt(e.target.value || '0'))}
              placeholder="ex: 70"
              title="Filtre sur la cote (mm) quand disponible"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-black w-full sm:w-auto">
            <input
              type="checkbox"
              checked={popularOnly}
              onChange={(e) => setPopularOnly(e.target.checked)}
            />
            Populaires
          </label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
            className="input-amazon w-full sm:w-56"
          >
            <option value="series_asc">Tri: Série A→M</option>
            <option value="price_asc">Prix ↑</option>
            <option value="price_desc">Prix ↓</option>
            {/* <option value="rating_desc">Note ↓</option>
            <option value="rating_asc">Note ↑</option> */}
            <option value="popularity">Popularité</option>
            <option value="date_desc">Date ↓</option>
            <option value="date_asc">Date ↑</option>
          </select>
        </div>
      </div>

      {/* Filtres motifs */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {MOTIF_TAGS.map((t) => {
          const active = selectedTags.includes(t);
          return (
            <button
              key={t}
              onClick={() =>
                setSelectedTags((prev) => (active ? prev.filter((x) => x !== t) : [...prev, t]))
              }
              className={`px-3 py-1 rounded-amazon text-sm ${
                active ? 'bg-primary-600 text-white' : 'bg-secondary-100 text-secondary-700'
              }`}
            >
              {t}
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        <TarifsBanner />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((r) => (
          <Link
            key={r.id}
            to={`/product/${r.id}?category=${currentCat}`}
            className="card-amazon overflow-hidden"
          >
            <div className="aspect-square bg-white">
              {r.image ? (
                <img src={r.image} alt={r.name} className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-secondary-600">
                  —
                </div>
              )}
            </div>
            <div className="p-4">
              {(() => {
                const cat = getCategoryForSeries(r.series);
                const label = 'Moto';
                const cls = 'badge-cat cat-moto';
                return (
                  <div className="flex items-center gap-2 mb-2">
                    <span className={cls}>{label}</span>
                    {r.specialOrder && (
                      <span className="px-2 py-1 rounded-amazon bg-amber-100 text-amber-800 text-xs font-medium">
                        Sur commande
                      </span>
                    )}
                  </div>
                );
              })()}
              <div className="font-semibold text-secondary-900 mb-1">{r.name}</div>
              <div className="text-primary-600 font-bold">À partir de {r.basePrice}€</div>
            </div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <div className="card-amazon p-6 text-secondary-700">Aucun résultat</div>
        )}
      </div>
    </div>
  );
}
