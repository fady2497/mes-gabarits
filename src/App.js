import React, { useState, useMemo } from 'react';
import {
  ShoppingCart,
  Search,
  X,
  Plus,
  Minus,
  ChevronUp,
  ChevronDown,
  Star,
  Truck,
  Shield,
  Award,
  Menu,
  Phone,
  Mail,
  Heart,
  Filter
} from 'lucide-react';

// Composant Toast pour les notifications
const Toast = ({ message, type = 'success', onClose }) => (
  <div
    className={`fixed top-4 right-4 p-4 rounded-xl shadow-2xl z-50 animate-slide-in flex items-center space-x-3 ${
      type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`}
  >
    <span> {message} </span>
    <button onClick={onClose} className="text-white hover:text-gray-200">
      <X size={16} />
    </button>
  </div>
);
const ProductSkeleton = () => (
  <div className="bg-white rounded-xl border-2 border-gray-200 p-4 animate-pulse">
    <div className="bg-gray-300 h-48 rounded-lg mb-4"> </div>
    <div className="bg-gray-300 h-4 rounded mb-2"> </div>
    <div className="bg-gray-300 h-4 rounded w-3/4 mb-4"> </div>
    <div className="bg-gray-300 h-8 rounded mb-4"> </div>
    <div className="grid grid-cols-3 gap-2">
      <div className="bg-gray-300 h-10 rounded"> </div>
      <div className="bg-gray-300 h-10 rounded"> </div>
      <div className="bg-gray-300 h-10 rounded"> </div>
    </div>
  </div>
);

// Barre de progression pour la remise
const ProgressBar = ({ current, target }) => {
  const progress = Math.min((current / target) * 100, 100);

  return (
    <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
      <div
        className="bg-green-500 h-3 rounded-full transition-all duration-500"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

// Page de confirmation de commande
const OrderConfirmation = ({ order, onClose }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2"> Commande confirmée! </h3>
        <p className="text-gray-600 mb-4">
          {' '}
          Merci pour votre commande de {order.totalItems} gabarits{' '}
        </p>
        <p className="text-2xl font-bold text-amber-600 mb-6"> {order.total}€ </p>
        <button
          onClick={onClose}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition-colors"
        >
          Continuer mes achats
        </button>
      </div>
    </div>
  </div>
);
const SearchSuggestions = ({ searchTerm, products, onSelect, onClose }) => {
  const suggestions = useMemo(() => {
    if (!searchTerm) return [];
    return products
      .filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 5);
  }, [searchTerm, products]);

  if (!searchTerm || suggestions.length === 0) return null;

  return (
    <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-xl z-40 mt-1">
      {suggestions.map((product) => (
        <button
          key={product.id}
          onClick={() => onSelect(product)}
          className="w-full text-left p-3 hover:bg-gray-50 flex items-center space-x-3 border-b border-gray-100 last:border-b-0"
        >
          <span className="font-semibold text-amber-600 text-sm"> {product.name} </span>
          <span className="text-gray-600 text-xs flex-1 truncate"> {product.description} </span>
        </button>
      ))}
    </div>
  );
};

// Filtres avancés
const AdvancedFilters = ({ filters, onFiltersChange, series }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl p-4 shadow-lg mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-gray-700 font-semibold mb-4"
      >
        <Filter size={20} />
        <span> Filtres avancés </span>
      </button>
      {isOpen && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-down">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2"> Séries </label>{' '}
            <div className="space-y-2">
              {' '}
              {series.map((s) => (
                <label key={s} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.series.includes(s)}
                    onChange={(e) => {
                      const newSeries = e.target.checked
                        ? [...filters.series, s]
                        : filters.series.filter((series) => series !== s);
                      onFiltersChange({ ...filters, series: newSeries });
                    }}
                    className="rounded text-amber-600"
                  />
                  <span className="text-sm"> Série {s} </span>{' '}
                </label>
              ))}{' '}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2"> Tailles </label>{' '}
            <div className="space-y-2">
              {' '}
              {['S', 'M', 'L'].map((size) => (
                <label key={size} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.sizes.includes(size)}
                    onChange={(e) => {
                      const newSizes = e.target.checked
                        ? [...filters.sizes, size]
                        : filters.sizes.filter((s) => s !== size);
                      onFiltersChange({ ...filters, sizes: newSizes });
                    }}
                    className="rounded text-amber-600"
                  />
                  <span className="text-sm"> Taille {size} </span>{' '}
                </label>
              ))}{' '}
            </div>{' '}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prix: Jusqu 'à {filters.maxPrice}€{' '}
            </label>{' '}
            <input
              type="range"
              min="0"
              max="200"
              value={filters.maxPrice}
              onChange={(e) => onFiltersChange({ ...filters, maxPrice: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>{' '}
        </div>
      )}{' '}
    </div>
  );
};

