import React, { useEffect, useMemo, useState } from 'react';

export default function StockAdmin({ onClose }) {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stock, setStock] = useState({});
  const [filter, setFilter] = useState('');
  const [updates, setUpdates] = useState({});
  const [sort, setSort] = useState('id_asc');
  const [view, setView] = useState('edit');
  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [manifest, setManifest] = useState({});
  const [source, setSource] = useState('');
  const [statusSummary, setStatusSummary] = useState({ ok: 0, warn: 0, low: 0 });

  useEffect(() => {
    setLoading(true);
    fetch('/api/stock')
      .then((r) => r.json())
      .then((json) => {
        setStock(json?.data || {});
        setSource(json?.source || '');
      })
      .catch(() => setError('Impossible de charger le stock'))
      .finally(() => setLoading(false));
    fetch('/images-manifest.json')
      .then((r) => r.json())
      .then((m) => setManifest(m || {}))
      .catch(() => setManifest({}));
    fetch('/api/stats/stock')
      .then((r) => r.json())
      .then((json) => {
        const rows = Array.isArray(json?.data) ? json.data : [];
        const summary = rows.reduce(
          (acc, row) => {
            if (row.status === 'OK') acc.ok += 1;
            else if (row.status === 'Warning') acc.warn += 1;
            else if (row.status === 'Low') acc.low += 1;
            return acc;
          },
          { ok: 0, warn: 0, low: 0 }
        );
        setStatusSummary(summary);
      })
      .catch(() => setStatusSummary({ ok: 0, warn: 0, low: 0 }));
  }, []);

  const items = useMemo(() => {
    const idsFromManifest = Object.keys(manifest || {});
    const idsFromStock = Object.keys(stock || {});
    const allIdsSet = new Set([...idsFromManifest, ...idsFromStock]);
    const entries = Array.from(allIdsSet).map((id) => ({
      id,
      current: stock[id]?.current ?? 0,
      target: stock[id]?.target ?? 0
    }));
    const f = filter.trim().toLowerCase();
    const filtered = f ? entries.filter((e) => e.id.toLowerCase().includes(f)) : entries;
    const getKey = (id) => {
      const [series, num] = String(id).split('-');
      return { series, num: parseInt(num || '0', 10) };
    };
    const sorted = [...filtered].sort((a, b) => {
      const ka = getKey(a.id);
      const kb = getKey(b.id);
      if (sort === 'series_asc') return ka.series.localeCompare(kb.series) || ka.num - kb.num;
      if (sort === 'series_desc') return kb.series.localeCompare(ka.series) || kb.num - ka.num;
      if (sort === 'id_desc') return kb.num - ka.num || kb.series.localeCompare(ka.series);
      return ka.num - kb.num || ka.series.localeCompare(kb.series);
    });
    return sorted;
  }, [stock, filter, sort, manifest]);

  const pagedItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  useEffect(() => {
    if (view !== 'history') return;
    setLoading(true);
    fetch('/api/stock/history?limit=500')
      .then((r) => r.json())
      .then((json) => setHistory(json?.data || []))
      .catch(() => setError("Impossible de charger l'historique"))
      .finally(() => setLoading(false));
  }, [view]);

  const setField = (id, field, value) => {
    setUpdates((u) => ({
      ...u,
      [id]: {
        current:
          field === 'current'
            ? Math.max(0, Number(value))
            : Math.max(0, Number(u[id]?.current ?? stock[id]?.current ?? 0)),
        target:
          field === 'target'
            ? Math.max(0, Number(value))
            : Math.max(0, Number(u[id]?.target ?? stock[id]?.target ?? 0))
      }
    }));
  };

  const hasInvalid = useMemo(() => {
    return Object.values(updates).some((v) => Number.isNaN(v.current) || Number.isNaN(v.target));
  }, [updates]);

  const save = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
        body: JSON.stringify({ updates })
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.message || 'Erreur serveur');
      setStock(json.data || {});
      setUpdates({});
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const exportCsv = () => {
    const rows = Object.entries(stock).map(
      ([id, v]) => `${id},${v?.current ?? 0},${v?.target ?? 0}`
    );
    const header = 'id,current,target';
    const blob = new Blob([header + '\n' + rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stock.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportHistoryCsv = () => {
    const header = 'ts,id,before_current,before_target,after_current,after_target';
    const rows = history.map(
      (h) =>
        `${h.ts},${h.id},${h.before?.current ?? ''},${h.before?.target ?? ''},${h.after?.current ?? ''},${h.after?.target ?? ''}`
    );
    const blob = new Blob([header + '\n' + rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stock-history.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold">Administration du stock</h3>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setView('edit')}
                className={`px-3 py-1.5 rounded-md text-sm ${view === 'edit' ? 'bg-gray-200' : 'bg-gray-100'}`}
              >
                Éditer
              </button>
              <button
                onClick={() => setView('history')}
                className={`px-3 py-1.5 rounded-md text-sm ${view === 'history' ? 'bg-gray-200' : 'bg-gray-100'}`}
              >
                Historique
              </button>
            </div>
            <span className="text-xs text-gray-500">Source: {source || 'inconnue'}</span>
            <span className="text-xs text-gray-500">
              OK {statusSummary.ok} • Warning {statusSummary.warn} • Low {statusSummary.low}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {view === 'edit' && (
              <>
                <button onClick={exportCsv} className="px-3 py-1.5 rounded-md bg-gray-100">
                  Exporter CSV
                </button>
                <button
                  onClick={save}
                  disabled={loading || !token || hasInvalid || Object.keys(updates).length === 0}
                  className="px-3 py-1.5 rounded-md bg-amber-600 text-white disabled:opacity-50"
                >
                  Enregistrer
                </button>
              </>
            )}
            {view === 'history' && (
              <button onClick={exportHistoryCsv} className="px-3 py-1.5 rounded-md bg-gray-100">
                Exporter historique
              </button>
            )}
            <button onClick={onClose} className="px-3 py-1.5 rounded-md bg-gray-100">
              Fermer
            </button>
          </div>
        </div>
        {(error || hasInvalid) && view === 'edit' && (
          <div className="px-4 py-2 text-red-600 text-sm">{error || 'Valeurs invalides'}</div>
        )}
        <div className="p-4 overflow-auto" style={{ maxHeight: '60vh' }}>
          {view === 'edit' && (
            <>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="password"
                  placeholder="Token admin"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="px-3 py-1.5 rounded-md border text-sm"
                />
                <input
                  type="text"
                  placeholder="Filtrer (ex: B-)"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-md border text-sm"
                />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="px-3 py-1.5 rounded-md border text-sm"
                >
                  <option value="id_asc">ID ↑</option>
                  <option value="id_desc">ID ↓</option>
                  <option value="series_asc">Série ↑</option>
                  <option value="series_desc">Série ↓</option>
                </select>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(parseInt(e.target.value, 10))}
                  className="px-3 py-1.5 rounded-md border text-sm"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2">Produit</th>
                    <th className="py-2">Actuel</th>
                    <th className="py-2">Cible</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedItems.map((row) => (
                    <tr key={row.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 font-mono">{row.id}</td>
                      <td className="py-2">
                        <input
                          type="number"
                          defaultValue={row.current ?? 0}
                          onChange={(e) => setField(row.id, 'current', e.target.value)}
                          className="w-24 px-2 py-1 rounded border"
                        />
                      </td>
                      <td className="py-2">
                        <input
                          type="number"
                          defaultValue={row.target ?? 0}
                          onChange={(e) => setField(row.id, 'target', e.target.value)}
                          className="w-24 px-2 py-1 rounded border"
                        />
                      </td>
                    </tr>
                  ))}
                  {pagedItems.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-6 text-center text-gray-500">
                        Aucun élément
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="flex items-center justify-end gap-2 mt-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  className="px-3 py-1.5 rounded-md bg-gray-100"
                >
                  Précédent
                </button>
                <span className="text-sm">
                  Page {page} / {Math.max(1, Math.ceil(items.length / pageSize))}
                </span>
                <button
                  onClick={() =>
                    setPage(Math.min(Math.ceil(items.length / pageSize) || 1, page + 1))
                  }
                  className="px-3 py-1.5 rounded-md bg-gray-100"
                >
                  Suivant
                </button>
              </div>
            </>
          )}
          {view === 'history' && (
            <>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2">Date</th>
                    <th className="py-2">Produit</th>
                    <th className="py-2">Avant</th>
                    <th className="py-2">Après</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="py-2">{new Date(h.ts).toLocaleString('fr-FR')}</td>
                      <td className="py-2 font-mono">{h.id}</td>
                      <td className="py-2">
                        {(h.before?.current ?? '-') + '/' + (h.before?.target ?? '-')}
                      </td>
                      <td className="py-2">
                        {(h.after?.current ?? '-') + '/' + (h.after?.target ?? '-')}
                      </td>
                    </tr>
                  ))}
                  {history.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-gray-500">
                        Aucun historique
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
