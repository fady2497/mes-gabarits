import React from 'react';
import { ShieldCheck, CheckCircle } from 'lucide-react';

export default function GarantiePage() {
  return (
    <div className="container-amazon py-10">
      <div className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 mb-6 flex items-center gap-3">
        <ShieldCheck className="w-6 h-6" />
        <div className="text-2xl font-bold">Garantie</div>
      </div>
      <div className="card-amazon p-6">
        <p className="text-secondary-700">
          Tous nos gabarits bénéficient d’une garantie 2 ans contre les défauts de fabrication.
          Contactez‑nous en cas de problème pour échange ou remboursement.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="text-emerald-600" /> Échange rapide
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="text-emerald-600" /> Support prioritaire
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="text-emerald-600" /> Qualité contrôlée
          </div>
        </div>
      </div>
    </div>
  );
}
