import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, Settings, LogOut, Home as HomeIcon } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../ui/button';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuthStore();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-amber-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">G</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">
                Gabarits.fr
              </h1>
              <p className="text-xs text-gray-400">Premium Templates</p>
            </div>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-gray-300 hover:text-amber-400 transition-colors ${
                isActive('/') ? 'text-amber-400' : ''
              } flex items-center gap-2`}
            >
              <HomeIcon className="w-4 h-4" />
              Accueil
            </Link>
            <Link
              to="/catalogue/moto"
              className={`text-gray-300 hover:text-amber-400 transition-colors ${
                isActive('/catalogue/moto') ? 'text-amber-400' : ''
              }`}
            >
              Catalogue Moto
            </Link>
            <Link
              to="/support"
              className={`text-gray-300 hover:text-amber-400 transition-colors ${
                isActive('/support') ? 'text-amber-400' : ''
              }`}
            >
              Support
            </Link>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-gray-300 hover:text-amber-400 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="hidden sm:block text-sm">{user.first_name || user.email}</span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-black border border-amber-500/20 rounded-lg shadow-xl py-2">
                    <Link
                      to="/espace-client"
                      className="flex items-center px-4 py-2 text-gray-300 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Mon Espace
                    </Link>
                    <Link
                      to="/espace-client/projets"
                      className="flex items-center px-4 py-2 text-gray-300 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Mes Projets
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setIsUserMenuOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-gray-300 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/auth/login">
                  <Button variant="outline" size="sm">
                    Connexion
                  </Button>
                </Link>
                <Link to="/auth/register">
                  <Button variant="premium" size="sm">
                    S'inscrire
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-300 hover:text-amber-400 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-amber-500/20 py-4">
            <nav className="flex flex-col space-y-3">
              <Link
                to="/"
                className={`text-gray-300 hover:text-amber-400 transition-colors px-3 py-2 ${
                  isActive('/') ? 'text-amber-400 bg-amber-500/10 rounded-lg' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Accueil
              </Link>
              <Link
                to="/catalogue/moto"
                className={`text-gray-300 hover:text-amber-400 transition-colors px-3 py-2 ${
                  isActive('/catalogue/moto') ? 'text-amber-400 bg-amber-500/10 rounded-lg' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Catalogue Moto
              </Link>
              <Link
                to="/support"
                className={`text-gray-300 hover:text-amber-400 transition-colors px-3 py-2 ${
                  isActive('/support') ? 'text-amber-400 bg-amber-500/10 rounded-lg' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Support
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
