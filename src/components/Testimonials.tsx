import React from 'react';
import { Star, CheckCircle } from 'lucide-react';

export default function Testimonials() {
  const reviews = [
    {
      id: 1,
      author: "Thomas L.",
      role: "Particulier",
      rating: 5,
      text: "Gabarit reçu en 24h, qualité top. J'ai gagné 2h sur ma selle de CB750. Le plastique est super résistant.",
      date: "Il y a 2 jours"
    },
    {
      id: 2,
      author: "Atelier M.",
      role: "Sellier Pro",
      rating: 5,
      text: "Enfin des motifs symétriques sans prise de tête. Je les utilise pour toutes mes commandes clients maintenant.",
      date: "Il y a 1 semaine"
    },
    {
      id: 3,
      author: "Marc D.",
      role: "Passionné",
      rating: 5,
      text: "C'est mon 3ème gabarit (Série A, J et maintenant le Pano). Toujours aussi précis. Bravo pour le made in France.",
      date: "Il y a 3 semaines"
    }
  ];

  return (
    <div className="py-12 bg-white rounded-3xl border border-gray-100 my-8">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-secondary-900 mb-2">Ils nous font confiance</h2>
        <div className="flex items-center justify-center gap-2 text-amber-500 font-bold text-lg">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-current" />
            ))}
          </div>
          <span className="text-secondary-700 text-base font-medium ml-2">4.9/5 sur +500 commandes</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-8">
        {reviews.map((review) => (
          <div key={review.id} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-1 text-amber-500 mb-3">
              {[...Array(review.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-secondary-700 mb-4 italic">"{review.text}"</p>
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-200/60">
              <div>
                <div className="font-bold text-secondary-900 text-sm">{review.author}</div>
                <div className="text-xs text-secondary-500">{review.role}</div>
              </div>
              <div className="flex items-center gap-1 text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
                <CheckCircle className="w-3 h-3" />
                Achat vérifié
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
