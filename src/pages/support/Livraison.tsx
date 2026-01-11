import React from 'react';
import { Truck, Package, Clock } from 'lucide-react';

export default function LivraisonPage() {
  return (
    <div className="container-amazon py-10">
      <div className="rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 text-white p-6 mb-6 flex items-center gap-3">
        <Truck className="w-6 h-6" />
        <div className="text-2xl font-bold">Livraison</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-amazon p-6">
          <div className="flex items-center gap-2 text-secondary-900 mb-2">
            <Truck /> Livraison offerte
          </div>
          <p className="text-secondary-700">
            Offerte en France métropolitaine pour toutes vos commandes.
          </p>
        </div>
        <div className="card-amazon p-6">
          <div className="flex items-center gap-2 text-secondary-900 mb-2">
            <Package /> Emballage soigné
          </div>
          <p className="text-secondary-700">Gabarits protégés et expédiés avec suivi.</p>
        </div>
        <div className="card-amazon p-6">
          <div className="flex items-center gap-2 text-secondary-900 mb-2">
            <Clock /> Délais
          </div>
          <p className="text-secondary-700">
            2–3 jours ouvrés (standard) • 7–10 jours (sur commande).
          </p>
        </div>
      </div>
    </div>
  );
}
