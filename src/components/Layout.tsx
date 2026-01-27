import React, { useEffect, useState } from 'react';
import { Home as HomeIcon, Menu, X, Bot, Facebook as FacebookIcon } from 'lucide-react';
import SupportBot from './SupportBot';
import FloatingDock from './FloatingDock';
import { openFacebook } from '../config';
import { useCartStore } from '../store/index.tsx';
import { Link, Outlet } from 'react-router-dom';
// ContactBar removed from header; info moved to footer
import FooterSimple from './FooterSimple';
import { supabase } from '../lib/supabase';
import { CONTACT } from '../constants/contact';

export default function Layout() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems } = useCartStore();
  useEffect(() => {
    (async () => {
      const { data } = await (supabase as any).auth.getSession();
      setIsAuthed(!!data?.session);
    })();
  }, []);
  return (
    <div className="min-h-screen bg-amazon-gray">
      <header className="sticky top-0 z-40">
        <div className="bg-white border-b border-orange-300">
          <div className="container-amazon flex items-center justify-between py-3">
            <Link to="/" className="font-extrabold text-lg brand">
              Gabarits.fr
            </Link>
            {/* Navigation desktop */}
            <nav className="hidden md:flex items-center gap-4">
              <Link
                to="/"
                className="flex items-center gap-1 text-secondary-700 hover:text-secondary-900"
              >
                <HomeIcon className="w-5 h-5" />
                Accueil
              </Link>
              <Link to="/search" className="text-secondary-700 hover:text-secondary-900">
                Recherche
              </Link>
              <Link to="/cart" className="relative text-secondary-700 hover:text-secondary-900">
                Panier
                {totalItems > 0 && (
                  <span className="ml-1 font-semibold text-primary-700">({totalItems})</span>
                )}
                {totalItems > 0 && (
                  <span
                    className="ml-2 inline-flex items-center justify-center px-2 min-w-[20px] h-5 rounded-full bg-primary-600 text-white text-xs"
                    aria-live="polite"
                  >
                    {totalItems}
                  </span>
                )}
              </Link>
              <Link to="/contact" className="text-secondary-700 hover:text-secondary-900">
                Contact
              </Link>
              <a
                href={CONTACT.social.facebook}
                onClick={(e) => {
                  e.preventDefault();
                  openFacebook(CONTACT.social.facebook);
                }}
                aria-label="Facebook"
                className="text-secondary-700 hover:text-secondary-900 inline-flex items-center"
                title="Facebook"
              >
                <FacebookIcon className="w-5 h-5" />
              </a>
              {false && (
                <Link to="/auth/login" className="text-secondary-200 hover:text-white">
                  Se connecter
                </Link>
              )}
              {isAuthed && (
                <div className="relative group">
                  <span className="text-secondary-700">Admin</span>
                  <div className="absolute right-0 mt-2 hidden group-hover:block bg-white border border-gray-200 rounded-amazon shadow-lg p-2">
                    <Link
                      to="/admin/ads"
                      className="block px-3 py-2 text-secondary-700 hover:text-secondary-900"
                    >
                      Pubs
                    </Link>
                    <Link
                      to="/admin/products"
                      className="block px-3 py-2 text-secondary-700 hover:text-secondary-900"
                    >
                      Produits
                    </Link>
                    <Link
                      to="/admin/suppliers"
                      className="block px-3 py-2 text-secondary-700 hover:text-secondary-900"
                    >
                      Fournisseurs
                    </Link>
                    <Link
                      to="/admin/orders"
                      className="block px-3 py-2 text-secondary-700 hover:text-secondary-900"
                    >
                      Commandes
                    </Link>
                  </div>
                </div>
              )}
              {isAuthed && (
                <Link to="/espace-client" className="text-secondary-700 hover:text-secondary-900">
                  Mon espace
                </Link>
              )}
            </nav>
            {/* Bouton burger mobile */}
            <button
              className="md:hidden p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
              aria-label="Menu"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-6 h-6 text-secondary-700" />
            </button>
          </div>
        </div>
        {/* Drawer mobile */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            <div className="absolute top-0 right-0 h-full w-72 bg-white border-l border-gray-200 shadow-xl flex flex-col">
              <div className="flex items-center justify-between p-4 border-b">
                <Link
                  to="/"
                  className="font-extrabold text-lg brand"
                  onClick={() => setMobileOpen(false)}
                >
                  Gabarits.fr
                </Link>
                <button
                  className="p-2 rounded-lg hover:bg-gray-100"
                  aria-label="Fermer"
                  onClick={() => setMobileOpen(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 p-4 space-y-2">
                <Link
                  to="/"
                  className="block px-3 py-2 rounded-lg hover:bg-gray-100"
                  onClick={() => setMobileOpen(false)}
                >
                  Accueil
                </Link>
                <Link
                  to="/search"
                  className="block px-3 py-2 rounded-lg hover:bg-gray-100"
                  onClick={() => setMobileOpen(false)}
                >
                  Recherche
                </Link>
                <Link
                  to="/cart"
                  className="block px-3 py-2 rounded-lg hover:bg-gray-100"
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="inline-flex items-center gap-2">
                    <span>Panier</span>
                    {totalItems > 0 && (
                      <span className="font-semibold text-primary-700">({totalItems})</span>
                    )}
                    {totalItems > 0 && (
                      <span className="inline-flex items-center justify-center px-2 min-w-[20px] h-5 rounded-full bg-primary-600 text-white text-xs">
                        {totalItems}
                      </span>
                    )}
                  </span>
                </Link>
                <Link
                  to="/contact"
                  className="block px-3 py-2 rounded-lg hover:bg-gray-100"
                  onClick={() => setMobileOpen(false)}
                >
                  Contact
                </Link>
                <a
                  href={CONTACT.social.facebook}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
                  onClick={(e) => {
                    e.preventDefault();
                    openFacebook(CONTACT.social.facebook);
                    setMobileOpen(false);
                  }}
                  aria-label="Facebook"
                >
                  <FacebookIcon className="w-4 h-4" />
                  <span>Facebook</span>
                </a>
                <button
                  className="mt-2 w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100"
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('open-support-bot'));
                    setMobileOpen(false);
                  }}
                >
                  <Bot className="w-4 h-4" />
                  Assistance
                </button>
              </nav>
              <div className="p-4 border-t text-xs text-secondary-600">© Gabarits.fr</div>
            </div>
          </div>
        )}
      </header>
      <main>
        <Outlet />
      </main>
      <FooterSimple />
      <SupportBot />
      <FloatingDock />
    </div>
  );
}
