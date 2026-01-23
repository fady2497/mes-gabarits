import React from 'react';
import { Award, PenTool, Heart, ShieldCheck, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  // SEO
  React.useEffect(() => {
    document.title = 'Notre Histoire & Savoir-Faire | Gabarits.fr';
  }, []);

  return (
    <div className="min-h-screen bg-amazon-gray">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-800 z-0"></div>
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center z-0"></div>
        
        <div className="container-amazon relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 font-display">L'Art du Gabarit de Précision</h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto font-light">
            Depuis 2010, nous accompagnons les artisans selliers et les passionnés exigeants dans la réalisation de selleries d'exception.
          </p>
        </div>
      </div>

      <div className="container-amazon py-16">
        {/* Notre Histoire */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-semibold">
              <Award className="w-4 h-4" />
              Notre Histoire
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900">De l'atelier artisanal au standard de qualité</h2>
            <p className="text-secondary-700 leading-relaxed text-lg">
              Tout a commencé dans un petit atelier de sellerie moto en France. Frustrés par le temps perdu à tracer des motifs complexes à la main, nous avons cherché une solution pour garantir une symétrie parfaite à chaque fois.
            </p>
            <p className="text-secondary-700 leading-relaxed">
              Après des mois de tests, nous avons mis au point nos premiers gabarits en polypropylène : souples, indestructibles et d'une précision chirurgicale. Aujourd'hui, <strong>Gabarits.fr</strong> est la référence pour plus de 5000 clients à travers l'Europe.
            </p>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-amber-500 rounded-3xl rotate-3 opacity-20"></div>
            <img 
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80" 
              alt="Atelier de sellerie" 
              className="relative rounded-3xl shadow-xl w-full h-auto object-cover aspect-video"
            />
          </div>
        </div>

        {/* Nos Valeurs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white p-8 rounded-amazon-lg border border-gray-100 shadow-soft hover:shadow-lg transition-all duration-300">
            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 text-amber-600">
              <PenTool className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-secondary-900 mb-3">Précision Artisanale</h3>
            <p className="text-secondary-600">
              Chaque gabarit est dessiné et testé par des selliers professionnels. Nous ne vendons que ce que nous utiliserions nous-mêmes.
            </p>
          </div>
          <div className="bg-white p-8 rounded-amazon-lg border border-gray-100 shadow-soft hover:shadow-lg transition-all duration-300">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-secondary-900 mb-3">Qualité Durable</h3>
            <p className="text-secondary-600">
              Fini le papier ou le carton. Nos gabarits en composite technique résistent aux cutters, aux craies et au temps.
            </p>
          </div>
          <div className="bg-white p-8 rounded-amazon-lg border border-gray-100 shadow-soft hover:shadow-lg transition-all duration-300">
            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6 text-green-600">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-secondary-900 mb-3">Service Passionné</h3>
            <p className="text-secondary-600">
              Une question technique ? Une demande sur-mesure ? Notre équipe est là pour vous accompagner dans vos projets.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-slate-900 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Prêt à sublimer vos créations ?</h2>
            <p className="text-slate-300 mb-8 text-lg">
              Rejoignez la communauté des selliers qui ont choisi l'excellence et la facilité.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/search" className="btn-primary text-lg px-8 py-4">
                Voir le catalogue
              </Link>
              <Link to="/contact" className="btn-secondary bg-white/10 text-white border-white/20 hover:bg-white/20 text-lg px-8 py-4">
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
