import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  ShoppingCart,
  Search,
  X,
  Plus,
  Minus,
  ChevronDown,
  ChevronRight,
  Star,
  Truck,
  Shield,
  Award,
  Menu,
  Phone,
  Mail,
  Heart,
  Filter,
  Package,
  CheckCircle,
  Sparkles,
  TrendingUp,
  Zap,
  Clock,
  Facebook,
  Instagram,
  Linkedin
} from 'lucide-react';

import StorySlider from './StorySlider';
// Footer et Cart seront définis inline ci‑dessous
import Toast from './components/ui/Toast';
import ProgressBar from './components/ui/ProgressBar';

// ============= PAGES & MODALS =============
const OrderConfirmation = ({ order, onClose }) => (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-lg z-[100] flex items-center justify-center p-4 animate-fade-in">
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 max-w-lg w-full shadow-2xl animate-scale-in">
      <div className="text-center">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <CheckCircle size={48} className="text-white" />
          </div>
          <div className="absolute -top-2 -right-2">
            <Sparkles size={32} className="text-yellow-400" />
          </div>
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-3">Commande Confirmée !</h3>
        <p className="text-gray-600 mb-6">
          Merci pour votre commande de <span className="font-bold">{order.totalItems}</span>{' '}
          gabarits
        </p>
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-6 mb-8 border-2 border-amber-200">
          <p className="text-5xl font-bold text-amber-600">{order.subtotal}€</p>
          <p className="text-sm text-amber-700 mt-2">Total TTC</p>
        </div>
        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-4 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
        >
          Continuer mes achats
        </button>
      </div>
    </div>
  </div>
);

// ============= COMPOSANTS FONCTIONNELS =============
const SearchSuggestions = ({ searchTerm, products, onSelect }) => {
  const suggestions = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 6);
  }, [searchTerm, products]);

  if (!searchTerm || suggestions.length === 0) return null;

  return (
    <div className="absolute top-full left-0 right-0 bg-white rounded-2xl shadow-2xl z-40 mt-2 border-2 border-gray-100 overflow-hidden">
      {suggestions.map((product, index) => (
        <button
          key={`${product.id}-${index}`}
          onClick={() => onSelect(product)}
          className="w-full text-left p-4 hover:bg-amber-50 transition-all duration-200 flex items-center space-x-4 border-b border-gray-100 last:border-b-0 group"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">{product.series}</span>
          </div>
          <div className="flex-1">
            <div className="font-bold text-gray-800 group-hover:text-amber-600">{product.name}</div>
            <div className="text-sm text-gray-600 truncate">{product.description}</div>
          </div>
          <div className="text-amber-600 font-bold">{product.basePrice}€</div>
        </button>
      ))}
    </div>
  );
};

