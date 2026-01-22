import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CreditCard,
  Truck,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Shield,
  Lock,
  MapPin,
  User,
  Mail,
  Phone
} from 'lucide-react';
import { useCartStore } from '../store/index.tsx';
import { createOrder } from '../services/orderService';
import { routeOrderItems } from '../services/dropShipping';
import { dispatchDropShip } from '../services/suppliers/adapter';
import { whatsappUrl } from '../config';

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface PaymentInfo {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

const CheckoutPage: React.FC = () => {
  const { items, totalPrice } = useCartStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express' | 'pickup'>(
    'standard'
  );
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France'
  });
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });
  const [saveAddress, setSaveAddress] = useState(false);
  const [newsletter, setNewsletter] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // empty
  }, []);

  const shippingCost =
    shippingMethod === 'standard'
      ? totalPrice > 50
        ? 0
        : 5.99
      : shippingMethod === 'express'
      ? 12.99
      : 3.99;
  const taxAmount = totalPrice * 0.2; // 20% TVA
  const finalTotal = totalPrice + shippingCost + taxAmount;

  const steps = [
    { id: 1, name: 'Informations', icon: User },
    { id: 2, name: 'Livraison', icon: Truck },
    { id: 3, name: 'Validation', icon: CreditCard },
    { id: 4, name: 'Confirmation', icon: CheckCircle }
  ];

  const buildWhatsAppMessage = () => {
    const lines: string[] = [];
    lines.push(`Commande Gabarits.fr`);
    lines.push(`Client: ${shippingInfo.firstName} ${shippingInfo.lastName}`);
    lines.push(`Email: ${shippingInfo.email}`);
    lines.push(`Téléphone: ${shippingInfo.phone}`);
    lines.push(
      `Adresse: ${shippingInfo.address}, ${shippingInfo.postalCode} ${shippingInfo.city}, ${shippingInfo.country}`
    );
    lines.push('--- Articles ---');
    items.forEach((item) => {
      lines.push(`• ${item.name} x${item.quantity} = ${(item.price * item.quantity).toFixed(2)}€`);
    });
    lines.push(`Sous‑total: ${totalPrice.toFixed(2)}€`);
    const methodLabel =
      shippingMethod === 'standard'
        ? 'Standard'
        : shippingMethod === 'express'
        ? 'Express'
        : 'Point relais';
    lines.push(
      `Livraison (${methodLabel}): ${
        shippingCost === 0 ? 'Gratuite' : shippingCost.toFixed(2) + '€'
      }`
    );
    lines.push(`TVA (20%): ${taxAmount.toFixed(2)}€`);
    lines.push(`Total: ${finalTotal.toFixed(2)}€`);
    lines.push('Mode de paiement: WhatsApp — demande de paiement et confirmation');
    return lines.join('\n');
  };

  const openWhatsApp = (text: string) => {
    const encoded = encodeURIComponent(text);
    const phoneDigits = (whatsappUrl.match(/wa\.me\/(\d+)/)?.[1] || '').trim();
    const appUrl = phoneDigits
      ? `whatsapp://send?phone=${phoneDigits}&text=${encoded}`
      : `whatsapp://send?text=${encoded}`;
    const webUrl = `${whatsappUrl}?text=${encoded}`;
    try {
      // Essai application native
      window.location.href = appUrl;
      // Fallback web après un court délai
      setTimeout(() => {
        window.open(webUrl, '_blank');
      }, 400);
    } catch {
      window.open(webUrl, '_blank');
    }
  };

  const onWhatsappClicked = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!validateShipping()) {
      setCurrentStep(1);
      return;
    }
    openWhatsApp(buildWhatsAppMessage());
    try {
      const routed = await routeOrderItems(
        items.map((i) => ({ product_id: i.productId, quantity: i.quantity }))
      );
      const created = await createOrder({
        customer: {
          firstName: shippingInfo.firstName,
          lastName: shippingInfo.lastName,
          email: shippingInfo.email,
          phone: shippingInfo.phone,
          address: shippingInfo.address,
          city: shippingInfo.city,
          postalCode: shippingInfo.postalCode,
          country: shippingInfo.country
        },
        items: routed,
        totals: {
          subtotal: totalPrice,
          shipping: shippingCost,
          tax: taxAmount,
          total: finalTotal
        }
      });
      await dispatchDropShip(
        created.id,
        routed.map((r) => ({
          supplier_id: (r as any).supplier_id || null,
          product_id: r.product_id,
          quantity: r.quantity
        }))
      );
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client: {
            name: `${shippingInfo.firstName} ${shippingInfo.lastName}`.trim(),
            phone: shippingInfo.phone,
            email: shippingInfo.email
          },
          cart: items.map((it) => ({
            id: it.productId,
            name: it.name,
            quantity: it.quantity
          })),
          totals: {
            subtotal: totalPrice,
            shipping: shippingCost,
            tax: taxAmount,
            total: finalTotal
          },
          meta: { ref: `CMD-${Date.now()}` }
        })
      });
    } catch {}
    setCurrentStep(4);
  };

  const validateShipping = () => {
    const e: Record<string, string> = {};
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingInfo.email || '');
    const phoneOk = /^\+\d{8,15}$/.test(shippingInfo.phone || '');
    const postalOk =
      shippingInfo.country === 'France'
        ? /^\d{5}$/.test(shippingInfo.postalCode || '')
        : /^\d{3,10}$/.test((shippingInfo.postalCode || '').replace(/\D/g, ''));
    if (!shippingInfo.firstName.trim()) e.firstName = 'Prénom requis';
    if (!shippingInfo.lastName.trim()) e.lastName = 'Nom requis';
    if (!emailOk) e.email = 'Email invalide';
    if (!phoneOk) e.phone = 'Téléphone invalide';
    if (!shippingInfo.address.trim()) e.address = 'Adresse requise';
    if (!postalOk) e.postalCode = 'Code postal invalide';
    if (!shippingInfo.city.trim()) e.city = 'Ville requise';
    if (!shippingInfo.country.trim()) e.country = 'Pays requis';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNextStep = async () => {
    if (currentStep < steps.length) {
      if (currentStep === 1) {
        if (!validateShipping()) return;
      }
      if (currentStep === 3) {
        if (!validateShipping()) {
          setCurrentStep(1);
          return;
        }
        const routed = await routeOrderItems(
          items.map((i) => ({ product_id: i.productId, quantity: i.quantity }))
        );
        const created = await createOrder({
          customer: {
            firstName: shippingInfo.firstName,
            lastName: shippingInfo.lastName,
            email: shippingInfo.email,
            phone: shippingInfo.phone,
            address: shippingInfo.address,
            city: shippingInfo.city,
            postalCode: shippingInfo.postalCode,
            country: shippingInfo.country
          },
          items: routed,
          totals: {
            subtotal: totalPrice,
            shipping: shippingCost,
            tax: taxAmount,
            total: finalTotal
          }
        });
        await dispatchDropShip(
          created.id,
          routed.map((r) => ({
            supplier_id: (r as any).supplier_id || null,
            product_id: r.product_id,
            quantity: r.quantity
          }))
        );
        openWhatsApp(buildWhatsAppMessage());

        // Envoi email de confirmation via backend si disponible
        try {
          await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              client: {
                name: `${shippingInfo.firstName} ${shippingInfo.lastName}`.trim(),
                phone: shippingInfo.phone,
                email: shippingInfo.email
              },
              cart: items.map((it) => ({
                id: it.productId,
                name: it.name,
                quantity: it.quantity
              })),
              totals: {
                subtotal: totalPrice,
                shipping: shippingCost,
                tax: taxAmount,
                total: finalTotal
              },
              meta: { ref: `CMD-${Date.now()}` }
            })
          });
        } catch {}
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (currentStep === 1) {
      if (name === 'phone') {
        const digits = value.replace(/\D/g, '');
        const withPlus = value.trim().startsWith('+') ? `+${digits}` : digits;
        setShippingInfo((prev) => ({ ...prev, [name]: withPlus }));
      } else {
        setShippingInfo((prev) => ({ ...prev, [name]: value }));
      }
    } else if (currentStep === 3) {
      setPaymentInfo((prev) => ({ ...prev, [name]: value }));
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handlePaymentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (name === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
    }

    setPaymentInfo((prev) => ({ ...prev, [name]: formattedValue }));
  };

  return (
    <div className="min-h-screen bg-amazon-gray">
      <div className="container-amazon py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                    currentStep >= step.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-secondary-200 text-secondary-600'
                  }`}
                >
                  <step.icon className="h-5 w-5" />
                </div>
                <div className="ml-3 hidden sm:block">
                  <div
                    className={`text-sm font-medium ${
                      currentStep >= step.id ? 'text-primary-600' : 'text-secondary-500'
                    }`}
                  >
                    {step.name}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-full h-1 mx-4 transition-colors ${
                      currentStep > step.id ? 'bg-primary-600' : 'bg-secondary-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaires */}
          <div className="lg:col-span-2">
            {/* Étape 1: Informations */}
            {currentStep === 1 && (
              <div className="card-amazon p-6">
                <h2 className="text-xl font-bold text-secondary-900 mb-6">
                  Informations de livraison
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={shippingInfo.firstName}
                      onChange={handleInputChange}
                      className="input-amazon"
                      placeholder="Jean"
                      required
                    />
                    {errors.firstName && (
                      <div className="text-red-600 text-xs mt-1">{errors.firstName}</div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Nom *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={shippingInfo.lastName}
                      onChange={handleInputChange}
                      className="input-amazon"
                      placeholder="Dupont"
                      required
                    />
                    {errors.lastName && (
                      <div className="text-red-600 text-xs mt-1">{errors.lastName}</div>
                    )}
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      <Mail className="h-4 w-4 inline mr-2" />
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={shippingInfo.email}
                      onChange={handleInputChange}
                      className="input-amazon"
                      placeholder="jean.dupont@email.com"
                      required
                    />
                    {errors.email && (
                      <div className="text-red-600 text-xs mt-1">{errors.email}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      <Phone className="h-4 w-4 inline mr-2" />
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleInputChange}
                      className="input-amazon"
                      placeholder="+330759652867"
                      inputMode="tel"
                      pattern="\+[0-9]{8,15}"
                      required
                    />
                    {errors.phone && (
                      <div className="text-red-600 text-xs mt-1">
                        Format: +[pays][numéro] (8–15 chiffres)
                      </div>
                    )}
                    {errors.phone && (
                      <div className="text-red-600 text-xs mt-1">{errors.phone}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      <MapPin className="h-4 w-4 inline mr-2" />
                      Adresse *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleInputChange}
                      className="input-amazon"
                      placeholder="123 Rue de la Paix"
                      required
                    />
                    {errors.address && (
                      <div className="text-red-600 text-xs mt-1">{errors.address}</div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Code postal *
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={shippingInfo.postalCode}
                        onChange={handleInputChange}
                        className="input-amazon"
                        placeholder="75001"
                        required
                      />
                      {errors.postalCode && (
                        <div className="text-red-600 text-xs mt-1">{errors.postalCode}</div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Ville *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleInputChange}
                        className="input-amazon"
                        placeholder="Paris"
                        required
                      />
                      {errors.city && (
                        <div className="text-red-600 text-xs mt-1">{errors.city}</div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Pays *
                      </label>
                      <select
                        name="country"
                        value={shippingInfo.country}
                        onChange={handleInputChange}
                        className="input-amazon"
                        required
                      >
                        <option value="France">France</option>
                        <option value="Belgique">Belgique</option>
                        <option value="Suisse">Suisse</option>
                        <option value="Luxembourg">Luxembourg</option>
                      </select>
                      {errors.country && (
                        <div className="text-red-600 text-xs mt-1">{errors.country}</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={saveAddress}
                      onChange={(e) => setSaveAddress(e.target.checked)}
                      className="mr-3 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-secondary-700">
                      Sauvegarder cette adresse pour mes prochaines commandes
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newsletter}
                      onChange={(e) => setNewsletter(e.target.checked)}
                      className="mr-3 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-secondary-700">
                      Recevoir des offres exclusives par email
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Étape 2: Livraison */}
            {currentStep === 2 && (
              <div className="card-amazon p-6">
                <h2 className="text-xl font-bold text-secondary-900 mb-6">Mode de livraison</h2>

                <div className="space-y-4">
                  <div className="border-2 border-primary-500 rounded-amazon-lg p-4 bg-primary-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="shipping"
                          checked={shippingMethod === 'standard'}
                          onChange={() => setShippingMethod('standard')}
                          className="mr-3 text-primary-600 focus:ring-primary-500"
                        />
                        <div>
                          <div className="font-medium text-secondary-900">Livraison standard</div>
                          <div className="text-sm text-secondary-600">2-3 jours ouvrés</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-primary-600">
                          {shippingCost === 0 ? 'Gratuite' : `${shippingCost.toFixed(2)}€`}
                        </div>
                        {totalPrice < 50 && (
                          <div className="text-xs text-secondary-500">
                            +{(50 - totalPrice).toFixed(2)}€ pour gratuite
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border-2 border-gray-200 rounded-amazon-lg p-4 hover:border-primary-300 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="shipping"
                          checked={shippingMethod === 'express'}
                          onChange={() => setShippingMethod('express')}
                          className="mr-3 text-primary-600 focus:ring-primary-500"
                        />
                        <div>
                          <div className="font-medium text-secondary-900">Livraison express</div>
                          <div className="text-sm text-secondary-600">24h (jour ouvré suivant)</div>
                        </div>
                      </div>
                      <div className="font-bold text-secondary-900">12.99€</div>
                    </div>
                  </div>

                  <div className="border-2 border-gray-200 rounded-amazon-lg p-4 hover:border-primary-300 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="shipping"
                          checked={shippingMethod === 'pickup'}
                          onChange={() => setShippingMethod('pickup')}
                          className="mr-3 text-primary-600 focus:ring-primary-500"
                        />
                        <div>
                          <div className="font-medium text-secondary-900">
                            Retrait en point relais
                          </div>
                          <div className="text-sm text-secondary-600">3-5 jours ouvrés</div>
                        </div>
                      </div>
                      <div className="font-bold text-secondary-900">3.99€</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-secondary-50 rounded-amazon-lg">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-primary-600 mr-3" />
                    <div>
                      <div className="font-medium text-secondary-900">Adresse de livraison</div>
                      <div className="text-sm text-secondary-600">
                        {shippingInfo.firstName} {shippingInfo.lastName}, {shippingInfo.address},{' '}
                        {shippingInfo.postalCode} {shippingInfo.city}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Étape 3: Validation (WhatsApp) */}
            {currentStep === 3 && (
              <div className="card-amazon p-6">
                <h2 className="text-xl font-bold text-secondary-900 mb-4">
                  Validation de commande
                </h2>
                <p className="text-secondary-700 mb-4">
                  Le paiement se fait par WhatsApp: nous vous enverrons un message avec le
                  récapitulatif et le lien de paiement/confirmation.
                </p>
                <div className="p-4 bg-secondary-50 rounded-amazon mb-4">
                  <div className="font-medium text-secondary-900 mb-2">Coordonnées</div>
                  <div className="text-sm text-secondary-700">
                    {shippingInfo.firstName} {shippingInfo.lastName}
                  </div>
                  <div className="text-sm text-secondary-700">
                    {shippingInfo.email} • {shippingInfo.phone}
                  </div>
                  <div className="text-sm text-secondary-700">
                    {shippingInfo.address}, {shippingInfo.postalCode} {shippingInfo.city},{' '}
                    {shippingInfo.country}
                  </div>
                </div>
                <a
                  href={`${whatsappUrl}?text=${encodeURIComponent(buildWhatsAppMessage())}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  onClick={onWhatsappClicked}
                >
                  Envoyer la commande via WhatsApp
                </a>
              </div>
            )}
            {/* Ancien bloc paiement (désactivé) */}
            {currentStep === 3 && false && (
              <div className="card-amazon p-6">
                <h2 className="text-xl font-bold text-secondary-900 mb-6">
                  Informations de paiement
                </h2>

                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Lock className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-secondary-600">
                      Paiement 100% sécurisé avec SSL
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div className="flex items-center justify-center p-3 border border-gray-200 rounded-amazon">
                      <span className="text-xs font-bold text-secondary-600">VISA</span>
                    </div>
                    <div className="flex items-center justify-center p-3 border border-gray-200 rounded-amazon">
                      <span className="text-xs font-bold text-secondary-600">MASTERCARD</span>
                    </div>
                    <div className="flex items-center justify-center p-3 border border-gray-200 rounded-amazon">
                      <span className="text-xs font-bold text-secondary-600">AMEX</span>
                    </div>
                    <div className="flex items-center justify-center p-3 border border-gray-200 rounded-amazon">
                      <span className="text-xs font-bold text-secondary-600">PayPal</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Numéro de carte *
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={paymentInfo.cardNumber}
                      onChange={handlePaymentInputChange}
                      className="input-amazon"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Titulaire de la carte *
                      </label>
                      <input
                        type="text"
                        name="cardName"
                        value={paymentInfo.cardName}
                        onChange={handlePaymentInputChange}
                        className="input-amazon"
                        placeholder="Jean Dupont"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Pays *
                      </label>
                      <select className="input-amazon" defaultValue="France">
                        <option value="France">France</option>
                        <option value="Belgique">Belgique</option>
                        <option value="Suisse">Suisse</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Date d'expiration *
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={paymentInfo.expiryDate}
                        onChange={handlePaymentInputChange}
                        className="input-amazon"
                        placeholder="MM/AA"
                        maxLength={5}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        CVV *
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        value={paymentInfo.cvv}
                        onChange={handlePaymentInputChange}
                        className="input-amazon"
                        placeholder="123"
                        maxLength={4}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-amazon-lg">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-green-600 mr-3" />
                    <div>
                      <div className="font-medium text-green-800">Paiement sécurisé</div>
                      <div className="text-sm text-green-700">
                        Vos informations sont cryptées et protégées
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Étape 4: Confirmation */}
            {currentStep === 4 && (
              <div className="card-amazon p-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-secondary-900 mb-2">
                    Commande confirmée !
                  </h2>
                  <p className="text-secondary-600">Votre commande #MP-{Date.now()} a été reçue</p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-amazon-lg">
                    <span className="text-secondary-700">Numéro de commande</span>
                    <span className="font-medium text-secondary-900">#MP-{Date.now()}</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-amazon-lg">
                    <span className="text-secondary-700">Date</span>
                    <span className="font-medium text-secondary-900">
                      {new Date().toLocaleDateString('fr-FR')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-amazon-lg">
                    <span className="text-secondary-700">Livraison estimée</span>
                    <span className="font-medium text-secondary-900">Dans 2-3 jours ouvrés</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-amazon-lg">
                    <span className="text-secondary-700">Total payé</span>
                    <span className="font-bold text-primary-600 text-lg">
                      {finalTotal.toFixed(2)}€
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link to="/account/orders" className="w-full btn-primary">
                    Suivre ma commande
                  </Link>
                  <Link to="/" className="w-full btn-secondary">
                    Continuer mes achats
                  </Link>
                </div>
              </div>
            )}

            {/* Navigation entre étapes */}
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                className="flex items-center space-x-2 px-4 py-2 text-secondary-700 hover:text-secondary-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Retour</span>
              </button>

              {currentStep < 4 && (
                <button
                  onClick={currentStep === 3 ? onWhatsappClicked : handleNextStep}
                  className="btn-primary"
                >
                  <span>{currentStep === 3 ? 'Valider et ouvrir WhatsApp' : 'Continuer'}</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              )}
            </div>
          </div>

          {/* Récapitulatif de la commande */}
          <div className="lg:col-span-1">
            <div className="card-amazon p-6 sticky top-24">
              <h3 className="text-lg font-bold text-secondary-900 mb-6">Récapitulatif</h3>

              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.usage || 'moto'}`}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-12 h-12 bg-secondary-100 rounded-amazon overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-secondary-900 truncate">
                        {item.name}
                      </div>
                      <div className="text-xs text-secondary-600">Qté: {item.quantity}</div>
                      {item.usage && (
                        <div className="text-xs text-secondary-600">
                          Usage:{' '}
                          {item.usage === 'moto'
                            ? 'Moto'
                            : item.usage === 'auto'
                            ? 'Voiture'
                            : item.usage === 'maison'
                            ? 'Maison / Mur'
                            : 'Bateau'}
                        </div>
                      )}
                    </div>
                    <div className="text-sm font-medium text-secondary-900">
                      {(item.price * item.quantity).toFixed(2)}€
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-sm text-secondary-700">
                  <span>Sous-total</span>
                  <span>{totalPrice.toFixed(2)}€</span>
                </div>

                <div className="flex justify-between text-sm text-secondary-700">
                  <span>
                    Livraison (
                    {shippingMethod === 'standard'
                      ? 'Standard'
                      : shippingMethod === 'express'
                      ? 'Express'
                      : 'Point relais'}
                    )
                  </span>
                  <span className={shippingCost === 0 ? 'text-green-600 font-medium' : ''}>
                    {shippingCost === 0 ? 'Gratuite' : `${shippingCost.toFixed(2)}€`}
                  </span>
                </div>

                <div className="flex justify-between text-sm text-secondary-700">
                  <span>TVA (20%)</span>
                  <span>{taxAmount.toFixed(2)}€</span>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-bold text-secondary-900">
                    <span>Total</span>
                    <span>{finalTotal.toFixed(2)}€</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2 text-sm text-secondary-600 mb-3">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span>Paiement sécurisé</span>
                </div>

                <div className="flex items-center space-x-2 text-sm text-secondary-600">
                  <Lock className="h-4 w-4 text-green-600" />
                  <span>SSL 256-bit</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