const generateProducts = () => {
  const series = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const products = [];

  series.forEach((letter) => {
    const count = letter === 'G' ? 6 : 4;
    for (let i = 1; i <= count; i++) {
      const modelNum = String(i).padStart(3, '0');
      let description = '';

      if (letter === 'A') {
        description = `Traçage couture professionnel`;
      } else if (letter === 'G') {
        description = `Motif nid d'abeille premium`;
      } else {
        description = `Gabarit série ${letter} expert`;
      }

      products.push({
        id: `${letter}-${modelNum}`,
        series: letter,
        model: modelNum,
        name: `${letter}-${modelNum}`,
        description,
        basePrice: 80 + Math.floor(Math.random() * 40),
        sizes: ['S', 'M', 'L'],
        rating: (4 + Math.random()).toFixed(1),
        popular: i <= 2
      });
    }
  });

  return products;
};

const ProductCard = ({
  product,
  onAddToCart,
  isCarousel = false,
  isFavorite,
  onToggleFavorite,
  onView
}) => (
  <div
    className={`bg-white rounded-xl lg:rounded-2xl transition-all duration-300 hover:scale-105 ${
      isCarousel
        ? 'border-2 lg:border-4 border-amber-500 shadow-xl lg:shadow-2xl'
        : 'border border-gray-200 lg:border-2 hover:border-amber-400 shadow-lg lg:shadow-xl hover:shadow-2xl'
    } overflow-hidden group mx-2 lg:mx-0`}
    onClick={() => onView(product)}
  >
    {' '}
    {product.popular && (
      <div className="absolute top-2 lg:top-4 left-2 lg:left-4 z-10">
        <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-2 lg:px-3 py-1 rounded-full text-xs font-bold shadow flex items-center">
          <Star size={10} className="mr-1" />
          POPULAIRE{' '}
        </div>{' '}
      </div>
    )}
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggleFavorite(product.id);
      }}
      className="absolute top-2 lg:top-4 right-2 lg:right-4 z-10 text-gray-400 hover:text-red-500 transition-colors"
    >
      <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />{' '}
    </button>
    <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-4 lg:p-6 relative overflow-hidden">
      <div className="flex items-center justify-between relative z-10">
        <span className="text-2xl lg:text-4xl font-bold text-white drop-shadow">
          {' '}
          {product.series}{' '}
        </span>{' '}
        <div className="text-right">
          <span className="bg-white/90 backdrop-blur-sm px-3 lg:px-4 py-1 lg:py-2 rounded-full text-amber-700 text-sm lg:text-lg font-mono font-bold block shadow">
            {' '}
            {product.model}{' '}
          </span>{' '}
          <div className="flex items-center justify-end mt-1 lg:mt-2 space-x-1">
            <Star size={12} className="text-yellow-300 fill-current" />
            <span className="text-white text-xs lg:text-sm font-semibold">
              {' '}
              {product.rating}{' '}
            </span>{' '}
          </div>{' '}
        </div>{' '}
      </div>{' '}
    </div>
    <div className="p-4 lg:p-6 bg-white">
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg lg:rounded-xl h-32 lg:h-48 mb-3 lg:mb-4 border border-gray-200 lg:border-2 flex items-center justify-center overflow-hidden shadow-inner">
        <div className="text-amber-600 text-xs lg:text-sm font-semibold text-center px-2">
          Illustration gabarit série {product.series}{' '}
        </div>{' '}
      </div>
      <h3 className="text-lg lg:text-xl font-bold text-gray-800 mb-1 lg:mb-2 group-hover:text-amber-600 transition-colors">
        {' '}
        {product.name}{' '}
      </h3>{' '}
      <p className="text-xs lg:text-sm text-gray-600 mb-3 lg:mb-4 leading-tight lg:leading-relaxed">
        {' '}
        {product.description}{' '}
      </p>
      <div className="flex items-center justify-between mb-3 lg:mb-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg lg:rounded-xl p-3 lg:p-4 border border-amber-200 lg:border-2">
        <div>
          <span className="text-xl lg:text-3xl font-bold text-amber-600">
            {' '}
            {product.basePrice}€{' '}
          </span>{' '}
          <span className="text-xs text-gray-600 block mt-1"> unité </span>{' '}
        </div>{' '}
        <div className="text-right">
          <div className="text-xs lg:text-sm text-gray-700">
            10 +: <span className="text-green-600 font-bold text-sm lg:text-lg"> 90€ </span>{' '}
          </div>{' '}
        </div>{' '}
      </div>
      <div className="space-y-2 lg:space-y-3">
        <p className="text-xs lg:text-sm text-gray-700 font-semibold flex items-center">
          <Plus size={14} className="mr-1 lg:mr-2 text-amber-600" />
          Tailles:
        </p>{' '}
        <div className="grid grid-cols-3 gap-2">
          {' '}
          {product.sizes.map((size) => (
            <button
              key={size}
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product, size);
              }}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-2 lg:py-3 rounded-lg lg:rounded-xl transition-all duration-300 shadow hover:shadow-lg hover:scale-105 flex flex-col items-center justify-center text-sm lg:text-base"
            >
              <Plus size={14} className="mb-1" />
              <span> {size} </span>{' '}
            </button>
          ))}{' '}
        </div>{' '}
      </div>{' '}
    </div>{' '}
  </div>
);

