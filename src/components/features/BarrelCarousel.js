import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import ProductCard from './ProductCard';

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

export default BarrelCarousel;
