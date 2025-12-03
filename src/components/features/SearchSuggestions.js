import React, { useMemo } from 'react';

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

export default SearchSuggestions;
