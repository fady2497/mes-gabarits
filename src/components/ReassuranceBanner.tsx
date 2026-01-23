import React from 'react';
import { Truck, ShieldCheck, Lock, Award } from 'lucide-react';

export default function ReassuranceBanner() {
  const items = [
    {
      icon: <Truck className="w-8 h-8 text-amber-500" />,
      title: "Livraison Suivie",
      text: "Expédition soignée en 5-7 jours"
    },
    {
      icon: <Award className="w-8 h-8 text-amber-500" />,
      title: "Savoir-faire Artisan",
      text: "Conçu et fabriqué en France"
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-amber-500" />,
      title: "Qualité Premium",
      text: "Matériaux durables et précis"
    },
    {
      icon: <Lock className="w-8 h-8 text-amber-500" />,
      title: "Paiement Sécurisé",
      text: "Cartes bancaires & PayPal"
    }
  ];

  return (
    <div className="bg-white border-y border-gray-100 py-8">
      <div className="container-amazon">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="shrink-0 p-3 bg-amber-50 rounded-full">
                {item.icon}
              </div>
              <div>
                <div className="font-bold text-secondary-900">{item.title}</div>
                <div className="text-sm text-secondary-600">{item.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
