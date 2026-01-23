import React, { useEffect } from 'react';
import { setMeta, setCanonical, setJsonLd } from '../../utils/seo';
import { Link } from 'react-router-dom';
import { CATALOG, SERIES_BY_CATEGORY } from '../../data/catalog';
import { Bike, CheckCircle, ArrowRight } from 'lucide-react';

export default function MotoGabaritsPage() {
  useEffect(() => {
    const url = 'https://gabarits.fr/gabarits-sellerie-moto';
    document.title = 'Gabarits sellerie moto | Gabarits professionnels – Gabarits.fr';
    setCanonical(url);
    const desc = 'Gabarits de sellerie moto conçus pour les artisans et selliers professionnels. Précision, gain de temps et finition haut de gamme pour selles moto.';
    setMeta('name', 'description', desc);
    setMeta('property', 'og:title', 'Gabarits sellerie moto | Gabarits.fr');
    setMeta('property', 'og:description', desc);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:type', 'website');
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', 'Gabarits sellerie moto | Gabarits.fr');
    setMeta('name', 'twitter:description', desc);
    setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      headline: 'Gabarits de sellerie moto professionnels',
      url
    });
  }, []);

  const motoProducts = CATALOG.filter((p) => SERIES_BY_CATEGORY.moto.includes(p.series)).slice(0, 8);

  return (
    <div className="min-h-screen bg-amazon-gray">
      <div className="container-amazon py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-secondary-600 mb-6">
          <Link to="/" className="hover:text-primary-600 transition-colors">Accueil</Link>
          <span>/</span>
          <span className="text-secondary-900 font-medium">Sellerie Moto</span>
        </nav>

        {/* Header SEO */}
        <header className="mb-12 text-center md:text-left bg-white p-8 rounded-amazon-lg border border-gray-100 shadow-sm">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="bg-amber-100 p-4 rounded-full text-amber-600">
              <Bike className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-secondary-900 mb-3">
                Gabarits de sellerie moto professionnels
              </h1>
              <p className="text-secondary-700 text-lg max-w-3xl">
                Les gabarits de sellerie moto sont des outils essentiels pour les selliers et artisans cuir souhaitant obtenir des découpes et des surpiqûres régulières.<br/><br/>
                Chez <strong>Gabarits.fr</strong>, nous concevons des gabarits professionnels permettant un travail précis, reproductible et adapté aux exigences de la sellerie moto.
              </p>
            </div>
          </div>
        </header>

        {/* Contenu Riche SEO */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white p-8 rounded-amazon-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-secondary-900 mb-4">Pourquoi utiliser des gabarits en sellerie moto ?</h2>
              <p className="text-secondary-700 mb-4">
                En sellerie moto, la régularité et la précision sont indispensables pour garantir un rendu professionnel. L’utilisation de gabarits de sellerie moto permet :
              </p>
              <ul className="space-y-2">
                {[
                  "un gain de temps important lors du traçage",
                  "une répétabilité parfaite des motifs",
                  "une finition nette et homogène",
                  "une réduction des erreurs et du gaspillage de cuir"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-secondary-700">
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-white p-8 rounded-amazon-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-secondary-900 mb-4">Des gabarits conçus pour les selliers professionnels</h2>
              <p className="text-secondary-700 mb-4">
                Nos gabarits sont développés pour répondre aux besoins des ateliers de sellerie moto, qu’il s’agisse de selles standards ou de projets sur mesure.
              </p>
              <p className="text-secondary-700">
                Chaque gabarit est pensé pour un usage intensif, avec une précision constante et une prise en main simple, adaptée aux méthodes de travail des professionnels.
              </p>
            </section>

            <section className="bg-white p-8 rounded-amazon-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-secondary-900 mb-4">Applications en sellerie moto</h2>
              <p className="text-secondary-700 mb-4">
                Les gabarits de sellerie moto proposés sur Gabarits.fr peuvent être utilisés pour :
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "la création de selles moto personnalisées",
                  "la rénovation de selles existantes",
                  "la réalisation de motifs décoratifs réguliers",
                  "les travaux de sellerie cuir haut de gamme"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-secondary-700 bg-secondary-50 p-2 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="space-y-6">
            <div className="bg-secondary-900 text-white p-6 rounded-amazon-lg">
              <h2 className="text-xl font-bold mb-4">À qui s’adressent nos gabarits ?</h2>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2"><CheckCircle className="text-green-400" /> Selliers moto professionnels</li>
                <li className="flex items-center gap-2"><CheckCircle className="text-green-400" /> Artisans cuir</li>
                <li className="flex items-center gap-2"><CheckCircle className="text-green-400" /> Ateliers de sellerie moto</li>
              </ul>
              <div className="pt-6 border-t border-white/20">
                <h3 className="font-bold mb-2">Pourquoi choisir Gabarits.fr ?</h3>
                <p className="text-sm text-slate-300">
                  Nos produits sont pensés par un professionnel du métier, pour répondre aux contraintes réelles des ateliers et garantir un résultat propre, précis et reproductible.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Liste Produits Moto */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-secondary-900">Nos gabarits sellerie moto populaires</h2>
            <Link to="/search?category=moto" className="btn-primary">
              Voir les gabarits de sellerie moto
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {motoProducts.map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.id}?category=moto`}
                className="card-amazon group overflow-hidden hover:shadow-md transition-all"
              >
                <div className="aspect-square overflow-hidden bg-white p-4 flex items-center justify-center">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={`Gabarit sellerie moto ${p.name}`}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="text-secondary-400">Image à venir</div>
                  )}
                </div>
                <div className="p-4 border-t border-gray-100">
                  <div className="text-xs font-bold text-amber-600 mb-1 uppercase tracking-wide">Moto</div>
                  <h3 className="font-semibold text-secondary-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {p.name}
                  </h3>
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
