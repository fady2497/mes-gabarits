import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = useState<boolean | null>(null);
  useEffect(() => {
    (async () => {
      const { data } = await (supabase as any).auth.getSession();
      setOk(!!data?.session);
    })();
  }, []);
  if (ok === null) return <div className="container-amazon py-12">Chargement…</div>;
  if (!ok) return <div className="container-amazon py-12">Accès restreint. Connectez-vous.</div>;
  return <>{children}</>;
}
