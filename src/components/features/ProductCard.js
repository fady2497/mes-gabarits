import React from 'react';
import { Star, Heart, Plus } from 'lucide-react';

const ProductCard = ({
  product,
  onAddToCart,
  isCarousel = false,
  isFavorite,
  onToggleFavorite,
  onView
}) => (
  <div
    className={`bg-white rounded-xl lg:rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
      isCarousel
        ? 'border-2 lg:border-3 border-amber-500 shadow-xl lg:shadow-2xl'
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
      <Heart size={10} fill={isFavorite ? 'currentColor' : 'none'} />{' '}
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
        {product.image ? (
          <img
            src={product.image}
            alt={`Série ${product.series} ${product.model}`}
            className="w-full h-full object-contain select-none"
            draggable="false"
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            style={{ clipPath: 'inset(3% 3% 3% 3%)' }}
          />
        ) : (
          <div className="text-amber-600 text-xs lg:text-sm font-semibold text-center px-2">
            Illustration gabarit série {product.series}{' '}
          </div>
        )}
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

export default ProductCard;