const BarrelCarousel = ({ products, onAddToCart, favorites, onToggleFavorite, onView }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  if (!products || products.length === 0) return null;

  const handleScroll = (direction) => {
    if (isAnimating) return;
    setIsAnimating(true);

    if (direction === 'up') {
      setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
    } else {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }

    setTimeout(() => setIsAnimating(false), 500);
  };

  const getVisibleProducts = () => {
    const visible = []; // ← "const" écrit correctement sur une seule ligne
    const isMobile = window.innerWidth < 768;
    const range = isMobile ? 0 : 1;

    for (let i = -range; i <= range; i++) {
      const index = (currentIndex + i + products.length) % products.length;
      visible.push({
        product: products[index],
        offset: i,
        key: `${products[index].id}-${currentIndex}-${i}`
      });
    }
    return visible;
  };

  const visibleProducts = getVisibleProducts();
  const isMobile = window.innerWidth < 768;

  return (
    <div className="relative w-full py-8 lg:py-16 bg-gradient-to-b from-gray-50 to-white rounded-xl lg:rounded-3xl">
      {' '}
      {!isMobile && (
        <div className="hidden lg:flex flex-col items-center space-y-4 absolute left-1/2 -translate-x-1/2 top-6">
          <button
            onClick={() => handleScroll('up')}
            disabled={isAnimating}
            className="bg-gradient-to-b from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 text-white p-3 lg:p-4 rounded-2xl shadow-xl transition-all duration-300 hover:scale-110"
          >
            <ChevronUp size={24} strokeWidth={3} />{' '}
          </button>{' '}
        </div>
      )}
      <div
        className={`relative ${isMobile ? 'min-h-[400px]' : 'min-h-[500px]'} flex items-center justify-center`}
        style={{ perspective: isMobile ? '1000px' : '2000px' }}
      >
        <div
          className={`relative w-full ${isMobile ? 'h-[350px]' : 'h-[400px]'} flex items-center justify-center`}
        >
          {' '}
          {visibleProducts.map(({ product, offset, key }) => {
            const isCenter = offset === 0;
            const rotationX = isMobile ? offset * 15 : offset * 30;
            const translateY = isMobile ? offset * 100 : offset * 180;
            const translateZ = isCenter ? 0 : isMobile ? -50 : -120;
            const scale = isCenter ? 1 : isMobile ? 0.85 : 0.75;
            const opacity = isCenter ? 1 : isMobile ? 0.3 : 0.4;

            return (
              <div
                key={key}
                className="absolute w-full flex justify-center transition-all duration-500 ease-in-out"
                style={{
                  transform: `translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotationX}deg) scale(${scale})`,
                  opacity,
                  zIndex: isCenter ? 20 : 10 - Math.abs(offset),
                  pointerEvents: isCenter ? 'auto' : 'none',
                  transformStyle: 'preserve-3d'
                }}
              >
                <ProductCard
                  product={product}
                  onAddToCart={onAddToCart}
                  isCarousel={true}
                  isFavorite={favorites.includes(product.id)}
                  onToggleFavorite={onToggleFavorite}
                  onView={onView}
                />{' '}
              </div>
            );
          })}{' '}
        </div>{' '}
      </div>
      {!isMobile && (
        <div className="hidden lg:flex flex-col items-center space-y-4 absolute left-1/2 -translate-x-1/2 bottom-6">
          <div className="text-amber-600 text-sm font-semibold bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow">
            {' '}
            {currentIndex + 1}/ {products.length}{' '}
          </div>{' '}
          <button
            onClick={() => handleScroll('down')}
            disabled={isAnimating}
            className="bg-gradient-to-t from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 text-white p-3 lg:p-4 rounded-2xl shadow-xl transition-all duration-300 hover:scale-110"
          >
            <ChevronDown size={24} strokeWidth={3} />{' '}
          </button>{' '}
        </div>
      )}
      <div className="flex lg:hidden justify-center items-center space-x-6 mt-6">
        <button
          onClick={() => handleScroll('up')}
          disabled={isAnimating}
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 text-white p-3 rounded-xl shadow-lg active:scale-95 transition-all"
        >
          <ChevronUp size={20} strokeWidth={3} />{' '}
        </button>
        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow">
          <div className="text-gray-700 font-bold">
            {' '}
            {currentIndex + 1}/ {products.length}{' '}
          </div>{' '}
        </div>
        <button
          onClick={() => handleScroll('down')}
          disabled={isAnimating}
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 text-white p-3 rounded-xl shadow-lg active:scale-95 transition-all"
        >
          <ChevronDown size={20} strokeWidth={3} />{' '}
        </button>{' '}
      </div>{' '}
    </div>
  );
};

