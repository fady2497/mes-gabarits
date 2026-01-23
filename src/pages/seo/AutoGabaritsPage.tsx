import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CATALOG } from '../../data/catalog';
import { setMeta, setCanonical, setJsonLd } from '../../utils/seo';
import { Car, CheckCircle, ArrowRight } from 'lucide-react';

export default function AutoGabaritsPage() {
  useEffect(() => {
    const url = 'https://gabarits.fr/gabarits-sellerie-auto';
    document.title = 'Gabarits sellerie auto | Gabarits professionnels – Gabarits.fr';
    setCanonical(url);
    const desc = 'Gabarits de sellerie auto pour artisans et selliers. Précision, répétabilité et gain de temps pour sièges et intérieurs.';
    setMeta('name', 'description', desc);
    setMeta('property', 'og:title', 'Gabarits sellerie auto | Gabarits.fr');
    setMeta('property', 'og:description', desc);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:type', 'website');
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', 'Gabarits sellerie auto | Gabarits.fr');
    setMeta('name', 'twitter:description', desc);
    setJsonLd({ '@context': 'https://schema.org', '@type': 'WebPage', headline: 'Gabarits de sellerie auto professionnels', url });
  }, []);

  const sample = CATALOG.filter((p) => p.popular).slice(0, 8);

  return (
    <div className="min-h-screen bg-amazon-gray">
      <div className="container-amazon py-8">
        <nav className="flex items-center space-x-2 text-sm text-secondary-600 mb-6">
          <Link to="/" className="hover:text-primary-600 transition-colors">Accueil</Link>
          <span>/</span>
          <span className="text-secondary-900 font-medium">Sellerie Auto</span>
        </nav>

        <header className="mb-12 text-center md:text-left bg-white p-8 rounded-amazon-lg border border-gray-100 shadow-sm">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="bg-amber-100 p-4 rounded-full text-amber-600">
              <Car className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-secondary-900 mb-3">Gabarits de sellerie auto professionnels</h1>
              <p className="text-secondary-700 text-lg max-w-3xl">
                Gabarits pour sièges auto, panneaux et finitions intérieures. Traçage rapide, motifs réguliers et finition premium pour un rendu homogène.
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white p-8 rounded-amazon-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-secondary-900 mb-4">Pourquoi utiliser des gabarits en sellerie auto ?</h2>
              <ul className="space-y-2">
                {[
                  'Réduction du temps de préparation',
                  'Répétabilité parfaite des motifs',
                  'Homogénéité des finitions sur l’ensemble de l’habitacle',
                  'Diminution du gaspillage de matériaux'
                ].map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-secondary-700">
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
          <div className="space-y-6">
            <div className="bg-secondary-900 text-white p-6 rounded-amazon-lg">
              <h2 className="text-xl font-bold mb-4">Applications</h2>
              <ul className="space-y-3">
                <li className="flex items-center gap-2"><CheckCircle className="text-green-400" /> Sièges et dossiers</li>
                <li className="flex items-center gap-2"><CheckCircle className="text-green-400" /> Panneaux de porte</li>
                <li className="flex items-center gap-2"><CheckCircle className="text-green-400" /> Consoles et accoudoirs</li>
              </ul>
            </div>
          </div>
        </div>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-secondary-900">Exemples de gabarits adaptés</h2>
            <Link to="/search" className="btn-primary">Voir le catalogue</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sample.map((p) => (
              <Link key={p.id} to={`/product/${p.id}?category=moto`} className="card-amazon group overflow-hidden hover:shadow-md transition-all">
                <div className="aspect-square overflow-hidden bg-white p-4 flex items-center justify-center">
                  {p.image ? (
                    <img src={p.image} alt={`Gabarit sellerie auto ${p.name}`} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="text-secondary-400">Image à venir</div>
                  )}
                </div>
                <div className="p-4 border-t border-gray-100">
                  <div className="text-xs font-bold text-amber-600 mb-1 uppercase tracking-wide">Auto</div>
                  <h3 className="font-semibold text-secondary-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">{p.name}</h3>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-lg font-bold text-secondary-900">{p.basePrice}€</span>
                    <span className="text-xs text-secondary-500 bg-secondary-100 px-2 py-1 rounded-full">Pro & Amateur</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
