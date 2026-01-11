import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

const Checkout = ({ cart, cartTotal, promo = {}, prize = {}, authToken = '', onOrderCreated }) => {
  const [orderRef] = React.useState(() => `CMD-${Date.now()}`);
  const navigate = useNavigate();
  const fmt = (n) => `${Number(n || 0).toFixed(2)} €`;
  const itemPrice = (item) => item.basePrice || item.price || 0;
  const sendWhatsApp = async () => {
    const phone = (process.env.REACT_APP_MERCHANT_PHONE || '+33759652867').replace(/[^\d]/g, '');
    const nameEl = document.querySelector('#chk-name');
    const phoneEl = document.querySelector('#chk-phone');
    const addressEl = document.querySelector('#chk-address');
    const cityEl = document.querySelector('#chk-city');
    const postalEl = document.querySelector('#chk-postal');
    const countryEl = document.querySelector('#chk-country');
    const name = nameEl?.value || '';
    const tel = phoneEl?.value || '';
    const address = addressEl?.value || '';
    const city = cityEl?.value || '';
    const postal = postalEl?.value || '';
    const country = countryEl?.value || '';
    const digits = tel.replace(/[^\d]/g, '');
    const phoneOk = /^\+?\d{8,15}$/.test(tel.replace(/\s+/g, '')); // simple international check
    const postalOk = /^\d{5}$/.test(postal.trim());
    if (!name.trim() || !phoneOk || !address.trim() || !city.trim() || !postalOk) {
      alert('Veuillez remplir Nom, Téléphone, Adresse, Ville et Code postal');
      nameEl &&
        (!name.trim()
          ? nameEl.classList.add('ring-2', 'ring-red-500')
          : nameEl.classList.remove('ring-2', 'ring-red-500'));
      phoneEl &&
        (digits.length < 8
          ? phoneEl.classList.add('ring-2', 'ring-red-500')
          : phoneEl.classList.remove('ring-2', 'ring-red-500'));
      addressEl &&
        (!address.trim()
          ? addressEl.classList.add('ring-2', 'ring-red-500')
          : addressEl.classList.remove('ring-2', 'ring-red-500'));
      cityEl &&
        (!city.trim()
          ? cityEl.classList.add('ring-2', 'ring-red-500')
          : cityEl.classList.remove('ring-2', 'ring-red-500'));
      postalEl &&
        (!postal.trim()
          ? postalEl.classList.add('ring-2', 'ring-red-500')
          : postalEl.classList.remove('ring-2', 'ring-red-500'));
      return;
    }
    const itemLines = (cart || []).map(
      (item) =>
        `- ${item.name} | Taille ${item.size} | Qté ${item.quantity} | ${fmt(itemPrice(item) * item.quantity)}`
    );
    const detailLines = [];
    if ((cartTotal?.promoAmount || 0) > 0) {
      detailLines.push(`Code ${promo?.code || 'promo'}: -${fmt(cartTotal.promoAmount)}`);
    }
    if ((cartTotal?.prizeDiscount || 0) > 0) {
      detailLines.push(`${prize?.label || 'Gain'}: -${fmt(cartTotal.prizeDiscount)}`);
    }
    if ((cartTotal?.discount || 0) > 0) {
      detailLines.push(`Remise volume: -${fmt(cartTotal.discount)}`);
    }
    const gifts = (cart || []).filter((it) => it.isGift);
    gifts.forEach((g) => {
      detailLines.push(`Cadeau: ${g.name}`);
    });
    detailLines.push(
      `Livraison: ${cartTotal?.shippingCost === 0 ? 'Gratuite' : fmt(cartTotal?.shippingCost)}`
    );

    const total = cartTotal?.finalTotal ?? cartTotal?.subtotal ?? 0;
    const msg = encodeURIComponent(
      [
        `Bonjour, je souhaite valider la commande ${orderRef}:`,
        ...itemLines,
        ...detailLines,
        '',
        `Total: ${fmt(total)}`,
        'Coordonnées client:',
        `Nom: ${name}`,
        `Téléphone: ${tel}`,
        `Adresse: ${address}`,
        `Ville: ${city}`,
        `Code postal: ${postal}`,
        country ? `Pays: ${country}` : ''
      ]
        .filter(Boolean)
        .join('\n')
    );
    const wa = `https://wa.me/${phone}?text=${msg}`;
    const win = window.open(wa, '_blank');
    if (!win) {
      try {
        await navigator.clipboard.writeText(wa);
        alert(
          'Lien WhatsApp copié dans le presse-papier (popup bloquée). Ouvrez WhatsApp et collez-le.'
        );
      } catch {
        alert(`Ouvrez ce lien dans votre navigateur :\n${wa}`);
      }
    }
  };

  const submitOrder = async () => {
    const nameEl = document.querySelector('#chk-name');
    const phoneEl = document.querySelector('#chk-phone');
    const addressEl = document.querySelector('#chk-address');
    const cityEl = document.querySelector('#chk-city');
    const postalEl = document.querySelector('#chk-postal');
    const countryEl = document.querySelector('#chk-country');
    const name = nameEl?.value || '';
    const tel = phoneEl?.value || '';
    const address = addressEl?.value || '';
    const city = cityEl?.value || '';
    const postal = postalEl?.value || '';
    const country = countryEl?.value || '';
    const digits = tel.replace(/[^\d]/g, '');
    const postalOk = /^\d{5}$/.test(postal.trim());
    if (!name.trim() || digits.length < 8 || !address.trim() || !city.trim() || !postalOk) {
      alert('Veuillez remplir Nom, Téléphone, Adresse, Ville et Code postal');
      return;
    }
    const totals = {
      subtotal: cartTotal?.subtotal ?? 0,
      discount: cartTotal?.discount ?? 0,
      promoAmount: cartTotal?.promoAmount ?? 0,
      prizeDiscount: cartTotal?.prizeDiscount ?? 0,
      shippingCost: cartTotal?.shippingCost ?? 0,
      final_total: cartTotal?.finalTotal ?? cartTotal?.subtotal ?? 0,
      promo_code: promo?.code || null
    };
    const client = { name, phone: tel, email: '', address, city, postal, country };
    const meta = { ref: orderRef };
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
        },
        body: JSON.stringify({ client, cart, totals, meta })
      });
      const ct = res.headers.get('content-type') || '';
      const raw = await res.text();
      const data = ct.includes('application/json') ? JSON.parse(raw) : { ok: false };
      if (!res.ok || !data.ok) throw new Error(data.error || 'server_error');
      onOrderCreated && onOrderCreated(data.data);
      navigate('/confirmation');
    } catch (e) {
      alert('Erreur création de commande: ' + (e.message || e));
    }
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white shadow-sm px-6 py-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Continuer les achats
          </button>
        </header>
        <div className="flex-1 grid place-items-center">
          <div className="text-center">
            <div className="text-5xl mb-4">🧾</div>
            <h2 className="text-2xl font-semibold">Votre panier est vide</h2>
            <p className="text-gray-600">Ajoutez des articles avant de passer au paiement</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100">
      <header className="sticky top-0 z-10">
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/panier')}
              className="text-white/80 hover:text-white"
            >
              ← Retour au panier
            </button>
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-5 h-5" />
              <div>
                <h1 className="text-lg font-bold">Finaliser votre commande</h1>
                <p className="text-xs text-white/80">Étape 2/2</p>
              </div>
            </div>
            <div className="w-20" />
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 bg-white rounded-2xl shadow p-6 border border-gray-100">
          <h1 className="text-xl font-semibold mb-6">Coordonnées client</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="space-y-1">
              <span className="text-sm text-gray-600">Nom complet</span>
              <input
                id="chk-name"
                className="border rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Nom complet (requis)"
              />
            </label>
            <label className="space-y-1">
              <span className="text-sm text-gray-600">Téléphone</span>
              <input
                id="chk-phone"
                className="border rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Téléphone (requis)"
              />
            </label>
            <label className="space-y-1 md:col-span-2">
              <span className="text-sm text-gray-600">Adresse</span>
              <input
                id="chk-address"
                className="border rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Adresse (requis)"
              />
            </label>
            <label className="space-y-1">
              <span className="text-sm text-gray-600">Ville</span>
              <input
                id="chk-city"
                className="border rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Ville (requis)"
              />
            </label>
            <label className="space-y-1">
              <span className="text-sm text-gray-600">Code postal</span>
              <input
                id="chk-postal"
                className="border rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Code postal (requis)"
              />
            </label>
            <label className="space-y-1">
              <span className="text-sm text-gray-600">Pays</span>
              <input
                id="chk-country"
                className="border rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Pays"
              />
            </label>
          </div>
          <h2 className="text-lg font-semibold mt-8 mb-4">Résumé des articles</h2>
          <div className="space-y-3">
            {cart.map((item, idx) => (
              <div
                key={`${item.id}-${item.size}-${idx}`}
                className="flex justify-between bg-gray-50 rounded-lg px-4 py-3"
              >
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-gray-600">
                    Taille {item.size} × {item.quantity}
                  </div>
                </div>
                <div className="font-semibold">{fmt(itemPrice(item) * item.quantity)}</div>
              </div>
            ))}
          </div>
        </section>

        <aside className="bg-white rounded-2xl shadow p-6 border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Total</h2>
          <div className="flex justify-between mb-2">
            <span>Sous-total</span>
            <span className="font-semibold">{fmt(cartTotal?.subtotal ?? 0)}</span>
          </div>
          {cartTotal?.discount > 0 && (
            <div className="flex justify-between text-green-700 mb-1">
              <span>Remise volume</span>
              <span className="font-semibold">-{fmt(cartTotal.discount)}</span>
            </div>
          )}
          {cartTotal?.promoAmount > 0 && (
            <div className="flex justify-between text-purple-700 mb-1">
              <span>{promo?.code ? `Code ${promo.code}` : 'Code promo'}</span>
              <span className="font-semibold">-{fmt(cartTotal.promoAmount)}</span>
            </div>
          )}
          {cartTotal?.prizeDiscount > 0 && (
            <div className="flex justify-between text-emerald-700 mb-1">
              <span>{prize?.label || 'Gain roulette'}</span>
              <span className="font-semibold">-{fmt(cartTotal.prizeDiscount)}</span>
            </div>
          )}
          <div className="flex justify-between mb-6">
            <span>Livraison</span>
            <span
              className={`font-semibold ${cartTotal?.shippingCost === 0 ? 'text-emerald-700' : ''}`}
            >
              {cartTotal?.shippingCost === 0 ? 'Gratuite' : fmt(cartTotal.shippingCost)}
            </span>
            {cartTotal?.shippingCost === 0 && (
              <span className="inline-flex items-center gap-1 ml-1 px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                🚚 Livraison gratuite
              </span>
            )}
          </div>
          <div className="flex justify-between text-xl font-bold">
            <span>Total</span>
            <span>{fmt(cartTotal?.finalTotal ?? cartTotal?.subtotal ?? 0)}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
            <button
              type="button"
              onClick={() => navigate('/panier')}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200"
            >
              Retour au panier
            </button>
            <button
              type="button"
              onClick={submitOrder}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
            >
              Valider la commande
            </button>
            <button
              type="button"
              onClick={sendWhatsApp}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
            >
              Envoyer sur WhatsApp
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default Checkout;