// ============= PANNEAU COMMANDES =============
const OrdersPanel = ({ showOrders, onClose, orders, loading, error, onRefresh }) => {
  if (!showOrders) return null;
  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-lg animate-slide-in-right">
        <div className="h-full bg-gradient-to-b from-white to-gray-50 shadow-2xl border-l-4 border-amber-500">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Award size={24} className="text-white" />
                <h2 className="text-2xl font-bold text-white">Mes commandes</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={24} className="text-white" />
              </button>
            </div>
            <div className="mt-4 flex items-center justify-between text-white/90">
              <span>{orders?.length || 0} enregistrées</span>
              <button
                onClick={onRefresh}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-sm"
              >
                ↻ Actualiser
              </button>
            </div>
          </div>

          <div className="p-6 h-[calc(100%-140px)] overflow-y-auto">
            {loading && <div className="text-center py-10">Chargement…</div>}
            {error && <div className="text-center py-10 text-red-600">Erreur: {String(error)}</div>}
            {!loading && !error && (
              <div className="space-y-4">
                {(orders || []).map((o) => (
                  <div
                    key={o.id}
                    className="bg-white rounded-2xl shadow p-4 border border-gray-200"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-gray-900">{o.ref || `#${o.id}`}</div>
                        <div className="text-sm text-gray-600">
                          {new Date(o.created_at).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-amber-600">{o.subtotal}€</div>
                        <div className="text-sm text-gray-600">{o.total_items} articles</div>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-700">
                      Client: {o.client_name} · {o.client_phone}
                    </div>
                  </div>
                ))}
                {orders?.length === 0 && (
                  <div className="text-center py-16 bg-white rounded-2xl border border-dashed">
                    Aucune commande pour le moment
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const AdvancedFilters = ({ filters, onFiltersChange, series }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-6 shadow-2xl mb-8 border-2 border-gray-100">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full group"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl">
            <Filter size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Filtres avancés</h3>
            <p className="text-sm text-gray-600">Affinez votre recherche</p>
          </div>
        </div>
        <div
          className={`p-2 rounded-full transition-all duration-300 ${isOpen ? 'bg-amber-100 rotate-180' : 'bg-gray-100'}`}
        >
          <ChevronDown size={20} className="text-gray-700" />
        </div>
      </button>

      {isOpen && (
        <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-down">
          <div className="space-y-4">
            <h4 className="font-bold text-gray-700 flex items-center space-x-2">
              <Package size={16} />
              <span>Séries</span>
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {series.map((s) => (
                <label
                  key={s}
                  className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer"
                >
                  <div
                    className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all
                    ${
                      filters.series.includes(s)
                        ? 'bg-amber-500 border-amber-500'
                        : 'border-gray-300'
                    }`}
                  >
                    {filters.series.includes(s) && <CheckCircle size={12} className="text-white" />}
                  </div>
                  <span className="font-medium">Série {s}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-gray-700 flex items-center space-x-2">
              <TrendingUp size={16} />
              <span>Tailles disponibles</span>
            </h4>
            <div className="flex space-x-3">
              {['S', 'M', 'L'].map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    const newSizes = filters.sizes.includes(size)
                      ? filters.sizes.filter((s) => s !== size)
                      : [...filters.sizes, size];
                    onFiltersChange({ ...filters, sizes: newSizes });
                  }}
                  className={`px-4 py-3 rounded-xl font-bold transition-all duration-300
                    ${
                      filters.sizes.includes(size)
                        ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-gray-700 flex items-center space-x-2">
              <Zap size={16} />
              <span>Budget maximum</span>
            </h4>
            <div className="space-y-4">
              <div className="text-2xl font-bold text-amber-600 text-center">
                {filters.maxPrice}€
              </div>
              <input
                type="range"
                min="50"
                max="200"
                step="10"
                value={filters.maxPrice}
                onChange={(e) =>
                  onFiltersChange({ ...filters, maxPrice: parseInt(e.target.value) })
                }
                className="w-full h-2 bg-gradient-to-r from-amber-200 to-amber-500 rounded-lg appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-amber-500 [&::-webkit-slider-thumb]:shadow-xl"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>50€</span>
                <span>200€</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============= LOGIQUE DES PRODUITS =============
const generateProducts = () => {
  const series = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const products = [];
  const descriptions = [
    'Traçage couture professionnel',
    "Motif nid d'abeille premium",
    'Gabarit expert sellerie auto',
    'Design moto sport premium',
    'Précision millimétrique',
    'Qualité industrie française'
  ];

  series.forEach((letter, idx) => {
    const count = letter === 'G' ? 6 : 4;
    for (let i = 1; i <= count; i++) {
      const modelNum = String(i).padStart(3, '0');
      const descIndex = (idx + i) % descriptions.length;

      products.push({
        id: `${letter}-${modelNum}`,
        series: letter,
        model: modelNum,
        name: `${letter}-${modelNum}`,
        description: descriptions[descIndex],
        basePrice: 80 + Math.floor(Math.random() * 60),
        sizes: ['S', 'M', 'L'],
        rating: (4 + Math.random() * 0.9).toFixed(1),
        popular: i <= 2,
        color: `bg-gradient-to-br from-amber-${400 + idx * 100} to-orange-${300 + idx * 100}`
      });
    }
  });

  return products.sort(() => Math.random() - 0.5);
};

// ============= CARTE PRODUIT =============
const ProductCard = ({
  product,
  onAddToCart,
  isFavorite,
  onToggleFavorite,
  onView,
  isFeatured
}) => {
  const [hover, setHover] = useState(false);

  return (
    <div
      className={`relative bg-gradient-to-b from-white to-gray-50 rounded-3xl transition-all duration-500 hover:scale-[1.02] group cursor-pointer
        ${
          isFeatured
            ? 'border-4 border-amber-500 shadow-2xl'
            : 'border-2 border-gray-100 shadow-xl hover:shadow-2xl'
        }`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => onView(product)}
    >
      {/* Badges */}
      {product.popular && (
        <div className="absolute top-4 left-4 z-10 animate-pulse">
          <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-full font-bold text-xs shadow-2xl flex items-center space-x-2">
            <Sparkles size={10} />
            <span>POPULAIRE</span>
          </div>
        </div>
      )}

      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(product.id);
        }}
        className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 transition-transform"
      >
        <Heart
          size={20}
          className={`transition-colors ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'}`}
        />
      </button>

      {/* Header produit */}
      <div className={`relative h-48 ${product.color} rounded-t-3xl overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent"></div>
        <div className="relative z-10 p-6 h-full flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-4xl font-bold text-white drop-shadow-lg">{product.series}</span>
              <p className="text-white/90 text-sm mt-2">Série Premium</p>
            </div>
            <div className="text-right">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-white font-mono font-bold text-lg">#{product.model}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={`${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-white/40'}`}
                />
              ))}
              <span className="text-white font-bold ml-2">{product.rating}</span>
            </div>
            <div className="text-white text-sm font-semibold bg-black/20 px-3 py-1 rounded-full">
              {product.sizes.length} tailles
            </div>
          </div>
        </div>
      </div>

      {/* Contenu produit */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

        {/* Prix et quantités */}
        <div className="mb-6">
          <div className="flex items-end justify-between mb-3">
            <div>
              <div className="text-3xl font-bold text-amber-600">{product.basePrice}€</div>
              <div className="text-gray-500 text-sm">unité</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">10+ pièces:</div>
              <div className="text-xl font-bold text-green-600">90€/unité</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-semibold text-gray-700">Stock disponible</div>
            <ProgressBar current={Math.floor(Math.random() * 15)} target={20} />
          </div>
        </div>

        {/* Tailles */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">Choisir la taille:</span>
            <span className="text-xs text-gray-500">3 disponibles</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {product.sizes.map((size, idx) => (
              <button
                key={size}
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(product, size);
                }}
                className={`relative py-3 rounded-xl font-bold transition-all duration-300 group/btn
                  ${
                    hover
                      ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg transform -translate-y-1'
                      : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800'
                  }`}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <div className="relative z-10 flex flex-col items-center">
                  <Plus
                    size={16}
                    className="mb-1 opacity-0 group-hover/btn:opacity-100 transition-opacity"
                  />
                  <span>{size}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============= BARREL CAROUSEL AMÉLIORÉ =============
const BarrelCarousel = ({ products, onAddToCart, favorites, onToggleFavorite, onView }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState(null);

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleScroll('next');
      } else {
        handleScroll('prev');
      }
    }
    setTouchStart(null);
  };

  const handleScroll = useCallback(
    (direction) => {
      if (isAnimating) return;
      setIsAnimating(true);

      setCurrentIndex((prev) => {
        if (direction === 'next') return (prev + 1) % products.length;
        if (direction === 'prev') return (prev - 1 + products.length) % products.length;
        return prev;
      });

      setTimeout(() => setIsAnimating(false), 600);
    },
    [isAnimating, products.length]
  );

  const getVisibleProducts = () => {
    const isMobile = window.innerWidth < 768;
    const range = isMobile ? 1 : 2;
    const visible = [];

    for (let i = -range; i <= range; i++) {
      const index = (currentIndex + i + products.length) % products.length;
      visible.push({
        product: products[index],
        offset: i,
        key: `${products[index].id}-${i}`,
        zIndex: 50 - Math.abs(i) * 10,
        opacity: 1 - Math.abs(i) * (isMobile ? 0.3 : 0.2),
        scale: 1 - Math.abs(i) * (isMobile ? 0.1 : 0.08)
      });
    }

    return visible;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleScroll('next');
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, handleScroll]);

  return (
    <div
      className="relative py-12 bg-gradient-to-b from-gray-50 to-white rounded-3xl overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background décoratif */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-transparent"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* En-tête carousel */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Explorez nos{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">
              Gabarits Premium
            </span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Sélectionnez, visualisez et commandez vos gabarits avec notre interface 3D immersive
          </p>
        </div>

        {/* Conteneur du carousel */}
        <div className="relative h-[600px]">
          {getVisibleProducts().map(({ product, offset, key, zIndex, opacity, scale }) => {
            const rotation = offset * 30;
            const translateX = offset * 120;
            const translateZ = -Math.abs(offset) * 100;

            return (
              <div
                key={key}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-out"
                style={{
                  transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotation}deg) scale(${scale})`,
                  opacity,
                  zIndex,
                  filter: `blur(${Math.abs(offset) * 2}px)`,
                  transformStyle: 'preserve-3d',
                  pointerEvents: offset === 0 ? 'auto' : 'none'
                }}
              >
                <div
                  className={`transition-transform duration-700 ${offset === 0 ? 'scale-110' : ''}`}
                >
                  <ProductCard
                    product={product}
                    onAddToCart={onAddToCart}
                    isFavorite={favorites.includes(product.id)}
                    onToggleFavorite={onToggleFavorite}
                    onView={onView}
                    isFeatured={offset === 0}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Contrôles */}
        <div className="flex justify-center items-center space-x-8 mt-12">
          <button
            onClick={() => handleScroll('prev')}
            disabled={isAnimating}
            className="p-4 bg-gradient-to-br from-white to-gray-100 rounded-2xl shadow-2xl hover:shadow-3xl transition-all hover:scale-110 disabled:opacity-50"
          >
            <ChevronDown size={24} className="text-amber-600 rotate-90" />
          </button>

          <div className="flex flex-col items-center">
            <div className="text-amber-600 text-sm font-semibold mb-2">Navigation</div>
            <div className="flex space-x-3">
              {products.slice(0, 5).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setIsAnimating(true);
                    setCurrentIndex(idx);
                    setTimeout(() => setIsAnimating(false), 600);
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentIndex % products.length === idx
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 scale-125'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={() => handleScroll('next')}
            disabled={isAnimating}
            className="p-4 bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all hover:scale-110 disabled:opacity-50"
          >
            <ChevronDown size={24} className="rotate-270" />
          </button>
        </div>

        {/* Indicateur de progression */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-4 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
            <span className="text-gray-700 font-semibold">Modèle</span>
            <span className="text-2xl font-bold text-amber-600">{currentIndex + 1}</span>
            <span className="text-gray-400">sur</span>
            <span className="text-gray-700 font-semibold">{products.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============= PANIER AMÉLIORÉ =============
const Cart = ({
  cart,
  cartTotal,
  onUpdateQuantity,
  onRemoveFromCart,
  onClose,
  showCart,
  onCheckout,
  showToast
}) => {
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientNotes, setClientNotes] = useState('');
  const normalizePhone = (value) => {
    const v = String(value || '').trim();
    const hasPlus = v.startsWith('+');
    const digits = v.replace(/[^\d]/g, '');
    if (hasPlus) return `+${digits}`;
    if (digits.startsWith('0')) return `+33${digits.slice(1)}`;
    if (digits.length >= 8) return `+33${digits}`;
    return digits;
  };
  const handlePhoneBlur = () => {
    setClientPhone(normalizePhone(clientPhone));
  };
  const cleanedPhone = clientPhone.replace(/[^\d]/g, '');
  const canSend = clientName.trim().length > 0 && cleanedPhone.length >= 8;
  const nameError = clientName.trim().length === 0;
  const phoneError = cleanedPhone.length < 8;
  if (!showCart) return null;

  const sendOrderByEmail = () => {
    if (!cart || cart.length === 0) {
      showToast && showToast('Votre panier est vide', 'error');
      return;
    }
    if (!canSend) {
      showToast && showToast('Veuillez renseigner nom et téléphone valides', 'error');
      return;
    }
    const to = process.env.REACT_APP_ORDER_EMAIL || 'fadymezghani12345@gmail.com';
    const subject = encodeURIComponent('Commande de gabarits');
    const lines = cart.map(
      (item) =>
        `- ${item.id} | ${item.name} | Taille ${item.size || '-'} | Qté ${item.quantity} | ${item.quantity * cartTotal.pricePerUnit}€`
    );
    const totalLine = `Total: ${cartTotal.subtotal}€ (Prix unitaire: ${cartTotal.pricePerUnit}€)`;
    const headerLines = [
      `Client: ${clientName || '—'} | Téléphone: ${clientPhone || '—'}`,
      clientNotes ? `Notes: ${clientNotes}` : null
    ].filter(Boolean);
    const body = encodeURIComponent(
      [
        'Bonjour,',
        '',
        'Je souhaite valider la commande suivante:',
        '',
        ...headerLines,
        '',
        ...lines,
        '',
        totalLine,
        '',
        'Merci de me confirmer la disponibilité et le délai.',
        'Cordialement,'
      ].join('\r\n')
    );
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  };

  const sendOrderToBackend = async () => {
    if (!cart || cart.length === 0) {
      showToast && showToast('Votre panier est vide', 'error');
      return;
    }
    if (!canSend) {
      showToast && showToast('Veuillez renseigner nom et téléphone valides', 'error');
      return;
    }
    try {
      const payload = {
        client: { name: clientName.trim(), phone: clientPhone.trim(), notes: clientNotes },
        cart,
        totals: {
          subtotal: cartTotal.subtotal,
          pricePerUnit: cartTotal.pricePerUnit,
          totalItems: cartTotal.totalItems
        },
        meta: { ref: `CMD-${Date.now()}` }
      };
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        showToast && showToast('Erreur lors de l’envoi de la commande', 'error');
        return;
      }
      showToast && showToast('Commande envoyée au commerçant');
    } catch (e) {
      showToast && showToast('Erreur réseau', 'error');
    }
  };

  const contactMerchant = () => {
    if (!cart || cart.length === 0) {
      showToast && showToast('Votre panier est vide', 'error');
      return;
    }
    if (!canSend) {
      showToast && showToast('Veuillez renseigner nom et téléphone valides', 'error');
      return;
    }
    const raw = process.env.REACT_APP_MERCHANT_PHONE || '+33759652867';
    const phone = raw.replace(/[^\d]/g, '');
    const lines = cart.map(
      (item) =>
        `- ${item.id} | ${item.name} | Taille ${item.size || '-'} | Qté ${item.quantity} | ${item.quantity * cartTotal.pricePerUnit}€`
    );
    const totalLine = `Total: ${cartTotal.subtotal}€`;
    const headerLines = [
      `Client: ${clientName || '—'} | Téléphone: ${clientPhone || '—'}`,
      clientNotes ? `Notes: ${clientNotes}` : null
    ].filter(Boolean);
    const msg = encodeURIComponent(
      [
        'Bonjour, je souhaite discuter de cette commande:',
        '',
        ...headerLines,
        '',
        ...lines,
        '',
        totalLine
      ].join('\r\n')
    );
    const apiUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${msg}`;
    const ua = navigator.userAgent || '';
    const isIOS = /iPhone|iPad|iPod/i.test(ua);
    const isAndroid = /Android/i.test(ua);
    const isMobile = isIOS || isAndroid;

    if (isMobile) {
      window.location.href = apiUrl;
    } else {
      window.open(apiUrl, '_blank');
    }

    setTimeout(() => {
      if (isMobile) return;
      const to = process.env.REACT_APP_ORDER_EMAIL || 'fadymezghani12345@gmail.com';
      const subject = encodeURIComponent('Commande de gabarits');
      const body = encodeURIComponent(
        [
          'Bonjour,',
          '',
          'Je souhaite valider la commande suivante:',
          ...lines,
          '',
          totalLine,
          '',
          'Merci de me confirmer la disponibilité et le délai.',
          'Cordialement,'
        ].join('\r\n')
      );
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />

      {/* Panier */}
      <div className="absolute right-0 top-0 h-full w-full max-w-lg animate-slide-in-right">
        <div className="h-full bg-gradient-to-b from-white to-gray-50 shadow-2xl border-l-4 border-amber-500">
          {/* En-tête */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ShoppingCart size={24} className="text-white" />
                <h2 className="text-2xl font-bold text-white">Votre Panier</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={24} className="text-white" />
              </button>
            </div>
            <div className="mt-4 flex items-center justify-between text-white/90">
              <span>{cart.length} articles</span>
              <span className="font-bold">{cartTotal.subtotal}€</span>
            </div>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                onBlur={() => setClientName(clientName.trim())}
                placeholder="Nom du client (requis)"
                className="w-full px-3 py-2 bg-white/20 text-white placeholder-white/70 border border-white/30 rounded-lg focus:border-white focus:ring-2 focus:ring-white/30 outline-none text-sm"
              />
              <input
                type="tel"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                onBlur={handlePhoneBlur}
                placeholder="Téléphone (requis)"
                className="w-full px-3 py-2 bg-white/20 text-white placeholder-white/70 border border-white/30 rounded-lg focus:border-white focus:ring-2 focus:ring-white/30 outline-none text-sm"
              />
            </div>
            {nameError && <p className="text-red-100 text-xs mt-1">Nom requis pour envoyer</p>}
            {phoneError && (
              <p className="text-red-100 text-xs">Téléphone invalide, exemple +33XXXXXXXXX</p>
            )}
            {!phoneError && cleanedPhone && (
              <p className="text-white/90 text-xs">Numéro utilisé: {normalizePhone(clientPhone)}</p>
            )}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={contactMerchant}
                disabled={!canSend}
                className="w-full bg-white/20 hover:bg-white/30 text-white font-bold py-2 rounded-xl shadow transition-all duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                💬 Contacter pour commander
              </button>
              <button
                onClick={sendOrderToBackend}
                disabled={!canSend}
                className="w-full bg-white/20 hover:bg-white/30 text-white font-bold py-2 rounded-xl shadow transition-all duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                📨 Envoyer au commerçant
              </button>
            </div>
          </div>

          {/* Contenu */}
          <div className="p-6 h-[calc(100%-140px)] overflow-y-auto">
            {cart.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingCart size={80} className="mx-auto text-gray-300 mb-6" />
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Panier vide</h3>
                <p className="text-gray-600 mb-8">Ajoutez des gabarits pour commencer</p>
                <button
                  onClick={onClose}
                  className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                >
                  Parcourir les produits
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item, idx) => (
                  <div
                    key={`${item.id}-${item.size}-${idx}`}
                    className="bg-white rounded-2xl p-4 shadow-lg border-2 border-gray-100"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-xl">{item.series}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-bold text-gray-900">{item.name}</h4>
                          <button
                            onClick={() => onRemoveFromCart(item.id, item.size)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <X size={18} />
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-3">
                            <span className="text-sm text-gray-500">Taille:</span>
                            <span className="px-3 py-1 bg-gray-100 rounded-lg font-bold">
                              {item.size}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2 bg-gray-100 rounded-xl p-1">
                              <button
                                onClick={() => onUpdateQuantity(item.id, item.size, -1)}
                                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="font-bold min-w-[30px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => onUpdateQuantity(item.id, item.size, 1)}
                                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <span className="text-xl font-bold text-amber-600">
                              {item.quantity * cartTotal.pricePerUnit}€
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer du panier */}
          {cart.length > 0 && (
            <div className="border-t border-gray-200 p-6">
              {/* Progression remise */}
              <div className="mb-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-gray-700">
                      {`Progression vers ${cartTotal.nextTarget || 20}+ pièces`}
                    </span>
                    <span className="font-bold text-amber-600">
                      {cartTotal.totalItems}/{cartTotal.nextTarget || 20}
                    </span>
                  </div>
                  <ProgressBar current={cartTotal.totalItems} target={cartTotal.nextTarget || 20} />
                </div>
                {cartTotal.nextTarget && (
                  <p className="text-sm text-amber-600 font-semibold text-center mt-2">
                    Plus que {cartTotal.nextTarget - cartTotal.totalItems} pour{' '}
                    {cartTotal.nextTarget >= 20 ? '85€/pièce' : '90€/pièce'}
                  </p>
                )}
              </div>

              {/* Total */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Sous-total</span>
                  <span className="font-bold">{cartTotal.totalItems * 100}€</span>
                </div>
                {cartTotal.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Remise volume</span>
                    <span className="font-bold">-{cartTotal.discount}€</span>
                  </div>
                )}
                <div className="border-t border-gray-300 pt-3 flex justify-between text-xl">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-amber-600">{cartTotal.subtotal}€</span>
                </div>
              </div>

              {/* Infos client */}
              <div className="space-y-3 mb-6">
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  onBlur={() => setClientName(clientName.trim())}
                  placeholder="Nom du client (requis)"
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 outline-none transition-all text-sm"
                />
                {nameError && <p className="text-red-600 text-xs">Nom requis pour envoyer</p>}
                <input
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  onBlur={handlePhoneBlur}
                  placeholder="Téléphone (requis)"
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 outline-none transition-all text-sm"
                />
                {phoneError && (
                  <p className="text-red-600 text-xs">Téléphone invalide, exemple +33XXXXXXXXX</p>
                )}
                {!phoneError && cleanedPhone && (
                  <p className="text-gray-500 text-xs">Format international détecté</p>
                )}
                {!phoneError && cleanedPhone && (
                  <p className="text-gray-500 text-xs">
                    Numéro utilisé: {normalizePhone(clientPhone)}
                  </p>
                )}
                <textarea
                  value={clientNotes}
                  onChange={(e) => setClientNotes(e.target.value)}
                  placeholder="Notes pour le commerçant (optionnel)"
                  rows={3}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 outline-none transition-all text-sm"
                />
              </div>

              {/* Actions de commande */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={contactMerchant}
                  disabled={!canSend}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  💬 Contacter pour commander
                </button>
                <button
                  onClick={sendOrderToBackend}
                  disabled={!canSend}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-3 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  📨 Envoyer au commerçant
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============= COMPOSANT PRINCIPAL =============
function App() {
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeries, setSelectedSeries] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [viewMode, setViewMode] = useState('carousel');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [viewHistory, setViewHistory] = useState([]);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [toast, setToast] = useState(null);
  const [filters, setFilters] = useState({
    series: [],
    sizes: [],
    maxPrice: 200
  });
  const [showOrders, setShowOrders] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState(null);

  const products = useMemo(() => generateProducts(), []);
  const series = useMemo(() => [...new Set(products.map((p) => p.series))], [products]);

  const email = process.env.REACT_APP_ORDER_EMAIL || 'fadymezghani12345@gmail.com';
  const phone = process.env.REACT_APP_MERCHANT_PHONE || '+33759652867';
  const fbUrl = process.env.REACT_APP_FACEBOOK_URL || 'https://facebook.com/';
  const igUrl = process.env.REACT_APP_INSTAGRAM_URL || 'https://instagram.com/';
  const liUrl = process.env.REACT_APP_LINKEDIN_URL || 'https://linkedin.com/';
  const waUrl = `https://wa.me/${phone.replace(/[^\\d]/g, '')}?text=${encodeURIComponent('Bonjour, j’\u00e9 une question sur la livraison')}`;

  // Persistance des données
  useEffect(() => {
    const saved = {
      cart: localStorage.getItem('gabarits-cart'),
      favorites: localStorage.getItem('gabarits-favorites'),
      history: localStorage.getItem('gabarits-history')
    };

    if (saved.cart) setCart(JSON.parse(saved.cart));
    if (saved.favorites) setFavorites(JSON.parse(saved.favorites));
    if (saved.history) setViewHistory(JSON.parse(saved.history));
  }, []);

  useEffect(() => {
    localStorage.setItem('gabarits-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('gabarits-favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('gabarits-history', JSON.stringify(viewHistory));
  }, [viewHistory]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadOrders = async () => {
    try {
      setOrdersLoading(true);
      setOrdersError(null);
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error('fetch_failed');
      setOrders(data.data || []);
    } catch (e) {
      setOrdersError(e.message || 'error');
    } finally {
      setOrdersLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchSeries = !selectedSeries || product.series === selectedSeries;
      const matchFilters =
        (filters.series.length === 0 || filters.series.includes(product.series)) &&
        (filters.sizes.length === 0 ||
          product.sizes.some((size) => filters.sizes.includes(size))) &&
        product.basePrice <= filters.maxPrice;

      return matchSearch && matchSeries && matchFilters;
    });
  }, [products, searchTerm, selectedSeries, filters]);

  const cartTotal = useMemo(() => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const pricePerUnit = totalItems >= 20 ? 85 : totalItems >= 10 ? 90 : 100;
    const subtotal = totalItems * pricePerUnit;
    const discount = totalItems * (100 - pricePerUnit);
    const nextTarget = totalItems < 10 ? 10 : totalItems < 20 ? 20 : null;

    return { totalItems, pricePerUnit, subtotal, discount, nextTarget };
  }, [cart]);

  const addToCart = (product, size) => {
    const existingItem = cart.find((item) => item.id === product.id && item.size === size);

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          ...product,
          size,
          quantity: 1,
          addedAt: new Date().toISOString()
        }
      ]);
    }

    showToast(`🎉 ${product.name} (${size}) ajouté au panier`);
    setShowCart(true);
  };

  const updateQuantity = (productId, size, change) => {
    setCart(
      cart
        .map((item) => {
          if (item.id === productId && item.size === size) {
            const newQuantity = item.quantity + change;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (productId, size) => {
    setCart(cart.filter((item) => !(item.id === productId && item.size === size)));
    showToast('🗑️ Produit retiré du panier', 'error');
  };

  const toggleFavorite = (productId) => {
    setFavorites((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleProductView = (product) => {
    setViewHistory((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      return [product, ...filtered].slice(0, 6);
    });
  };

  const handleCheckout = () => {
    setShowOrderConfirmation(true);
    setShowCart(false);
    showToast('🎊 Commande validée avec succès !');
  };

  const handleSearchSelect = (product) => {
    setSearchTerm('');
    handleProductView(product);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {showOrderConfirmation && (
        <OrderConfirmation order={cartTotal} onClose={() => setShowOrderConfirmation(false)} />
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b-4 border-amber-500 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl">
                  <span className="text-white font-bold text-2xl">G</span>
                </div>
                <div className="absolute -top-2 -right-2">
                  <Sparkles size={16} className="text-yellow-400" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Gabarits.fr
                </h1>
                <p className="text-xs text-gray-600 flex items-center">
                  <Award size={12} className="mr-1 text-amber-600" />
                  Sellerie Auto & Moto Premium
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCart(true)}
                className="relative bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-3 rounded-2xl font-bold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center space-x-3"
              >
                <ShoppingCart size={20} />
                <span>Panier</span>
                {cart.length > 0 && (
                  <span className="absolute -top-3 -right-3 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold shadow-lg">
                    {cartTotal.totalItems}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  setShowOrders(true);
                  loadOrders();
                }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                📜 Commandes
              </button>

              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>

          {/* Barre de recherche */}
          <div className="mt-6 relative">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-600"
                size={20}
              />
              <input
                type="text"
                placeholder="🔍 Rechercher un gabarit, une série..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-2xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 outline-none transition-all text-lg shadow-lg"
              />
              <SearchSuggestions
                searchTerm={searchTerm}
                products={products}
                onSelect={handleSearchSelect}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation des séries */}
      <div className="bg-gradient-to-r from-white to-amber-50 border-b-2 border-gray-100 sticky top-24 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              {selectedSeries ? `Série ${selectedSeries}` : 'Toutes les séries'}
            </h2>
            <div className="flex space-x-3">
              <button
                onClick={() => setViewMode('carousel')}
                className={`px-5 py-2 rounded-xl font-bold transition-all duration-300 shadow-lg ${
                  viewMode === 'carousel'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-500/50'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                🎡 Carrousel 3D
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-5 py-2 rounded-xl font-bold transition-all duration-300 shadow-lg ${
                  viewMode === 'grid'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-500/50'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                📊 Grille
              </button>
            </div>
          </div>

          <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setSelectedSeries('')}
              className={`px-5 py-3 rounded-xl font-semibold whitespace-nowrap transition-all duration-300 ${
                selectedSeries === ''
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg'
                  : 'bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200'
              }`}
            >
              ✨ Toutes
            </button>
            {series.map((s) => {
              const seriesCount = products.filter((p) => p.series === s).length;
              return (
                <button
                  key={s}
                  onClick={() => setSelectedSeries(s)}
                  className={`px-5 py-3 rounded-xl font-semibold whitespace-nowrap transition-all duration-300 flex items-center space-x-2 ${
                    selectedSeries === s
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg'
                      : 'bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200'
                  }`}
                >
                  <span>Série {s}</span>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{seriesCount}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {showMobileMenu && (
        <div className="lg:hidden bg-white border-b shadow-xl">
          <div className="max-w-7xl mx-auto px-6 py-6 space-y-4">
            <div className="flex items-center space-x-3 text-gray-700 p-3 hover:bg-gray-50 rounded-xl">
              <Phone size={18} className="text-amber-600" />
              <span className="font-medium">01 23 45 67 89</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-700 p-3 hover:bg-gray-50 rounded-xl">
              <Mail size={18} className="text-amber-600" />
              <span className="font-medium">contact@gabarits.fr</span>
            </div>
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Bannière tarifs */}
        <div className="mb-12 bg-gradient-to-br from-amber-500 via-amber-600 to-orange-500 rounded-3xl p-8 text-white shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-4">💰 Tarifs Dégressifs</h2>
            <p className="text-amber-100 text-lg">
              Plus vous commandez, moins vous payez par pièce
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/20">
              <div className="text-center">
                <p className="text-5xl font-bold mb-2">100€</p>
                <p className="text-amber-100 font-semibold">1 - 9 pièces</p>
                <p className="text-sm text-amber-200 mt-2">Prix standard</p>
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/30 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-xl">
                  🏆 LE PLUS POPULAIRE
                </div>
              </div>
              <div className="text-center">
                <p className="text-5xl font-bold mb-2">90€</p>
                <p className="text-amber-100 font-semibold">10+ pièces</p>
                <p className="text-sm text-amber-200 mt-2">Économisez 10€/pièce</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/20">
              <div className="text-center">
                <p className="text-5xl font-bold mb-2">85€</p>
                <p className="text-amber-100 font-semibold">20+ pièces</p>
                <p className="text-sm text-amber-200 mt-2">Meilleur prix</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 text-center">
            <div className="flex items-center justify-center space-x-2">
              <Shield size={20} />
              <span>Garantie 2 ans</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Truck size={20} />
              <span>Livraison offerte</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Award size={20} />
              <span>Qualité premium</span>
            </div>
          </div>
        </div>

        {/* Filtres avancés */}
        <AdvancedFilters filters={filters} onFiltersChange={setFilters} series={series} />

        {/* Affichage des produits */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-2xl">
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Aucun gabarit trouvé</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              Essayez de modifier vos filtres ou de rechercher une autre série
            </p>
            <button
              onClick={() => {
                setSelectedSeries('');
                setFilters({ series: [], sizes: [], maxPrice: 200 });
                setSearchTerm('');
              }}
              className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : viewMode === 'carousel' ? (
          <BarrelCarousel
            products={filteredProducts}
            onAddToCart={addToCart}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onView={handleProductView}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                isFavorite={favorites.includes(product.id)}
                onToggleFavorite={toggleFavorite}
                onView={handleProductView}
              />
            ))}
          </div>
        )}

        {/* Historique des consultations */}
        {viewHistory.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center space-x-3">
                <Clock size={24} className="text-amber-600" />
                <span>Récemment consultés</span>
              </h3>
              <button
                onClick={() => setViewHistory([])}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Effacer l'historique
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {viewHistory.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleProductView(product)}
                  className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-2 border-gray-100 text-left group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">{product.series}</span>
                    </div>
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                      {product.series}
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-800 text-sm truncate mb-2">{product.name}</h4>
                  <p className="text-xs text-gray-600 truncate">{product.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-bold text-amber-600">{product.basePrice}€</span>
                    <ChevronRight size={14} className="text-gray-400 group-hover:text-amber-600" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* StorySlider (généré automatiquement) */}
      <StorySlider />

      {/* Panier */}
      <Cart
        cart={cart}
        cartTotal={cartTotal}
        onUpdateQuantity={updateQuantity}
        onRemoveFromCart={removeFromCart}
        onClose={() => setShowCart(false)}
        showCart={showCart}
        onCheckout={handleCheckout}
        showToast={showToast}
      />
      <OrdersPanel
        showOrders={showOrders}
        onClose={() => setShowOrders(false)}
        orders={orders}
        loading={ordersLoading}
        error={ordersError}
        onRefresh={loadOrders}
      />
      {/* Footer */}

      <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white mt-16">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">G</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-amber-400">Gabarits.fr</h3>
                  <p className="text-gray-400 text-sm">Sellerie premium</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Votre spécialiste en gabarits de sellerie auto et moto. Qualité française depuis
                2010.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Nos Séries</h4>
              <ul className="space-y-2">
                {series.slice(0, 4).map((s) => (
                  <li key={s}>
                    <button
                      onClick={() => setSelectedSeries(s)}
                      className="text-gray-400 hover:text-amber-400 transition-colors"
                    >
                      Série {s}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href={`mailto:${email}`}
                    className="text-gray-400 hover:text-amber-400 transition-colors"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-gray-400 hover:text-amber-400 transition-colors"
                  >
                    Livraison
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${email}?subject=${encodeURIComponent('Question FAQ')}`}
                    className="text-gray-400 hover:text-amber-400 transition-colors"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${email}?subject=${encodeURIComponent('Garantie')}`}
                    className="text-gray-400 hover:text-amber-400 transition-colors"
                  >
                    Garantie
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <Phone size={16} className="text-amber-400" />
                  <a
                    href={`tel:${phone}`}
                    className="text-gray-400 hover:text-amber-400 transition-colors"
                  >
                    {phone}
                  </a>
                </li>
                <li className="flex items-center space-x-3">
                  <Mail size={16} className="text-amber-400" />
                  <a
                    href={`mailto:${email}`}
                    className="text-gray-400 hover:text-amber-400 transition-colors"
                  >
                    {email}
                  </a>
                </li>
              </ul>
              <div className="mt-6">
                <p className="text-gray-400 text-sm">Suivez-nous :</p>
                <div className="flex space-x-3 mt-2">
                  <a
                    href={fbUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
                  >
                    <Facebook size={14} /> Facebook
                  </a>
                  <a
                    href={igUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
                  >
                    <Instagram size={14} /> Instagram
                  </a>
                  <a
                    href={liUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
                  >
                    <Linkedin size={14} /> LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 Gabarits.fr - Tous droits réservés. |
              <a href="/cgv" className="hover:text-amber-400 ml-2">
                CGV
              </a>{' '}
              |
              <a href="/mentions-legales" className="hover:text-amber-400 ml-2">
                Mentions légales
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
