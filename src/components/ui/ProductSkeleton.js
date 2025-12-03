import React from 'react';

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

export default ProductSkeleton;
