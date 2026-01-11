import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function ProductsAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    id: '',
    name: '',
    price: 0,
    stock: 0,
    supplier_id: '',
    image_url: '',
    description: ''
  });
  const [csvText, setCsvText] = useState('');
  const load = async () => {
    setLoading(true);
    const { data } = await (supabase as any)
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    setItems(data || []);
    setLoading(false);
  };
  useEffect(() => {
    load();
  }, []);
  const save = async () => {
    if (!form.id || !form.name) return;
    await (supabase as any).from('products').upsert(form);
    setForm({
      id: '',
      name: '',
      price: 0,
      stock: 0,
      supplier_id: '',
      image_url: '',
      description: ''
    });
    await load();
  };
  const remove = async (id: string) => {
    await (supabase as any).from('products').delete().eq('id', id);
    await load();
  };
  const importCsv = async () => {
    const rows = csvText
      .trim()
      .split('\n')
      .map((l) => l.split(','));
    const headers = rows.shift() || [];
    const idx = (name: string) => headers.indexOf(name);
    const payload = rows
      .map((r) => ({
        id: r[idx('id')] || `p-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: r[idx('name')] || '',
        price: Number(r[idx('price')] || 0),
        stock: Number(r[idx('stock')] || 0),
        supplier_id: r[idx('supplier_id')] || null,
        image_url: r[idx('image_url')] || '',
        description: r[idx('description')] || ''
      }))
      .filter((p) => p.name);
    if (payload.length > 0) {
      await (supabase as any).from('products').upsert(payload);
      setCsvText('');
      await load();
    }
  };
  return (
    <div className="container-amazon py-8">
      <div className="text-secondary-900 font-bold text-xl mb-4">Produits</div>
      <div className="card-amazon p-4 mb-6 flex flex-wrap items-center gap-3">
        <input
          value={form.id}
          onChange={(e) => setForm({ ...form, id: e.target.value })}
          placeholder="ID"
          className="input-amazon w-40"
        />
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Nom"
          className="input-amazon w-40"
        />
        <input
          value={form.price}
          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
          placeholder="Prix"
          className="input-amazon w-28"
        />
        <input
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
          placeholder="Stock"
          className="input-amazon w-24"
        />
        <input
          value={form.supplier_id}
          onChange={(e) => setForm({ ...form, supplier_id: e.target.value })}
          placeholder="Fournisseur ID"
          className="input-amazon w-40"
        />
        <input
          value={form.image_url}
          onChange={(e) => setForm({ ...form, image_url: e.target.value })}
          placeholder="Image URL"
          className="input-amazon w-64"
        />
        <input
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Description"
          className="input-amazon w-64"
        />
        <button className="btn-primary" onClick={save}>
          Enregistrer
        </button>
      </div>
      <div className="card-amazon p-4 mb-6">
        <div className="mb-2 text-secondary-800">Importer depuis un fichier CSV</div>
        <input
          type="file"
          accept=".csv"
          onChange={async (e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            const text = await f.text();
            setCsvText(text);
          }}
        />
        <div className="mt-2">
          <button className="btn-secondary" onClick={importCsv}>
            Importer
          </button>
        </div>
      </div>
      <div className="card-amazon p-4 mb-6">
        <div className="mb-2 text-secondary-800">
          Import CSV (headers: id,name,price,stock,supplier_id,image_url,description)
        </div>
        <textarea
          value={csvText}
          onChange={(e) => setCsvText(e.target.value)}
          className="input-amazon w-full h-32"
          placeholder="id,name,price,stock,supplier_id,image_url,description"
        />
        <div className="mt-2">
          <button className="btn-secondary" onClick={importCsv}>
            Importer
          </button>
        </div>
      </div>
      {loading && <div className="card-amazon p-4">Chargement...</div>}
      <div className="space-y-3">
        {items.map((p) => (
          <div key={p.id} className="card-amazon p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-secondary-100 rounded-amazon overflow-hidden">
                {p.image_url && (
                  <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div>
                <div className="font-semibold text-secondary-900">
                  {p.name} — {p.price}€
                </div>
                <div className="text-secondary-700 text-sm">
                  Stock: {p.stock} • Fournisseur: {p.supplier_id || '-'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="btn-secondary"
                onClick={() =>
                  setForm({
                    id: p.id,
                    name: p.name,
                    price: p.price || 0,
                    stock: p.stock || 0,
                    supplier_id: p.supplier_id || '',
                    image_url: p.image_url || '',
                    description: p.description || ''
                  })
                }
              >
                Modifier
              </button>
              <button className="btn-primary" onClick={() => remove(p.id)}>
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
