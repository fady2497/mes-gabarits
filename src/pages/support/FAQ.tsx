import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

export default function FAQPage() {
  const items = [
    {
      q: 'Comment choisir la taille ?',
      a: 'Renseignez la largeur et la hauteur (mm) sur la fiche produit pour obtenir le prix calculé par taille.'
    },
    {
      q: 'Puis-je commander des gabarits spéciaux ?',
      a: 'Oui — les séries F à M sont sur commande et expédiées sous 7–10 jours ouvrés.'
    },
    { q: 'Quels formats sont disponibles ?', a: 'PDF, SVG, PNG, DXF — selon le gabarit choisi.' }
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="container-amazon py-10">
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 mb-6 flex items-center gap-3">
        <HelpCircle className="w-6 h-6" />
        <div className="text-2xl font-bold">FAQ</div>
      </div>
      <div className="space-y-3">
        {items.map((it, i) => (
          <button
            key={i}
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full text-left card-amazon p-4"
          >
            <div className="flex items-center justify-between">
              <div className="font-semibold text-secondary-900">{it.q}</div>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${open === i ? 'rotate-180' : ''}`}
              />
            </div>
            {open === i && <p className="mt-2 text-secondary-700">{it.a}</p>}
          </button>
        ))}
      </div>
    </div>
  );
}
