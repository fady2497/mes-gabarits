import React, { useEffect, useState } from 'react';
import { Home as HomeIcon } from 'lucide-react';
import SupportBot from './SupportBot';
import FloatingDock from './FloatingDock';
import { whatsappUrl } from '../config';
import { Link, Outlet } from 'react-router-dom';
// ContactBar removed from header; info moved to footer
import FooterSimple from './FooterSimple';
import CampaignBar from './CampaignBar';
import { supabase } from '../lib/supabase';

export default function Layout() {
  const [isAuthed, setIsAuthed] = useState(false);
  useEffect(() => {
    (async () => {
      const { data } = await (supabase as any).auth.getSession();
      setIsAuthed(!!data?.session);
    })();
  }, []);
  return (
    <div className="min-h-screen bg-amazon-gray">
      <header className="sticky top-0 z-40">
        <CampaignBar />
        <div className="bg-white border-b border-orange-300">
          <div className="container-amazon flex items-center justify-between py-3">
            <Link to="/" className="font-extrabold text-lg brand">
              Gabarits.fr
            </Link>
            <nav className="flex items-center gap-4">
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
              <Link to="/cart" className="text-secondary-700 hover:text-secondary-900">
                Panier
              </Link>
              <Link to="/contact" className="text-secondary-700 hover:text-secondary-900">
                Contact
              </Link>
              
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
          </div>
        </div>
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
