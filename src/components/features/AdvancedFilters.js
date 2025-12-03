import React, { useState } from 'react';
import { Filter } from 'lucide-react';

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

export default AdvancedFilters;