const Cart = ({
  cart,
  cartTotal,
  onUpdateQuantity,
  onRemoveFromCart,
  onClose,
  showCart,
  onCheckout
}) => {
  if (!showCart) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto border-l-2 lg:border-l-4 border-amber-500 shadow-2xl">
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-4 lg:p-6 flex items-center justify-between shadow-lg">
          <h2 className="text-xl lg:text-2xl font-bold text-white flex items-center">
            <ShoppingCart size={20} className="mr-2 lg:mr-3" />
            Votre Panier{' '}
          </h2>{' '}
          <button onClick={onClose} className="text-white hover:text-amber-100 transition-colors">
            <X size={24} />{' '}
          </button>{' '}
        </div>
        <div className="p-4 lg:p-6 space-y-4">
          {' '}
          {cart.length === 0 ? (
            <div className="text-center py-12 lg:py-20">
              <ShoppingCart size={60} className="mx-auto text-gray-300 mb-4 lg:mb-6" />
              <p className="text-lg lg:text-xl font-semibold text-gray-800 mb-2">
                {' '}
                Votre panier est vide{' '}
              </p>{' '}
              <p className="text-gray-600 text-sm lg:text-base">
                {' '}
                Ajoutez des gabarits pour commencer{' '}
              </p>{' '}
            </div>
          ) : (
            <>
              {cart.map((item, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-50 to-white rounded-xl lg:rounded-2xl p-3 lg:p-4 border border-gray-200 lg:border-2 shadow-lg"
                >
                  <div className="flex items-start justify-between mb-2 lg:mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-base lg:text-lg">
                        {' '}
                        {item.name}{' '}
                      </h3>{' '}
                      <p className="text-xs lg:text-sm text-gray-600">
                        {' '}
                        Taille: <span className="font-semibold"> {item.size} </span>
                      </p>
                    </div>{' '}
                    <button
                      onClick={() => onRemoveFromCart(item.id, item.size)}
                      className="text-red-500 hover:text-red-600 transition-colors ml-2 lg:ml-4"
                    >
                      <X size={16} />{' '}
                    </button>{' '}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 bg-white rounded-lg lg:rounded-xl border border-gray-300 lg:border-2 shadow-sm">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.size, -1)}
                        className="p-1 lg:p-2 hover:bg-gray-100 rounded-l-lg lg:rounded-l-xl transition-colors"
                      >
                        <Minus size={14} className="text-gray-700" />
                      </button>{' '}
                      <span className="font-bold text-gray-800 min-w-[30px] lg:min-w-[40px] text-center text-sm lg:text-lg">
                        {' '}
                        {item.quantity}{' '}
                      </span>{' '}
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.size, 1)}
                        className="p-1 lg:p-2 hover:bg-gray-100 rounded-r-lg lg:rounded-r-xl transition-colors"
                      >
                        <Plus size={14} className="text-gray-700" />
                      </button>{' '}
                    </div>{' '}
                    <span className="font-bold text-amber-600 text-base lg:text-xl">
                      {' '}
                      {item.quantity * cartTotal.pricePerUnit}€{' '}
                    </span>{' '}
                  </div>{' '}
                </div>
              ))}
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-amber-300 lg:border-2 shadow-xl">
                <div className="space-y-3 lg:space-y-4 mb-4 lg:mb-6">
                  <div className="flex justify-between text-gray-700 text-sm lg:text-lg">
                    <span> Quantité totale: </span>{' '}
                    <span className="font-bold">
                      {' '}
                      {cartTotal.totalItems}
                      pièces{' '}
                    </span>{' '}
                  </div>{' '}
                  <div className="flex justify-between text-gray-700 text-sm lg:text-lg">
                    <span> Prix unitaire: </span>{' '}
                    <span className="font-bold"> {cartTotal.pricePerUnit}€ </span>{' '}
                  </div>{' '}
                  {cartTotal.discount > 0 && (
                    <div className="flex justify-between text-green-600 text-sm lg:text-lg">
                      <span className="font-semibold"> Remise: </span>{' '}
                      <span className="font-bold"> -{cartTotal.discount}€ </span>{' '}
                    </div>
                  )}{' '}
                  <div className="border-t border-amber-300 lg:border-t-2 pt-3 lg:pt-4 flex justify-between text-lg lg:text-2xl">
                    <span className="font-bold text-gray-800"> Total: </span>{' '}
                    <span className="font-bold text-amber-600"> {cartTotal.subtotal}€ </span>{' '}
                  </div>{' '}
                </div>
                {cartTotal.totalItems > 0 && (
                  <div className="mb-3 lg:mb-4">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span> Progression vers la remise: </span>{' '}
                      <span>
                        {' '}
                        {cartTotal.totalItems}
                        /10
                      </span>
                    </div>{' '}
                    <ProgressBar current={cartTotal.totalItems} target={10} />{' '}
                  </div>
                )}
                {cartTotal.totalItems >= 10 && (
                  <div className="mb-3 lg:mb-4 bg-green-100 border border-green-400 lg:border-2 rounded-lg lg:rounded-xl p-3 text-center">
                    <p className="text-green-700 font-bold text-sm lg:text-lg">
                      {' '}
                      🎉Remise appliquée!
                    </p>{' '}
                  </div>
                )}
                {cartTotal.totalItems < 10 && cartTotal.totalItems > 0 && (
                  <div className="mb-3 lg:mb-4 bg-amber-100 border border-amber-400 lg:border-2 rounded-lg lg:rounded-xl p-3 text-center">
                    <p className="text-amber-800 text-sm lg:text-base">
                      Plus que <strong> {10 - cartTotal.totalItems} </strong> pour -10€/pièce{' '}
                    </p>{' '}
                  </div>
                )}
                <button
                  onClick={onCheckout}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 lg:py-4 rounded-xl lg:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 text-base lg:text-xl"
                >
                  {' '}
                  🚀Commander{' '}
                </button>{' '}
              </div>{' '}
            </>
          )}{' '}
        </div>{' '}
      </div>{' '}
    </div>
  );
};

