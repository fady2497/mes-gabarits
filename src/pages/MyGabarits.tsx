import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

type Row = { id: string; nom: string; categorie: string; data_svg: string; created_at: string };

export default function MyGabarits() {
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const userId = localStorage.getItem('editor_user_id') || null;
        const { data, error } = await (supabase as any)
          .from('gabarits')
          .select('id, nom, categorie, data_svg, created_at')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        if (!error && data) setItems(data);
      } catch (e) {
        console.error('Erreur chargement gabarits:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="container-amazon py-8">
      <h1 className="text-2xl font-bold text-secondary-900 mb-4">Mes gabarits</h1>
      {loading && <div className="card-amazon p-4">Chargement...</div>}
      {!loading && items.length === 0 && (
        <div className="card-amazon p-4">Aucun gabarit pour l'instant</div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((it) => (
          <div key={it.id} className="card-amazon overflow-hidden">
            <div className="aspect-video bg-white">
              <div dangerouslySetInnerHTML={{ __html: it.data_svg }} />
            </div>
            <div className="p-4">
              <div className="font-semibold text-secondary-900">{it.nom}</div>
              <div className="text-sm text-secondary-600">
                {new Date(it.created_at).toLocaleString()} • {it.categorie}
              </div>
              <div className="mt-2">
                <a
                  href={`/search?category=${it.categorie || 'moto'}&id=${it.id}`}
                  className="text-blue-700 hover:text-blue-800"
                >
                  Voir dans Catalogue
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
