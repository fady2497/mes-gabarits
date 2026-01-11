import React from 'react';
import { Coins, ShieldCheck, Truck, Award, Sparkles } from 'lucide-react';

export default function TarifsBanner() {
  return (
    <div className="rounded-2xl bg-gradient-to-b from-orange-500 to-orange-600 text-white shadow-md border border-orange-400/30">
      <div className="px-6 py-5 border-b border-white/20 flex items-center gap-3">
        <Coins className="w-6 h-6" />
        <div className="text-xl font-bold">Tarifs Dégressifs</div>
      </div>
      <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl bg-white/10 border border-white/20 p-6">
          <div className="text-4xl font-extrabold">100€</div>
          <div className="mt-2 text-sm">1 - 9 pièces</div>
          <div className="mt-1 text-xs opacity-80">Prix standard</div>
        </div>
        <div className="rounded-2xl bg-white/10 border border-white/20 p-6 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> LE PLUS POPULAIRE
          </div>
          <div className="text-4xl font-extrabold">90€</div>
          <div className="mt-2 text-sm">10+ pièces</div>
          <div className="mt-1 text-xs opacity-80">Économisez 10€/pièce</div>
        </div>
        <div className="rounded-2xl bg-white/10 border border-white/20 p-6">
          <div className="text-4xl font-extrabold">85€</div>
          <div className="mt-2 text-sm">20+ pièces</div>
          <div className="mt-1 text-xs opacity-80">Meilleur prix</div>
        </div>
      </div>
      <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5" /> Garantie 2 ans
        </div>
        <div className="flex items-center gap-2">
          <Truck className="w-5 h-5" /> Livraison offerte
        </div>
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5" /> Qualité premium
        </div>
      </div>
    </div>
  );
}
