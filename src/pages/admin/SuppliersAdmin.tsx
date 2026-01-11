import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function SuppliersAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ id: '', name: '', api_base: '', api_key: '' });
  const load = async () => {
    setLoading(true);
    const { data } = await (supabase as any)
      .from('suppliers')
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
    await (supabase as any).from('suppliers').upsert(form);
    setForm({ id: '', name: '', api_base: '', api_key: '' });
    await load();
  };
  const remove = async (id: string) => {
    await (supabase as any).from('suppliers').delete().eq('id', id);
    await load();
  };
  return (
    <div className="container-amazon py-8">
      <div className="text-secondary-900 font-bold text-xl mb-4">Fournisseurs</div>
      <div className="card-amazon p-4 mb-6 flex flex-wrap items-center gap-3">
        <input
          value={form.id}
          onChange={(e) => setForm({ ...form, id: e.target.value })}
          placeholder="ID (amazon, aliexpress...)"
          className="input-amazon w-40"
        />
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Nom"
          className="input-amazon w-40"
        />
        <input
          value={form.api_base}
          onChange={(e) => setForm({ ...form, api_base: e.target.value })}
          placeholder="API Base"
          className="input-amazon w-64"
        />
        <input
          value={form.api_key}
          onChange={(e) => setForm({ ...form, api_key: e.target.value })}
          placeholder="API Key"
          className="input-amazon w-64"
        />
        <button className="btn-primary" onClick={save}>
          Enregistrer
        </button>
      </div>
      {loading && <div className="card-amazon p-4">Chargement...</div>}
      <div className="space-y-3">
        {items.map((s) => (
          <div key={s.id} className="card-amazon p-4 flex items-center justify-between">
            <div>
              <div className="font-semibold text-secondary-900">
                {s.name} ({s.id})
              </div>
              <div className="text-secondary-700 text-sm">API: {s.api_base}</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="btn-secondary"
                onClick={() =>
                  setForm({
                    id: s.id,
                    name: s.name,
                    api_base: s.api_base || '',
                    api_key: s.api_key || ''
                  })
                }
              >
                Modifier
              </button>
              <button className="btn-primary" onClick={() => remove(s.id)}>
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
