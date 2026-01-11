import React from 'react';
import {
  Phone,
  Mail,
  Facebook,
  Instagram,
  Linkedin,
  Truck,
  HelpCircle,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { CONTACT } from '../constants/contact';
import { whatsappUrl, openFacebook } from '../config';
import { Link } from 'react-router-dom';

export default function FooterSimple() {
  return (
    <footer className="bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-800 text-white mt-12">
      <div className="container-amazon py-10">
        <div className="mb-6 rounded-xl bg-white/5 border border-slate-700/60 p-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="text-slate-200 text-sm md:text-base">
            Besoin d’aide? Nous répondons sous 24h et conseillons sur les gabarits.
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`${whatsappUrl}?text=${encodeURIComponent(
                'Bonjour, j’aimerais un conseil sur les gabarits'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white text-sm hover:scale-[1.02] transition"
            >
              WhatsApp
            </a>
            <Link
              to="/contact"
              className="px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 text-sm"
            >
              Contact
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center font-bold">
                G
              </div>
              <div>
                <div className="font-bold">Gabarits.fr</div>
                <div className="text-slate-300 text-sm">Sellerie premium</div>
              </div>
            </div>
            <p className="text-slate-300 text-sm">
              Votre spécialiste en gabarits de sellerie auto et moto. Qualité française depuis 2010.
            </p>
            <div className="mt-4 flex gap-2">
              <div className="px-2 py-1 rounded-md bg-slate-700/60 text-slate-200 text-xs">
                Made in France
              </div>
              <div className="px-2 py-1 rounded-md bg-slate-700/60 text-slate-200 text-xs">
                Garantie atelier
              </div>
              <div className="px-2 py-1 rounded-md bg-slate-700/60 text-slate-200 text-xs">
                Paiement sécurisé
              </div>
            </div>
          </div>
          <div>
            <div className="font-semibold mb-2">Nos Séries</div>
            <ul className="text-slate-300 space-y-1 text-sm">
              <li>
                <Link to="/search?category=moto&series=A" className="hover:text-white">
                  Série A
                </Link>
              </li>
              <li>
                <Link to="/search?category=moto&series=E" className="hover:text-white">
                  Série E
                </Link>
              </li>
              <li>
                <Link to="/search?category=moto&series=C" className="hover:text-white">
                  Série C
                </Link>
              </li>
              <li>
                <Link to="/search?category=moto&series=F" className="hover:text-white">
                  Série F
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-2">Support</div>
            <ul className="text-slate-300 space-y-2 text-sm">
              <li>
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-2 px-3 py-2 rounded-md bg-slate-700/50 hover:bg-slate-700 text-slate-200 transition"
                >
                  <Mail className="w-4 h-4" />
                  <span>Contact</span>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100" />
                </Link>
              </li>
              <li>
                <Link
                  to="/support/livraison"
                  className="group inline-flex items-center gap-2 px-3 py-2 rounded-md bg-slate-700/50 hover:bg-slate-700 text-slate-200 transition"
                >
                  <Truck className="w-4 h-4" />
                  <span>Livraison</span>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100" />
                </Link>
              </li>
              <li>
                <Link
                  to="/support/faq"
                  className="group inline-flex items-center gap-2 px-3 py-2 rounded-md bg-slate-700/50 hover:bg-slate-700 text-slate-200 transition"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>FAQ</span>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100" />
                </Link>
              </li>
              <li>
                <Link
                  to="/support/garantie"
                  className="group inline-flex items-center gap-2 px-3 py-2 rounded-md bg-slate-700/50 hover:bg-slate-700 text-slate-200 transition"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Garantie</span>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100" />
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-2">Contact</div>
            <div className="space-y-2 text-slate-300 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400" /> {CONTACT.phone}
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400" /> {CONTACT.email}
              </div>
            </div>
            <div className="mt-3 text-slate-300 text-sm">Suivez‑nous :</div>
            <div className="mt-2 flex gap-2">
              <a
                href={CONTACT.social.facebook}
                onClick={(e) => {
                  e.preventDefault();
                  openFacebook(CONTACT.social.facebook);
                }}
                className="px-3 py-1 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm flex items-center gap-1"
              >
                <Facebook className="w-4 h-4" /> Facebook
              </a>
              <a
                href={CONTACT.social.instagram}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm flex items-center gap-1"
              >
                <Instagram className="w-4 h-4" /> Instagram
              </a>
              <a
                href={CONTACT.social.linkedin}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm flex items-center gap-1"
              >
                <Linkedin className="w-4 h-4" /> LinkedIn
              </a>
            </div>
            <div className="mt-4">
              <div className="text-slate-300 text-sm mb-2">Newsletter</div>
              <div className="flex gap-2">
                <input
                  className="flex-1 px-3 py-2 rounded-md bg-slate-700/60 text-slate-100 placeholder:text-slate-300 text-sm"
                  placeholder="Votre email"
                />
                <button className="px-3 py-2 rounded-md bg-amber-600 text-white text-sm hover:bg-amber-500">
                  S’inscrire
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-700 mt-6 pt-4 text-center text-slate-300 text-xs">
          © {new Date().getFullYear()} Gabarits.fr – Tous droits réservés | CGV | Mentions légales
        </div>
      </div>
    </footer>
  );
}
