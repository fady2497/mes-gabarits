import React from 'react';
import { Phone, Mail, Award, Facebook, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const email = process.env.REACT_APP_ORDER_EMAIL || 'fadymezghani12345@gmail.com';
  const phone = process.env.REACT_APP_MERCHANT_PHONE || '+33759652867';
  const waUrl = `https://wa.me/${phone.replace(/[^\d]/g, '')}?text=${encodeURIComponent('Bonjour, j’ai une question sur la livraison')}`;
  const fbUrl = process.env.REACT_APP_FACEBOOK_URL || 'https://facebook.com/';
  const igUrl = process.env.REACT_APP_INSTAGRAM_URL || 'https://www.instagram.com/gabarits.fr/';
  const liUrl = process.env.REACT_APP_LINKEDIN_URL || 'https://linkedin.com/';

  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white mt-12 lg:mt-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          <div>
            <h3 className="text-lg lg:text-2xl font-bold text-amber-400 mb-3 lg:mb-4">
              Gabarits.fr
            </h3>
            <p className="text-gray-300 text-sm lg:text-base leading-relaxed">
              Votre spécialiste en gabarits de sellerie auto et moto.
            </p>
            <div className="mt-3 flex items-center text-gray-300 text-sm">
              <Award size={16} className="mr-2 text-amber-400" />
              Qualité premium garantie
            </div>
          </div>
          <div>
            <h4 className="text-base lg:text-lg font-semibold mb-2 lg:mb-4">Produits</h4>
            <ul className="space-y-1 lg:space-y-2 text-gray-300 text-sm lg:text-base">
              <li>Série A</li>
              <li>Série G</li>
              <li>Nouveautés</li>
            </ul>
          </div>
          <div>
            <h4 className="text-base lg:text-lg font-semibold mb-2 lg:mb-4">Support</h4>
            <ul className="space-y-1 lg:space-y-2 text-gray-300 text-sm lg:text-base">
              <li>
                <a href={`mailto:${email}`} className="hover:text-amber-400 transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-amber-400 transition-colors"
                >
                  Livraison
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${email}?subject=${encodeURIComponent('Question FAQ')}`}
                  className="hover:text-amber-400 transition-colors"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${email}?subject=${encodeURIComponent('Garantie')}`}
                  className="hover:text-amber-400 transition-colors"
                >
                  Garantie
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-base lg:text-lg font-semibold mb-2 lg:mb-4">Contact</h4>
            <ul className="space-y-1 lg:space-y-2 text-gray-300 text-sm lg:text-base">
              <li className="flex items-center">
                <Phone size={14} className="mr-2" />
                <a href={`tel:${phone}`} className="hover:text-amber-400 transition-colors">
                  {phone}
                </a>
              </li>
              <li className="flex items-center">
                <Mail size={14} className="mr-2" />
                <a href={`mailto:${email}`} className="hover:text-amber-400 transition-colors">
                  {email}
                </a>
              </li>
            </ul>
            <div className="mt-3">
              <p className="text-gray-400 text-sm mb-2">Suivez‑nous :</p>
              <div className="flex gap-2">
                <a
                  href={fbUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded-md text-sm"
                >
                  <Facebook size={14} /> Facebook
                </a>
                <a
                  href={igUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded-md text-sm"
                >
                  <Instagram size={14} /> Instagram
                </a>
                <a
                  href={liUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded-md text-sm"
                >
                  <Linkedin size={14} /> LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-6 lg:mt-8 pt-6 lg:pt-8 text-center">
          <p className="text-gray-400 text-sm lg:text-base">
            ©2024 Gabarits.fr - Tous droits réservés
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
