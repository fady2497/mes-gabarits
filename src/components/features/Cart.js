import React from 'react';
import { ShoppingCart, X, Minus, Plus } from 'lucide-react';
import ProgressBar from '../ui/ProgressBar';

const Cart = ({
  cart,
  cartTotal,
  onUpdateQuantity,
  onRemoveFromCart,
  onClose,
  showCart,
  onCheckout,
  onOpenRoulette,
  rouletteUsed
}) => {
  if (!showCart) return null;

  const sendOrderByEmail = () => {
    const to = process.env.REACT_APP_ORDER_EMAIL || 'fadymezghani12345@gmail.com';
    const subject = encodeURIComponent('Commande de gabarits');
    const lines = cart.map(
      (item) =>
        `- ${item.name} | Taille ${item.size} | Qté ${item.quantity} | ${item.quantity * cartTotal.pricePerUnit}€`
    );
    const totalLine = `Total: ${cartTotal.subtotal}€ (Prix unitaire: ${cartTotal.pricePerUnit}€)`;
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
      ].join('\n')
    );
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  };

  const contactMerchant = () => {
    const phone = process.env.REACT_APP_MERCHANT_PHONE || '+33759652867';
    const lines = cart.map(
      (item) =>
        `- ${item.name} | ${item.size} | Qté ${item.quantity} | ${item.quantity * cartTotal.pricePerUnit}€`
    );
    const totalLine = `Total: ${cartTotal.subtotal}€`;
    const msg = encodeURIComponent(
      ['Bonjour, je souhaite discuter de cette commande:', ...lines, totalLine].join('\n')
    );
    const waUrl = `https://wa.me/${phone.replace(/[^\d]/g, '')}?text=${msg}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md h-full overflow-y-auto border-l-2 lg:border-l-4 border-amber-500 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
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
                {cartTotal.totalItems > 0 && cartTotal.nextTarget && (
                  <div className="mb-3 lg:mb-4">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span> Progression vers le prochain palier: </span>
                      <span>
                        {cartTotal.totalItems}/{cartTotal.nextTarget}
                      </span>
                    </div>
                    <ProgressBar current={cartTotal.totalItems} target={cartTotal.nextTarget} />
                  </div>
                )}
                {cartTotal.totalItems >= 10 && cartTotal.totalItems < 20 && (
                  <div className="mb-3 lg:mb-4 bg-green-100 border border-green-400 lg:border-2 rounded-lg lg:rounded-xl p-3 text-center">
                    <p className="text-green-700 font-bold text-sm lg:text-lg">
                      🎉Prix réduit: 90€ / pièce
                    </p>
                  </div>
                )}
                {cartTotal.totalItems >= 20 && (
                  <div className="mb-3 lg:mb-4 bg-green-100 border border-green-400 lg:border-2 rounded-lg lg:rounded-xl p-3 text-center">
                    <p className="text-green-700 font-bold text-sm lg:text-lg">
                      🎉Prix premium: 85€ / pièce
                    </p>
                  </div>
                )}
                {cartTotal.totalItems > 0 && cartTotal.nextTarget && (
                  <div className="mb-3 lg:mb-4 bg-amber-100 border border-amber-400 lg:border-2 rounded-lg lg:rounded-xl p-3 text-center">
                    <p className="text-amber-800 text-sm lg:text-base">
                      Plus que <strong>{cartTotal.nextTarget - cartTotal.totalItems}</strong> pour{' '}
                      {cartTotal.nextTarget === 10 ? '-10€/pièce' : '85€/pièce'}
                    </p>
                  </div>
                )}
                {onOpenRoulette && (
                  <button
                    type="button"
                    onClick={() => onOpenRoulette && onOpenRoulette()}
                    disabled={rouletteUsed || cartTotal.subtotal < 50}
                    className={`w-full mb-3 px-4 py-3 rounded-xl lg:rounded-2xl text-base lg:text-xl font-bold shadow-xl transition-colors
                      ${
                        rouletteUsed || cartTotal.subtotal < 50
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-emerald-500 text-white hover:bg-emerald-600'
                      }`}
                  >
                    {rouletteUsed ? 'Roulette déjà jouée' : '🎉 Tenter ma chance'}
                  </button>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={onCheckout}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 lg:py-4 rounded-xl lg:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 text-base lg:text-xl"
                  >
                    🚀 Commander
                  </button>
                  <button
                    onClick={sendOrderByEmail}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-3 lg:py-4 rounded-xl lg:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 text-base lg:text-xl"
                  >
                    ✉️ Envoyer par e‑mail
                  </button>
                  <button
                    onClick={contactMerchant}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 lg:py-4 rounded-xl lg:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 text-base lg:text-xl"
                  >
                    💬 Contacter le commerçant
                  </button>
                </div>
              </div>{' '}
            </>
          )}{' '}
        </div>{' '}
      </div>{' '}
    </div>
  );
};

export default Cart;
