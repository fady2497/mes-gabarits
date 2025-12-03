import React from 'react';

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
        <p className="text-2xl font-bold text-amber-600 mb-6"> {order.subtotal}€ </p>
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

export default OrderConfirmation;