function App() {
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeries, setSelectedSeries] = useState('A');
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

  const products = useMemo(() => generateProducts(), []);
  const series = useMemo(() => [...new Set(products.map((p) => p.series))], [products]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchSeries = selectedSeries ? product.series === selectedSeries : true;
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
    const pricePerUnit = totalItems >= 10 ? 90 : 100;
    const subtotal = totalItems * pricePerUnit;
    const discount = totalItems >= 10 ? totalItems * 10 : 0;
    return { totalItems, pricePerUnit, subtotal, discount };
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
      setCart([...cart, { ...product, size, quantity: 1 }]);
    }
    showToast(`${product.name} (${size}) ajouté au panier`);
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
    showToast('Produit retiré du panier', 'error');
  };

  const toggleFavorite = (productId) => {
    setFavorites((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleProductView = (product) => {
    setViewHistory((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      return [product, ...filtered].slice(0, 5);
    });
  };

  const handleCheckout = () => {
    setShowOrderConfirmation(true);
    setShowCart(false);
    setCart([]);
  };

  const handleSearchSelect = (product) => {
    setSearchTerm(product.name);
    handleProductView(product);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50">
      {' '}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {showOrderConfirmation && (
        <OrderConfirmation order={cartTotal} onClose={() => setShowOrderConfirmation(false)} />
      )}
      <header className="bg-white/95 backdrop-blur-sm border-b-2 lg:border-b-4 border-amber-500 shadow-lg lg:shadow-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-3 lg:py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 lg:space-x-4">
              <div className="w-10 h-10 lg:w-16 lg:h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg lg:rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg lg:text-2xl"> G </span>{' '}
              </div>{' '}
              <div>
                <h1 className="text-xl lg:text-3xl font-bold text-gray-800 bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                  Gabarits.fr{' '}
                </h1>{' '}
                <p className="text-xs text-gray-600 hidden lg:flex items-center">
                  <Award size={12} className="mr-1 text-amber-600" />
                  Sellerie Auto & Moto Premium{' '}
                </p>{' '}
              </div>{' '}
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowCart(true)}
                className="relative bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-3 lg:px-6 py-2 lg:py-3 rounded-lg lg:rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center space-x-2"
              >
                <ShoppingCart size={18} /> <span className="hidden lg:inline"> Panier </span>{' '}
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-lg">
                    {' '}
                    {cartTotal.totalItems}{' '}
                  </span>
                )}{' '}
              </button>
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden bg-gray-100 p-2 rounded-lg"
              >
                <Menu size={20} />{' '}
              </button>{' '}
            </div>{' '}
          </div>
          <div className="mt-3 lg:mt-6 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600"
              size={18}
            />{' '}
            <input
              type="text"
              placeholder="🔍 Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 lg:py-3 border border-gray-300 lg:border-2 rounded-lg lg:rounded-xl focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-sm lg:text-base shadow"
            />
            <SearchSuggestions
              searchTerm={searchTerm}
              products={products}
              onSelect={handleSearchSelect}
              onClose={() => setSearchTerm('')}
            />{' '}
          </div>{' '}
        </div>{' '}
      </header>
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 lg:border-b-2 shadow-sm sticky top-20 lg:top-28 z-40">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-3 lg:py-5">
          <div className="flex items-center justify-between mb-3 lg:mb-4">
            <h2 className="text-lg lg:text-2xl font-bold text-gray-800">
              {' '}
              📂Série: <span className="text-amber-600"> {selectedSeries} </span>{' '}
            </h2>{' '}
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('carousel')}
                className={`px-3 py-1 lg:px-5 lg:py-2 rounded-lg lg:rounded-xl font-semibold transition-all duration-300 shadow ${
                  viewMode === 'carousel'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white scale-105'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <span className="hidden lg:inline"> 🎡Barillet </span>{' '}
                <span className="lg:hidden"> 🎡 </span>{' '}
              </button>{' '}
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 lg:px-5 lg:py-2 rounded-lg lg:rounded-xl font-semibold transition-all duration-300 shadow ${
                  viewMode === 'grid'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white scale-105'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <span className="hidden lg:inline"> 📊Grille </span>{' '}
                <span className="lg:hidden"> 📊 </span>{' '}
              </button>{' '}
            </div>{' '}
          </div>
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setSelectedSeries('')}
              className={`px-3 py-2 rounded-lg font-semibold whitespace-nowrap transition-all duration-300 shadow ${
                selectedSeries === ''
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              Toutes{' '}
            </button>{' '}
            {series.map((s) => {
              const seriesProducts = products.filter((p) => p.series === s);
              const isSelected = selectedSeries === s;
              return (
                <button
                  key={s}
                  onClick={() => setSelectedSeries(s)}
                  className={`px-3 py-2 lg:px-4 lg:py-2 rounded-lg font-semibold whitespace-nowrap transition-all duration-300 shadow ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white scale-105'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  <span className="text-sm lg:text-base"> Série {s} </span>{' '}
                  <span className="ml-1 lg:ml-2 text-xs opacity-80">
                    {' '}
                    ({seriesProducts.length}){' '}
                  </span>{' '}
                </button>
              );
            })}{' '}
          </div>{' '}
        </div>{' '}
      </div>
      {/* Menu mobile */}{' '}
      {showMobileMenu && (
        <div className="lg:hidden bg-white border-b shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-3">
            <div className="flex items-center space-x-3 text-gray-700">
              <Phone size={16} className="text-amber-600" />
              <span className="text-sm"> 01 23 45 67 89 </span>{' '}
            </div>{' '}
            <div className="flex items-center space-x-3 text-gray-700">
              <Mail size={16} className="text-amber-600" />
              <span className="text-sm"> contact @gabarits.fr </span>{' '}
            </div>{' '}
          </div>{' '}
        </div>
      )}
      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-6 lg:py-10">
        {' '}
        {/* Filtres avancés */}{' '}
        <AdvancedFilters filters={filters} onFiltersChange={setFilters} series={series} />
        {/* Bannière tarifs */}{' '}
        <div className="mb-8 lg:mb-12 bg-gradient-to-br from-white to-amber-50 rounded-xl lg:rounded-3xl border-2 lg:border-4 border-amber-500 p-4 lg:p-8 shadow-xl">
          <h2 className="text-xl lg:text-3xl font-bold text-gray-800 mb-4 lg:mb-6 text-center">
            {' '}
            💰Tarifs Dégressifs{' '}
          </h2>{' '}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6 mb-4 lg:mb-6">
            <div className="bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg lg:rounded-2xl p-3 lg:p-6 border border-amber-300 text-center shadow">
              <p className="text-2xl lg:text-4xl font-bold text-amber-700"> 100€ </p>{' '}
              <p className="text-sm lg:text-lg text-amber-800 font-semibold"> 1 - 9 pièces </p>{' '}
            </div>{' '}
            <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-lg lg:rounded-2xl p-3 lg:p-6 border border-green-300 text-center shadow relative">
              <div className="absolute -top-2 -right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                POPULAIRE{' '}
              </div>{' '}
              <p className="text-2xl lg:text-4xl font-bold text-green-700"> 90€ </p>{' '}
              <p className="text-sm lg:text-lg text-green-800 font-semibold"> 10 + pièces </p>{' '}
            </div>{' '}
            <div className="col-span-2 lg:col-span-1 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg lg:rounded-2xl p-3 lg:p-6 border border-blue-300 text-center shadow">
              <p className="text-2xl lg:text-4xl font-bold text-blue-700"> 85€ </p>{' '}
              <p className="text-sm lg:text-lg text-blue-800 font-semibold"> 50 + pièces </p>{' '}
            </div>{' '}
          </div>{' '}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4 text-center">
            <div className="flex items-center justify-center space-x-2 text-gray-700 text-sm">
              <Shield size={16} className="text-amber-600" />
              <span> Garantie 2 ans </span>{' '}
            </div>{' '}
            <div className="flex items-center justify-center space-x-2 text-gray-700 text-sm">
              <Truck size={16} className="text-amber-600" />
              <span> Livraison offerte </span>{' '}
            </div>{' '}
            <div className="flex items-center justify-center space-x-2 text-gray-700 text-sm">
              <Award size={16} className="text-amber-600" />
              <span> Qualité premium </span>{' '}
            </div>{' '}
          </div>{' '}
        </div>
        {/* Produits */}{' '}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 lg:py-20 bg-white rounded-xl lg:rounded-3xl shadow-xl">
            <div className="text-4xl lg:text-6xl mb-4 lg:mb-6"> 🔍 </div>{' '}
            <p className="text-lg lg:text-2xl font-bold text-gray-800 mb-2 lg:mb-4">
              {' '}
              Aucun gabarit trouvé{' '}
            </p>{' '}
            <p className="text-gray-600 text-sm lg:text-base">
              {' '}
              Essayez une autre série ou modifiez vos filtres{' '}
            </p>{' '}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
            {' '}
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                isFavorite={favorites.includes(product.id)}
                onToggleFavorite={toggleFavorite}
                onView={handleProductView}
              />
            ))}{' '}
          </div>
        )}{' '}
      </main>
      <Cart
        cart={cart}
        cartTotal={cartTotal}
        onUpdateQuantity={updateQuantity}
        onRemoveFromCart={removeFromCart}
        onClose={() => setShowCart(false)}
        onCheckout={handleCheckout}
        showCart={showCart}
      />
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white mt-12 lg:mt-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8 lg:py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <div>
              <h3 className="text-lg lg:text-2xl font-bold text-amber-400 mb-3 lg:mb-4">
                {' '}
                Gabarits.fr{' '}
              </h3>{' '}
              <p className="text-gray-300 text-sm lg:text-base leading-relaxed">
                Votre spécialiste en gabarits de sellerie auto et moto.{' '}
              </p>{' '}
            </div>{' '}
            <div>
              <h4 className="text-base lg:text-lg font-semibold mb-2 lg:mb-4"> Produits </h4>{' '}
              <ul className="space-y-1 lg:space-y-2 text-gray-300 text-sm lg:text-base">
                <li> Série A </li> <li> Série G </li> <li> Nouveautés </li>{' '}
              </ul>{' '}
            </div>{' '}
            <div>
              <h4 className="text-base lg:text-lg font-semibold mb-2 lg:mb-4"> Support </h4>{' '}
              <ul className="space-y-1 lg:space-y-2 text-gray-300 text-sm lg:text-base">
                <li> Contact </li> <li> Livraison </li> <li> FAQ </li>{' '}
              </ul>{' '}
            </div>{' '}
            <div>
              <h4 className="text-base lg:text-lg font-semibold mb-2 lg:mb-4"> Contact </h4>{' '}
              <ul className="space-y-1 lg:space-y-2 text-gray-300 text-sm lg:text-base">
                <li className="flex items-center">
                  <Phone size={14} className="mr-2" />
                  01 23 45 67 89{' '}
                </li>{' '}
                <li className="flex items-center">
                  <Mail size={14} className="mr-2" />
                  contact @gabarits.fr{' '}
                </li>{' '}
              </ul>{' '}
            </div>{' '}
          </div>{' '}
          <div className="border-t border-gray-700 mt-6 lg:mt-8 pt-6 lg:pt-8 text-center">
            <p className="text-gray-400 text-sm lg:text-base">
              {' '}
              ©2024 Gabarits.fr - Tous droits réservés{' '}
            </p>{' '}
          </div>{' '}
        </div>{' '}
      </footer>{' '}
    </div>
  );
}

export default App;
