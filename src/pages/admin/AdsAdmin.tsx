import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../lib/supabase';

type Row = {
  id: string;
  type: 'banner' | 'slot';
  title: string;
  subtitle?: string;
  href?: string;
  active: boolean;
  position: number;
};

export default function AdsAdmin() {
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Row | null>(null);
  const [form, setForm] = useState<Partial<Row>>({
    type: 'slot',
    title: '',
    subtitle: '',
    href: '',
    active: true,
    position: 0
  });
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await (supabase as any).auth.getSession();
      const email = data?.session?.user?.email ?? null;
      setSessionEmail(email);
      if (email) load();
    })();
  }, []);

  const load = async () => {
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from('ads')
      .select('id, type, title, subtitle, href, active, position')
      .order('position', { ascending: true });
    if (!error && data) setRows(data);
    setLoading(false);
  };

  const sendMagicLink = async () => {
    const { error } = await (supabase as any).auth.signInWithOtp({ email });
    setMsg(error ? 'Erreur: ' + error.message : 'Lien de connexion envoyé par email');
    setTimeout(() => setMsg(null), 3000);
  };

  const onEdit = (r: Row) => {
    setEditing(r);
    setForm({ ...r });
  };
  const resetForm = () => {
    setEditing(null);
    setForm({ type: 'slot', title: '', subtitle: '', href: '', active: true, position: 0 });
  };

  const save = async () => {
    if (!form.title || !form.type) return;
    if (editing) {
      await (supabase as any)
        .from('ads')
        .update({
          type: form.type,
          title: form.title,
          subtitle: form.subtitle,
          href: form.href,
          active: form.active,
          position: form.position
        })
        .eq('id', editing.id);
    } else {
      await (supabase as any).from('ads').insert({
        type: form.type,
        title: form.title,
        subtitle: form.subtitle,
        href: form.href,
        active: form.active ?? true,
        position: form.position ?? 0
      });
    }
    resetForm();
    await load();
  };

  const del = async (id: string) => {
    await (supabase as any).from('ads').delete().eq('id', id);
    await load();
  };

  if (!sessionEmail) {
    return (
      <div className="container-amazon py-8">
        <div className="card-amazon p-6">
          <div className="text-secondary-900 font-bold mb-3">Connexion administrateur</div>
          <div className="flex items-center gap-2">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="input-amazon w-64"
            />
            <button className="btn-primary" onClick={sendMagicLink}>
              Envoyer lien
            </button>
          </div>
          {msg && <div className="mt-3 text-secondary-700">{msg}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="container-amazon py-8">
      <div className="text-secondary-900 font-bold text-xl mb-4">Gestion des pubs</div>

      <div className="card-amazon p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-secondary-700">Type</label>
            <select
              value={form.type as any}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as any }))}
              className="input-amazon w-full"
            >
              <option value="banner">Bannière</option>
              <option value="slot">Slot</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-secondary-700">Titre</label>
            <input
              value={form.title || ''}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="input-amazon w-full"
            />
          </div>
          <div>
            <label className="text-sm text-secondary-700">Sous-titre</label>
            <input
              value={form.subtitle || ''}
              onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
              className="input-amazon w-full"
            />
          </div>
          <div>
            <label className="text-sm text-secondary-700">Lien</label>
            <input
              value={form.href || ''}
              onChange={(e) => setForm((f) => ({ ...f, href: e.target.value }))}
              className="input-amazon w-full"
            />
          </div>
          <div>
            <label className="text-sm text-secondary-700">Position</label>
            <input
              type="number"
              value={form.position ?? 0}
              onChange={(e) => setForm((f) => ({ ...f, position: parseInt(e.target.value) }))}
              className="input-amazon w-full"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.active ?? true}
              onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
            />
            <span className="text-secondary-700">Actif</span>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <button className="btn-primary" onClick={save}>
            {editing ? 'Mettre à jour' : 'Créer'}
          </button>
          {editing && (
            <button className="btn-secondary" onClick={resetForm}>
              Annuler
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading && <div className="card-amazon p-4">Chargement...</div>}
        {!loading &&
          rows.map((r) => (
            <div key={r.id} className="card-amazon p-4 flex items-center justify-between">
              <div>
                <div className="text-secondary-900 font-semibold">{r.title}</div>
                <div className="text-secondary-700 text-sm">
                  {r.type} • pos {r.position} • {r.active ? 'actif' : 'inactif'}
                </div>
                {r.subtitle && <div className="text-secondary-600 text-sm">{r.subtitle}</div>}
                {r.href && <div className="text-secondary-600 text-sm">{r.href}</div>}
              </div>
              <div className="flex items-center gap-2">
                <button className="btn-secondary" onClick={() => onEdit(r)}>
                  Modifier
                </button>
                <button className="btn-secondary" onClick={() => del(r.id)}>
                  Supprimer
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
