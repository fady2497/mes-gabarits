import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Heart,
  Package,
  Truck,
  Shield,
  ArrowRight,
  Gift,
  TrendingUp,
  Star
} from 'lucide-react';
import { useCartStore } from '../store/index.tsx';

interface SuggestedProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  category: string;
  compatibility: number;
}

const CartPage: React.FC = () => {
  const { items, removeItem, updateQuantity, totalItems, totalPrice } = useCartStore();

  const shippingCost = 0; // Livraison toujours gratuite
  const taxAmount = totalPrice * 0.2; // 20% TVA
  const finalTotal = totalPrice + shippingCost + taxAmount;

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    return (
      <div className="min-h-screen bg-amazon-gray flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="h-24 w-24 text-secondary-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-secondary-900 mb-4">Votre panier est vide</h2>
          <p className="text-secondary-600 mb-8">Découvrez nos milliers de produits</p>
          <Link to="/search" className="btn-primary">
            <TrendingUp className="h-5 w-5 mr-2" />
            Découvrir les produits
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-amazon-gray">
      <div className="container-amazon py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Section principale du panier */}
          <div className="lg:col-span-2 space-y-6">
            {/* En-tête du panier */}
            <div className="card-amazon p-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-secondary-900 flex items-center">
                  <ShoppingCart className="h-6 w-6 mr-3 text-primary-600" />
                  Votre panier ({totalItems} article{totalItems > 1 ? 's' : ''})
                </h1>
                <div className="flex items-center space-x-2 text-sm text-secondary-600">
                  <Package className="h-4 w-4" />
                  <span>Livraison gratuite dès 50€</span>
                </div>
              </div>

              <div className="bg-primary-50 border border-primary-200 rounded-amazon p-4">
                <div className="flex items-center">
                  <Truck className="h-5 w-5 text-primary-600 mr-3" />
                  <div>
                    <p className="text-primary-800 font-medium">
                      {totalPrice >= 50
                        ? '✅ Livraison gratuite'
                        : `Plus que ${(50 - totalPrice).toFixed(2)}€ pour la livraison gratuite`}
                    </p>
                    <p className="text-primary-600 text-sm">Livraison estimée: 2-3 jours ouvrés</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Articles du panier */}
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.productId} className="card-amazon p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-24 h-24 flex-shrink-0 bg-secondary-100 rounded-amazon overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-secondary-900 text-lg mb-2">
                            {item.name}
                          </h3>
                          <p className="text-secondary-600 text-sm mb-3">Vendu par TechStore</p>

                          <div className="flex flex-wrap items-center gap-3">
                            {/* Contrôle quantité */}
                            <div className="flex items-center border border-gray-300 rounded-amazon">
                              <button
                                onClick={() =>
                                  handleQuantityChange(item.productId, item.quantity - 1)
                                }
                                className="p-2 hover:bg-secondary-50 transition-colors"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleQuantityChange(item.productId, item.quantity + 1)
                                }
                                className="p-2 hover:bg-secondary-50 transition-colors"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>

                            <button
                              onClick={() => removeItem(item.productId)}
                              className="flex items-center space-x-1 text-secondary-500 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="text-sm">Supprimer</span>
                            </button>

                            <button className="flex items-center space-x-1 text-secondary-500 hover:text-red-600 transition-colors">
                              <Heart className="h-4 w-4" />
                              <span className="text-sm">Favoris</span>
                            </button>
                          </div>
                        </div>

                        <div className="text-right mt-3 sm:mt-0">
                          <div className="text-xl font-bold text-secondary-900">
                            {(item.price * item.quantity).toFixed(2)}€
                          </div>
                          <div className="text-sm text-secondary-500">{item.price}€ l'unité</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Récapitulatif de la commande */}
          <div className="lg:col-span-1">
            <div className="card-amazon p-6 sticky top-24">
              <h2 className="text-xl font-bold text-secondary-900 mb-6">Récapitulatif</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-secondary-700">
                  <span>Sous-total</span>
                  <span>{totalPrice.toFixed(2)}€</span>
                </div>

                <div className="flex justify-between text-secondary-700">
                  <span>Livraison</span>
                  <span className="text-green-600 font-medium">Gratuite</span>
                </div>

                <div className="flex justify-between text-secondary-700">
                  <span>TVA (20%)</span>
                  <span>{taxAmount.toFixed(2)}€</span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-bold text-secondary-900">
                    <span>Total</span>
                    <span>{finalTotal.toFixed(2)}€</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {totalItems < 5 ? (
                  <div className="p-4 bg-amber-50 text-amber-800 rounded-amazon border border-amber-200 mb-4">
                    <p className="text-sm font-medium">
                      Minimum de 5 gabarits requis pour commander.
                    </p>
                  </div>
                ) : null}
                <Link
                  to={totalItems >= 5 ? '/checkout' : '#'}
                  className={`w-full btn-primary !py-4 text-lg ${totalItems < 5 ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                >
                  Passer la commande
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>

                <button className="w-full btn-secondary !py-3">
                  <Shield className="h-4 w-4 mr-2" />
                  Paiement sécurisé garanti
                </button>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center space-x-4 text-sm text-secondary-600">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-1" />
                    <span>Sécurisé</span>
                  </div>
                  <div className="flex items-center">
                    <Truck className="h-4 w-4 mr-1" />
                    <span>Rapide</span>
                  </div>
                  <div className="flex items-center">
                    <Package className="h-4 w-4 mr-1" />
                    <span>Traçable</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
