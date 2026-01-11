export { default } from './App.tsx';
import {
  ShoppingCart,
  Search,
  X,
  Plus,
  Minus,
  ChevronDown,
  ChevronRight,
  Star,
  Truck,
  Shield,
  Award,
  Menu,
  Phone,
  Mail,
  Heart,
  Filter,
  Package,
  CheckCircle,
  Sparkles,
  TrendingUp,
  Zap,
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  ClipboardList
} from 'lucide-react';

import StorySlider from './StorySlider';
import { useNavigate, useLocation, useNavigationType } from 'react-router-dom';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import Confirmation from './pages/Confirmation';
// Footer et Cart seront définis inline ci‑dessous
import Toast from './components/ui/Toast';
import ProgressBar from './components/ui/ProgressBar';
import StockAdmin from './components/features/StockAdmin';
import Wheel from './components/ui/Wheel';

// ============= PAGES & MODALS =============
const OrderConfirmation = ({ order, onClose }) => (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-lg z-[100] flex items-center justify-center p-4 animate-fade-in">
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 max-w-lg w-full shadow-2xl animate-scale-in">
      <div className="text-center">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <CheckCircle size={48} className="text-white" />
          </div>
          <div className="absolute -top-2 -right-2">
            <Sparkles size={32} className="text-yellow-400" />
          </div>
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-3">Commande Confirmée !</h3>
        <p className="text-gray-600 mb-6">
          Merci pour votre commande de <span className="font-bold">{order.totalItems}</span>{' '}
          gabarits
        </p>
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-6 mb-8 border-2 border-amber-200">
          <p className="text-5xl font-bold text-amber-600">{order.subtotal}€</p>
          <p className="text-sm text-amber-700 mt-2">Total TTC</p>
        </div>
        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-4 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
        >
          Continuer mes achats
        </button>
      </div>
    </div>
  </div>
);

const AccountDropdown = ({ onSignIn }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="relative hidden lg:block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="text-sm text-gray-700 hover:text-gray-900 font-semibold">
        Bonjour, Identifiez-vous — Compte et listes
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-[560px] bg-white border border-gray-200 rounded-xl shadow-2xl p-5 z-50">
          <div className="flex items-center justify-center mb-4">
            <button
              onClick={onSignIn}
              className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg"
            >
              Identifiez-vous
            </button>
          </div>
          <div className="text-center text-sm text-gray-600 mb-4">
            Nouveau client ?{' '}
            <span onClick={onSignIn} className="text-blue-600 hover:underline cursor-pointer">
              Commencer ici.
            </span>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="font-bold mb-2">Vos listes d’envies</div>
              <ul className="space-y-1 text-sm">
                <li>Créer une liste</li>
                <li>Liste de mariage</li>
                <li>Liste de naissance</li>
                <li>Découvrez votre style</li>
                <li>Explorez le showroom</li>
              </ul>
            </div>
            <div>
              <div className="font-bold mb-2">Votre compte</div>
              <ul className="space-y-1 text-sm">
                <li>Vos commandes</li>
                <li>Continuez vos achats</li>
                <li>Vos recommandations</li>
                <li>Gérer votre contenu et vos appareils</li>
                <li>Prime Video</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
const AuthModal = ({ onClose, onLoginSuccess }) => {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    setLoading(true);
    setError('');
    try {
      const url = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body =
        mode === 'login' ? { email, password } : { email, password, firstName, lastName };
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const ct = res.headers.get('content-type') || '';
      const raw = await res.text();
      let data;
      try {
        data = ct.includes('application/json') ? JSON.parse(raw) : JSON.parse(raw);
      } catch {
        throw new Error(
          raw.startsWith('Proxy error')
            ? 'Proxy error: backend inaccessible'
            : 'Réponse invalide du serveur'
        );
      }
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'auth_error');
      }
      const { token, user } = data.data || {};
      if (!token || !user) throw new Error('invalid_response');
      try {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_user', JSON.stringify(user));
      } catch {}
      onLoginSuccess(token, user);
      onClose();
    } catch (e) {
      setError(e.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[120] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">
            {mode === 'login' ? 'Se connecter' : "S'inscrire"}
          </h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>
        {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}
        <div className="space-y-3">
          {mode === 'register' && (
            <>
              <input
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Prénom"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Nom"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </>
          )}
          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mt-5 flex items-center justify-between">
          <button
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-50"
            onClick={submit}
          >
            {loading ? 'En cours...' : mode === 'login' ? 'Connexion' : 'Créer le compte'}
          </button>
          <button
            className="text-sm text-gray-600 hover:text-gray-800"
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          >
            {mode === 'login' ? "Pas de compte ? S'inscrire" : 'Déjà inscrit ? Se connecter'}
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductPreviewModal = ({ product, onClose, onPrev, onNext }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-lg bg-white/20 text-white hover:bg-white/30"
      >
        <X size={20} />
      </button>
      <div className="w-full h-full flex items-center justify-center">
        {product.image ? (
          <img
            src={product.image}
            alt={`${product.series}-${product.model}`}
            className="max-w-[95vw] max-h-[95vh] object-contain select-none"
            draggable="false"
            onContextMenu={(e) => e.preventDefault()}
          />
        ) : (
          <div className="text-white/70">Aperçu indisponible</div>
        )}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/40 text-white px-4 py-2 rounded-full text-sm">
          {(() => {
            const styles = {
              A: 'classic cotes',
              B: 'classic chevron',
              C: 'classic curve',
              D: 'classic curve',
              E: 'classic spider',
              F: 'line sport',
              G: 'special nda',
              H: 'special harley',
              I: 'pano selle',
              J: 'classic ovale',
              K: 'classic lacer',
              L: 'classic wave',
              M: 'classic losange'
            };
            const mm =
              (String(product.photoNotes || product.image || '').match(/(30mm|40mm|50mm|70mm)/i) ||
                [])[1] || '';
            return `Série ${product.series} • #${product.model} • ${styles[product.series] || ''}${
              mm ? ` • ${mm}` : ''
            }`;
          })()}
        </div>
      </div>
    </div>
  );
};

// ============= MODAL LIVRAISON =============
const DeliveryModal = ({ onClose, waUrl }) => (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-lg z-[100] flex items-center justify-center p-4 animate-fade-in">
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl max-w-lg w-full shadow-2xl animate-scale-in overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
        >
          <X size={24} className="text-white" />
        </button>
        <div className="text-center text-white">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Truck size={32} />
          </div>
          <h3 className="text-2xl font-bold">Informations Livraison</h3>
        </div>
      </div>
      <div className="p-6 space-y-4">
        <div className="bg-blue-50 rounded-2xl p-4 border-2 border-blue-100">
          <h4 className="font-bold text-blue-800 mb-2 flex items-center">
            <Package size={18} className="mr-2" /> Délais de livraison
          </h4>
          <ul className="text-gray-700 space-y-1 text-sm">
            <li>
              • France métropolitaine : <strong>3-5 jours ouvrés</strong>
            </li>
            <li>
              • DOM-TOM : <strong>7-10 jours ouvrés</strong>
            </li>
            <li>
              • Europe : <strong>5-7 jours ouvrés</strong>
            </li>
          </ul>
        </div>
        <div className="bg-green-50 rounded-2xl p-4 border-2 border-green-100">
          <h4 className="font-bold text-green-800 mb-2 flex items-center">
            <Truck size={18} className="mr-2" /> Frais de port
          </h4>
          <ul className="text-gray-700 space-y-1 text-sm">
            <li>
              • <strong>GRATUIT</strong> dès 200€ de commande
            </li>
            <li>• Forfait 9,90€ pour les commandes inférieures</li>
            <li>• Suivi en temps réel par email/SMS</li>
          </ul>
        </div>
        <div className="bg-amber-50 rounded-2xl p-4 border-2 border-amber-100">
          <h4 className="font-bold text-amber-800 mb-2 flex items-center">
            <CheckCircle size={18} className="mr-2" /> Mode de livraison
          </h4>
          <ul className="text-gray-700 space-y-1 text-sm">
            <li>• Colissimo avec signature</li>
            <li>• Emballage soigné anti-choc</li>
            <li>• Numéro de suivi fourni</li>
          </ul>
        </div>
        <a
          href={waUrl}
          target="_blank"
          rel="noreferrer"
          className="block w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 rounded-xl text-center hover:shadow-lg transition-all"
        >
          💬 Une question ? Contactez-nous sur WhatsApp
        </a>
      </div>
    </div>
  </div>
);

const ContactModal = ({ onClose, onWhatsApp }) => {
  const [name, setName] = React.useState('');
  const [emailInput, setEmailInput] = React.useState('');
  const [phoneInput, setPhoneInput] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [ok, setOk] = React.useState(false);

  const submit = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email: emailInput, phone: phoneInput, message })
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error('failed');
      setOk(true);
      setTimeout(() => onClose(), 1200);
    } catch (e) {
      setError('Erreur, réessayez');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-lg z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl max-w-lg w-full shadow-2xl animate-scale-in overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={24} className="text-white" />
          </button>
          <div className="text-center text-white">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail size={32} />
            </div>
            <h3 className="text-2xl font-bold">Contact</h3>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {ok ? (
            <div className="text-green-600 font-semibold">Message envoyé</div>
          ) : (
            <>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nom"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3"
              />
              <input
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Email"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3"
              />
              <input
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="Téléphone"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3"
              />
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Votre message"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 h-28"
              />
              {error && <div className="text-red-600 text-sm">{error}</div>}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={submit}
                  disabled={loading}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold py-3 rounded-xl disabled:opacity-50"
                >
                  Envoyer
                </button>
                <button
                  onClick={onWhatsApp}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 rounded-xl"
                >
                  WhatsApp
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const RouletteModal = ({
  onClose,
  onWin,
  onUsed = () => {},
  prizes,
  canSpin = true,
  cartId = '',
  token = ''
}) => {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Animation de confettis lorsqu’un gain est remporté
  const triggerConfetti = () => {
    const colors = ['#F59E0B', '#FBBF24', '#F97316', '#84CC16', '#10B981', '#3B82F6'];
    const count = 120;
    for (let i = 0; i < count; i++) {
      const div = document.createElement('div');
      div.className = 'confetti-piece';
      div.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      div.style.left = Math.random() * 100 + 'vw';
      div.style.top = '-10px';
      div.style.animationDelay = Math.random() * 300 + 'ms';
      document.body.appendChild(div);
      setTimeout(() => div.remove(), 1500);
    }
  };

  const spin = async () => {
    if (spinning || !canSpin) return;
    setSpinning(true);
    setResult(null);
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch('/api/roulette/spin', {
        method: 'POST',
        headers,
        body: JSON.stringify({ cartId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'server');
      // Si déjà utilisé, on affiche directement le résultat renvoyé par le backend
      if (!data.ok && data.used) {
        onWin(data.prize); // applique immédiatement le gain
        onUsed();

        const idx = prizes.findIndex((p) => p.label === data.prize.label);
        if (idx !== -1) setSelectedIndex(idx);
        setResult(data.prize);
        setSpinning(false);
        return;
      }
      // Tirage réussi
      const prize = data.prize;
      const idx = prizes.findIndex((p) => p.label === prize.label);
      const sel = idx !== -1 ? idx : Math.floor(Math.random() * prizes.length);
      setSelectedIndex(sel);
      setTimeout(() => {
        const pr = prizes[sel];
        setResult(pr);
        onWin(pr);
        onUsed();
        triggerConfetti();
        setSpinning(false);
      }, 1800);
    } catch (e) {
      console.error('roulette spin error', e);
      // Fallback : tirage local si l’API échoue ou répond mal
      const sel = Math.floor(Math.random() * prizes.length);
      setSelectedIndex(sel);
      setTimeout(() => {
        const pr = prizes[sel];
        setResult(pr);
        onWin(pr);
        onUsed();
        setSpinning(false);
      }, 1800);
    }
  };
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">🎁 Roulette de gains</h3>
          <p className="text-gray-600 mb-4">Tentez votre chance et gagnez une récompense</p>
          <div className="relative mx-auto mb-6">
            {/* Bouton de fermeture */}
            <button
              onClick={onClose}
              className="absolute -top-4 -right-4 bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full shadow"
            >
              <X size={18} />
            </button>
            {/* Flèche indicatrice */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 pointer-events-none select-none">
              <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-b-[22px] border-b-amber-600 drop-shadow-md"></div>
            </div>
            <Wheel segments={prizes} selectedIndex={selectedIndex} spinning={spinning} size={300} />
          </div>
          {!result && (
            <button
              onClick={spin}
              disabled={spinning}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
            >
              {spinning ? '🎡 En cours...' : canSpin ? '🎡 Lancer la roulette' : '🎡 Déjà utilisé'}
            </button>
          )}
          {result && (
            <div className="space-y-3">
              <div className="text-green-600 font-semibold">Gagné: {result.label}</div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    onWin(result);
                    onClose();
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-xl"
                >
                  Appliquer
                </button>
                <button
                  onClick={onClose}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 rounded-xl"
                >
                  Fermer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============= SHEET SERIES =============
const SeriesSheet = ({ series = [], selectedSeries, onSelect, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-end md:items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-t-3xl md:rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800">Choisir une série</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>
        <div className="p-4 grid grid-cols-2 gap-3">
          {series.map((s) => (
            <button
              key={s}
              onClick={() => onSelect(s)}
              className={`py-2 px-3 rounded-xl font-semibold ${
                selectedSeries === s
                  ? 'bg-amber-500 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============= MODAL FAQ =============
const FaqModal = ({ onClose, email }) => {
  const faqs = [
    {
      q: 'Quels sont les délais de fabrication ?',
      a: 'Nos gabarits sont expédiés sous 24-48h après confirmation de commande.'
    },
    {
      q: 'Puis-je retourner un produit ?',
      a: "Oui, vous disposez de 14 jours pour retourner un produit non utilisé dans son emballage d'origine."
    },
    {
      q: 'Les gabarits sont-ils réutilisables ?',
      a: 'Absolument ! Nos gabarits sont conçus pour une utilisation intensive et durable.'
    },
    {
      q: 'Proposez-vous des gabarits sur mesure ?',
      a: 'Oui, contactez-nous pour toute demande personnalisée. Nous étudions chaque projet.'
    },
    {
      q: 'Comment passer commande ?',
      a: 'Ajoutez vos gabarits au panier, renseignez vos coordonnées et validez. Nous vous contactons pour confirmer.'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-lg z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl max-w-lg w-full shadow-2xl animate-scale-in overflow-hidden max-h-[90vh] flex flex-col">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={24} className="text-white" />
          </button>
          <div className="text-center text-white">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">❓</span>
            </div>
            <h3 className="text-2xl font-bold">Questions Fréquentes</h3>
          </div>
        </div>
        <div className="p-6 space-y-3 overflow-y-auto flex-1">
          {faqs.map((faq, idx) => (
            <details key={idx} className="bg-gray-50 rounded-xl border-2 border-gray-100 group">
              <summary className="p-4 font-semibold text-gray-800 cursor-pointer hover:text-purple-600 transition-colors flex items-center justify-between">
                <span>{faq.q}</span>
                <ChevronDown
                  size={18}
                  className="text-gray-400 group-open:rotate-180 transition-transform"
                />
              </summary>
              <div className="px-4 pb-4 text-gray-600 text-sm">{faq.a}</div>
            </details>
          ))}
        </div>
        <div className="p-4 border-t border-gray-200">
          <a
            href={`mailto:${email}?subject=${encodeURIComponent('Question depuis le site')}`}
            className="block w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-xl text-center hover:shadow-lg transition-all"
          >
            📧 Autre question ? Envoyez-nous un email
          </a>
        </div>
      </div>
    </div>
  );
};

// ============= MODAL GARANTIE =============
const WarrantyModal = ({ onClose, email }) => (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-lg z-[100] flex items-center justify-center p-4 animate-fade-in">
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl max-w-lg w-full shadow-2xl animate-scale-in overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
        >
          <X size={24} className="text-white" />
        </button>
        <div className="text-center text-white">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield size={32} />
          </div>
          <h3 className="text-2xl font-bold">Garantie & SAV</h3>
        </div>
      </div>
      <div className="p-6 space-y-4">
        <div className="bg-emerald-50 rounded-2xl p-4 border-2 border-emerald-100">
          <h4 className="font-bold text-emerald-800 mb-2 flex items-center">
            <Shield size={18} className="mr-2" /> Garantie 2 ans
          </h4>
          <p className="text-gray-700 text-sm">
            Tous nos gabarits sont garantis <strong>2 ans</strong> contre tout défaut de
            fabrication. Cette garantie couvre les déformations, défauts de découpe et problèmes de
            matériaux.
          </p>
        </div>
        <div className="bg-blue-50 rounded-2xl p-4 border-2 border-blue-100">
          <h4 className="font-bold text-blue-800 mb-2 flex items-center">
            <CheckCircle size={18} className="mr-2" /> Conditions de retour
          </h4>
          <ul className="text-gray-700 space-y-1 text-sm">
            <li>
              • Retour possible sous <strong>14 jours</strong>
            </li>
            <li>• Produit non utilisé, dans son emballage d'origine</li>
            <li>• Remboursement sous 5 jours ouvrés</li>
          </ul>
        </div>
        <div className="bg-amber-50 rounded-2xl p-4 border-2 border-amber-100">
          <h4 className="font-bold text-amber-800 mb-2 flex items-center">
            <Award size={18} className="mr-2" /> Notre engagement qualité
          </h4>
          <p className="text-gray-700 text-sm">
            Fabrication française, matériaux premium, contrôle qualité rigoureux. Nous nous
            engageons à vous satisfaire à 100%.
          </p>
        </div>
        <a
          href={`mailto:${email}?subject=${encodeURIComponent('Demande SAV / Garantie')}`}
          className="block w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold py-3 rounded-xl text-center hover:shadow-lg transition-all"
        >
          📧 Contacter le SAV
        </a>
      </div>
    </div>
  </div>
);

// ============= COMPOSANTS FONCTIONNELS =============
const SearchSuggestions = ({ searchTerm, products, onSelect }) => {
  const suggestions = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 6);
  }, [searchTerm, products]);

  if (!searchTerm || suggestions.length === 0) return null;

  return (
    <div className="absolute top-full left-0 right-0 bg-white rounded-2xl shadow-2xl z-40 mt-2 border-2 border-gray-100 overflow-hidden">
      {suggestions.map((product, index) => (
        <button
          key={`${product.id}-${index}`}
          onClick={() => onSelect(product)}
          className="w-full text-left p-4 hover:bg-amber-50 transition-all duration-200 flex items-center space-x-4 border-b border-gray-100 last:border-b-0 group"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">{product.series}</span>
          </div>
          <div className="flex-1">
            <div className="font-bold text-gray-800 group-hover:text-amber-600">{product.name}</div>
            <div className="text-sm text-gray-600 truncate">{product.description}</div>
          </div>
          <div className="text-amber-600 font-bold">{product.basePrice}€</div>
        </button>
      ))}
    </div>
  );
};

// ============= PANNEAU COMMANDES =============
const OrdersPanel = ({ showOrders, onClose, orders, loading, error, onRefresh }) => {
  const [selected, setSelected] = React.useState(null);
  const items = React.useMemo(() => {
    if (!selected) return [];
    if (Array.isArray(selected.items)) return selected.items;
    if (selected.items_json) {
      try {
        return JSON.parse(selected.items_json);
      } catch {
        return [];
      }
    }
    return [];
  }, [selected]);
  if (!showOrders) return null;
  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-lg animate-slide-in-right">
        <div className="h-full bg-gradient-to-b from-white to-gray-50 shadow-2xl border-l-4 border-amber-500">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Award size={24} className="text-white" />
                <h2 className="text-2xl font-bold text-white">Mes commandes</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={24} className="text-white" />
              </button>
            </div>
            <div className="mt-4 flex items-center justify-between text-white/90">
              <span>{orders?.length || 0} enregistrées</span>
              <button
                onClick={onRefresh}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-sm"
              >
                ↻ Actualiser
              </button>
            </div>
          </div>

          <div className="p-6 h-[calc(100%-140px)] overflow-y-auto">
            {loading && <div className="text-center py-10">Chargement…</div>}
            {error && <div className="text-center py-10 text-red-600">Erreur: {String(error)}</div>}
            {!loading && !error && (
              <div className="space-y-4">
                {(orders || []).map((o) => (
                  <button
                    key={o.id}
                    onClick={() => setSelected(o)}
                    className="w-full text-left bg-white rounded-2xl shadow p-4 border border-gray-200 hover:shadow-lg transition"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-gray-900">{o.ref || `#${o.id}`}</div>
                        <div className="text-sm text-gray-600">
                          {new Date(o.created_at || o.date).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-amber-600">
                          {o.subtotal ?? o.total ?? 0}€
                        </div>
                        <div className="text-sm text-gray-600">
                          {o.total_items ??
                            (Array.isArray(o.items)
                              ? o.items.reduce((sum, it) => sum + (it.quantity || 0), 0)
                              : 0)}{' '}
                          articles
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-700">
                      Client: {o.client_name} · {o.client_phone}
                      {o.shippingAddress && (
                        <span className="block text-xs text-gray-600">
                          {o.shippingAddress.address}, {o.shippingAddress.city}{' '}
                          {o.shippingAddress.postal} {o.shippingAddress.country || ''}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
                {orders?.length === 0 && (
                  <div className="text-center py-16 bg-white rounded-2xl border border-dashed">
                    Aucune commande pour le moment
                  </div>
                )}
              </div>
            )}

            {selected && (
              <div className="mt-6 bg-white rounded-2xl shadow-xl border-2 border-amber-200 p-5">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-gray-900">
                    Détail {selected.ref || `#${selected.id}`}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelected(null)}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
                    >
                      Fermer
                    </button>
                    <button
                      onClick={() => {
                        const totalItems = Array.isArray(items)
                          ? items.reduce((sum, it) => sum + (it.quantity || 0), 0)
                          : selected.total_items || 0;
                        const recap = [
                          `Client: ${selected.client_name} · ${selected.client_phone}`,
                          `Date: ${new Date(
                            selected.created_at || selected.date
                          ).toLocaleString()}`,
                          '',
                          ...items.map(
                            (i) =>
                              `- ${i.productName || i.name || 'Produit'} | Taille ${
                                i.size || '-'
                              } | Qté ${i.quantity || 1}`
                          ),
                          '',
                          `Sous-total: ${selected.subtotal ?? selected.total ?? 0}€`,
                          `Articles: ${totalItems}`
                        ].join('\n');
                        navigator.clipboard?.writeText(recap);
                      }}
                      className="px-3 py-2 bg-amber-100 hover:bg-amber-200 rounded-lg text-sm"
                    >
                      Copier résumé
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3">
                  {items.map((i, idx) => (
                    <div
                      key={`${i.id}-${idx}`}
                      className="border rounded-xl p-3 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-semibold text-gray-800">
                          {i.name} {i.size ? `(${i.size})` : ''}
                        </div>
                        <div className="text-xs text-gray-500">ID: {i.id || 'N/A'}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-700">Qté {i.quantity || 1}</div>
                      </div>
                    </div>
                  ))}
                  {items.length === 0 && (
                    <div className="text-sm text-gray-500">Aucun détail disponible</div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Adresse:{' '}
                    {selected.shippingAddress
                      ? `${selected.shippingAddress.address}, ${selected.shippingAddress.city} ${selected.shippingAddress.postal}`
                      : 'N/A'}
                  </div>
                  <div className="font-bold text-amber-600">
                    Total: {selected.total ?? selected.subtotal ?? 0}€
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const AdvancedFilters = ({ filters, onFiltersChange, series }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-6 shadow-2xl mb-8 border-2 border-gray-100">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full group"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl">
            <Filter size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Filtres avancés</h3>
            <p className="text-sm text-gray-600">Affinez votre recherche</p>
          </div>
        </div>
        <div
          className={`p-2 rounded-full transition-all duration-300 ${
            isOpen ? 'bg-amber-100 rotate-180' : 'bg-gray-100'
          }`}
        >
          <ChevronDown size={20} className="text-gray-700" />
        </div>
      </button>

      {isOpen && (
        <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-down">
          <div className="space-y-4">
            <h4 className="font-bold text-gray-700 flex items-center space-x-2">
              <Package size={16} />
              <span>Séries</span>
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {series.map((s) => (
                <label
                  key={s}
                  className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer"
                >
                  <div
                    className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all
                    ${
                      filters.series.includes(s)
                        ? 'bg-amber-500 border-amber-500'
                        : 'border-gray-300'
                    }`}
                  >
                    {filters.series.includes(s) && <CheckCircle size={12} className="text-white" />}
                  </div>
                  <span className="font-medium">Série {s}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-gray-700 flex items-center space-x-2">
              <TrendingUp size={16} />
              <span>Tailles disponibles</span>
            </h4>
            <div className="flex space-x-3">
              {['S', 'M', 'L'].map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    const newSizes = filters.sizes.includes(size)
                      ? filters.sizes.filter((s) => s !== size)
                      : [...filters.sizes, size];
                    onFiltersChange({ ...filters, sizes: newSizes });
                  }}
                  className={`px-4 py-3 rounded-xl font-bold transition-all duration-300
                    ${
                      filters.sizes.includes(size)
                        ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-gray-700 flex items-center space-x-2">
              <Zap size={16} />
              <span>Budget maximum</span>
            </h4>
            <div className="space-y-4">
              <div className="text-2xl font-bold text-amber-600 text-center">
                {filters.maxPrice}€
              </div>
              <input
                type="range"
                min="50"
                max="200"
                step="10"
                value={filters.maxPrice}
                onChange={(e) =>
                  onFiltersChange({ ...filters, maxPrice: parseInt(e.target.value) })
                }
                className="w-full h-2 bg-gradient-to-r from-amber-200 to-amber-500 rounded-lg appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-amber-500 [&::-webkit-slider-thumb]:shadow-xl"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>50€</span>
                <span>200€</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============= LOGIQUE DES PRODUITS =============
const generateProducts = () => {
  const series = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];
  const products = [];
  const descriptions = [
    'Traçage couture professionnel',
    "Motif nid d'abeille premium",
    'Gabarit expert sellerie auto',
    'Design moto sport premium',
    'Précision millimétrique',
    'Qualité industrie française'
  ];

  series.forEach((letter, idx) => {
    const count =
      letter === 'A'
        ? 5
        : letter === 'B'
        ? 11
        : letter === 'C'
        ? 12
        : letter === 'D'
        ? 9
        : letter === 'E'
        ? 6
        : letter === 'F'
        ? 4
        : letter === 'G'
        ? 17
        : letter === 'H'
        ? 4
        : letter === 'I'
        ? 9
        : letter === 'J'
        ? 9
        : letter === 'K'
        ? 4
        : letter === 'L'
        ? 5
        : letter === 'M'
        ? 10
        : 4;
    for (let i = 1; i <= count; i++) {
      const modelNum = String(i).padStart(3, '0');
      const descIndex = (idx + i) % descriptions.length;
      const imageMapA = {
        '001': '/images/gabarit-sellerie-serie-a1-classic-cotes-30mm-gabaritsfr.png',
        '002': '/images/gabarit-sellerie-serie-a2-classic-cotes-40mm-gabaritsfr.png',
        '003': '/images/gabarit-sellerie-serie-a3-classic-cotes-50mm-gabaritsfr.png',
        '004': '/images/gabarit-sellerie-serie-a4-classic-cotes-30mm-gabaritsfr.png',
        '005': '/images/gabarit-sellerie-serie-a5-classic-cotes-40mm-gabaritsfr.png'
      };
      const imageMapB = {
        '001': '/images/gabarit-sellerie-serie-b1-classic-chevron-70mm-gabaritsfr.png',
        '002': '/images/gabarit-sellerie-serie-b2-classic-chevron-50mm-gabaritsfr.png',
        '003': '/images/gabarit-sellerie-serie-b3-classic-chevron-30mm-gabaritsfr.png',
        '004': '/images/gabarit-sellerie-serie-b4-classic-chevron-decale-gabaritsfr.png',
        '005': '/images/gabarit-sellerie-serie-b5-classic-chevron-30mm-gabaritsfr.png',
        '006': '/images/gabarit-sellerie-serie-b6-classic-chevron-40mm-gabaritsfr.png',
        '007': '/images/gabarit-sellerie-serie-b7-classic-chevron-50mm-gabaritsfr.png',
        '008': '/images/gabarit-sellerie-serie-b8-classic-chevron-70mm-gabaritsfr.png',
        '009': '/images/gabarit-sellerie-serie-b9-classic-chevron-30mm-gabaritsfr.png',
        '010': '/images/gabarit-sellerie-serie-b10-classic-chevron-40mm-gabaritsfr.png',
        '011': '/images/gabarit-sellerie-serie-b11-classic-chevron-50mm-gabaritsfr.png',
        '012': '/images/gabarit-sellerie-serie-b12-classic-chevron-70mm-gabaritsfr.png'
      };
      const imageMapC = {
        '001': '/images/gabarit-sellerie-serie-c1-classic-curve-30mm-gabaritsfr.png',
        '002': '/images/gabarit-sellerie-serie-c2-classic-curve-40mm-gabaritsfr.png',
        '003': '/images/gabarit-sellerie-serie-c3-classic-curve-50mm-gabaritsfr.png',
        '004': '/images/gabarit-sellerie-serie-c4-classic-curve-70mm-gabaritsfr.png',
        '005': '/images/gabarit-sellerie-serie-c5-classic-curve-30mm-gabaritsfr.png',
        '006': '/images/gabarit-sellerie-serie-c6-classic-curve-40mm-gabaritsfr.png',
        '007': '/images/gabarit-sellerie-serie-c7-classic-curve-50mm-gabaritsfr.png',
        '008': '/images/gabarit-sellerie-serie-c8-classic-curve-70mm-gabaritsfr.png',
        '009': '/images/gabarit-sellerie-serie-c9-classic-curve-40mm-gabaritsfr.png',
        '010': '/images/gabarit-sellerie-serie-c10-classic-curve-40mm-gabaritsfr.png',
        '011': '/images/gabarit-sellerie-serie-c11-classic-curve-50mm-gabaritsfr.png',
        '012': '/images/gabarit-sellerie-serie-c12-classic-curve-70mm-gabaritsfr.png'
      };
      const imageMapD = {
        '001': '/images/gabarit-sellerie-serie-d1-classic-curve-40mm-gabaritsfr.png',
        '002': '/images/gabarit-sellerie-serie-d2-classic-curve-50mm-gabaritsfr.png',
        '003': '/images/gabarit-sellerie-serie-d3-classic-curve-70mm-gabaritsfr.png',
        '004': '/images/gabarit-sellerie-serie-d4-classic-curve-40mm-gabaritsfr.png',
        '005': '/images/gabarit-sellerie-serie-d5-classic-curve-50mm-gabaritsfr.png',
        '006': '/images/gabarit-sellerie-serie-d6-classic-curve-40mm-gabaritsfr.png',
        '007': '/images/gabarit-sellerie-serie-d7-classic-curve-40mm-gabaritsfr.png',
        '008': '/images/gabarit-sellerie-serie-d8-classic-curve-50mm-gabaritsfr.png',
        '009': '/images/gabarit-sellerie-serie-d9-classic-curve-70mm-gabaritsfr.png'
      };
      const imageMapF = {
        '001': '/images/gabarit-sellerie-serie-f1-line-sport-30mm-gabaritsfr.png',
        '002': '/images/gabarit-sellerie-serie-f2-line-sport-40mm-gabaritsfr.png',
        '003': '/images/gabarit-sellerie-serie-f3-line-sport-50mm-gabaritsfr.png',
        '004': '/images/gabarit-sellerie-serie-f4-line-sport-70mm-gabaritsfr.png'
      };
      const imageMapG = {
        '001': '/images/gabarit-sellerie-serie-g1-special-nda-gabaritsfr.png',
        '002': '/images/gabarit-sellerie-serie-g2-special-nda-gabaritsfr.png',
        '003': '/images/gabarit-sellerie-serie-g3-special-nda-gabaritsfr.png',
        '004': '/images/gabarit-sellerie-serie-g4-special-nda-gabaritsfr.png',
        '005': '/images/gabarit-sellerie-serie-g5-special-nda-gabaritsfr.png',
        '006': '/images/gabarit-sellerie-serie-g6-special-nda-gabaritsfr.png',
        '007': '/images/gabarit-sellerie-serie-g7-special-nda-gabaritsfr.png',
        '008': '/images/gabarit-sellerie-serie-g8-special-nda-gabaritsfr.png',
        '009': '/images/gabarit-sellerie-serie-g9-special-nda-gabaritsfr.png',
        '010': '/images/gabarit-sellerie-serie-g10-special-nda-gabaritsfr.png',
        '011': '/images/gabarit-sellerie-serie-g11-special-nda-gabaritsfr.png',
        '012': '/images/gabarit-sellerie-serie-g12-special-nda-gabaritsfr.png',
        '013': '/images/gabarit-sellerie-serie-g13-special-nda-gabaritsfr.png',
        '014': '/images/gabarit-sellerie-serie-g14-special-nda-gabaritsfr.png',
        '015': '/images/gabarit-sellerie-serie-g15-special-nda-gabaritsfr.png',
        '016': '/images/gabarit-sellerie-serie-g16-special-nda-gabaritsfr.png',
        '017': '/images/gabarit-sellerie-serie-g17-special-nda-gabaritsfr.png'
      };
      const imageMapH = {
        '001': '/images/gabarit-sellerie-serie-h1-special-harley-gabaritsfr.png',
        '002': '/images/gabarit-sellerie-serie-h2-special-harley-gabaritsfr.png',
        '003': '/images/gabarit-sellerie-serie-h3-special-harley-gabaritsfr.png',
        '004': '/images/gabarit-sellerie-serie-h4-special-harley-gabaritsfr.png'
      };
      const imageMapI = {
        '001': '/images/gabarit-sellerie-serie-I1-pano-&-selle-gabaritsfr.png',
        '002': '/images/gabarit-sellerie-serie-I2-pano-&-selle-gabaritsfr.png',
        '003': '/images/gabarit-sellerie-serie-I3-pano-&-selle-gabaritsfr.png',
        '004': '/images/gabarit-sellerie-serie-I4-pano-&-selle-gabaritsfr.png',
        '005': '/images/gabarit-sellerie-serie-I5-pano-&-selle-gabaritsfr.png',
        '006': '/images/gabarit-sellerie-serie-I6-pano-&-selle-gabaritsfr.png',
        '007': '/images/gabarit-sellerie-serie-I7-pano-&-selle-gabaritsfr.png',
        '008': '/images/gabarit-sellerie-serie-I8-pano-&-selle-gabaritsfr.png',
        '009': '/images/gabarit-sellerie-serie-I9-pano-&-selle-gabaritsfr.png'
      };
      const imageMapJ = {
        '001': '/images/gabarit-sellerie-serie-J1-classic-ovale-gabaritsfr.png',
        '002': '/images/gabarit-sellerie-serie-J2-classic-ovale-gabaritsfr.png',
        '003': '/images/gabarit-sellerie-serie-J3-classic-ovale-gabaritsfr.png',
        '004': '/images/gabarit-sellerie-serie-J4-classic-ovale-gabaritsfr.png',
        '005': '/images/gabarit-sellerie-serie-J5-classic-ovale-gabaritsfr.png',
        '006': '/images/gabarit-sellerie-serie-J6-classic-ovale-gabaritsfr.png',
        '007': '/images/gabarit-sellerie-serie-J7-classic-ovale-gabaritsfr.png',
        '008': '/images/gabarit-sellerie-serie-J8-classic-ovale-gabaritsfr.png',
        '009': '/images/gabarit-sellerie-serie-J9-classic-ovale-gabaritsfr.png'
      };
      const imageMapK = {
        '001': '/images/gabarit-sellerie-serie-K1-classic-lacer-gabaritsfr.png',
        '002': '/images/gabarit-sellerie-serie-K2-classic-lacer-gabaritsfr.png',
        '003': '/images/gabarit-sellerie-serie-K3-classic-lacer-gabaritsfr.png',
        '004': '/images/gabarit-sellerie-serie-K4-classic-lacer-gabaritsfr.png'
      };
      const imageMapL = {
        '001': '/images/gabarit-sellerie-serie-L1-classic-wave-gabaritsfr.png',
        '002': '/images/gabarit-sellerie-serie-L2-classic-wave-gabaritsfr.png',
        '003': '/images/gabarit-sellerie-serie-L3-classic-wave-gabaritsfr.png',
        '004': '/images/gabarit-sellerie-serie-L4-classic-wave-gabaritsfr.png',
        '005': '/images/gabarit-sellerie-serie-L5-classic-wave-gabaritsfr.png'
      };
      const imageMapM = {
        '001': '/images/gabarit-sellerie-serie-M1-classic-losange-gabaritsfr.png',
        '002': '/images/gabarit-sellerie-serie-M2-classic-losange-gabaritsfr.png',
        '003': '/images/gabarit-sellerie-serie-M3-classic-losange-gabaritsfr.png',
        '004': '/images/gabarit-sellerie-serie-M4-classic-losange-gabaritsfr.png',
        '005': '/images/gabarit-sellerie-serie-M5-classic-losange-gabaritsfr.png',
        '006': '/images/gabarit-sellerie-serie-M6-classic-losange-gabaritsfr.png',
        '007': '/images/gabarit-sellerie-serie-M7-classic-losange-gabaritsfr.png',
        '008': '/images/gabarit-sellerie-serie-M8-classic-losange-gabaritsfr.png',
        '009': '/images/gabarit-sellerie-serie-M9-classic-losange-gabaritsfr.png',
        '010': '/images/gabarit-sellerie-serie-M10-classic-losange-gabaritsfr.png'
      };
      const imageMapE = {
        '001': '/images/gabarit-sellerie-serie-e1-classic-spider-30mm-gabaritsfr.png',
        '002': '/images/gabarit-sellerie-serie-e2-classic-spider-50mm-gabaritsfr.png',
        '003': '/images/gabarit-sellerie-serie-e3-classic-spider-50mm-gabaritsfr.png',
        '004': '/images/gabarit-sellerie-serie-e4-sclassic-pider-gabaritsfr.png',
        '005': '/images/gabarit-sellerie-serie-e5-classic-spider-gabaritsfr.png',
        '006': '/images/gabarit-sellerie-serie-e6-classic-spider-gabaritsfr.png'
      };
      const image =
        letter === 'A'
          ? imageMapA[modelNum] || null
          : letter === 'B'
          ? imageMapB[modelNum] || null
          : letter === 'C'
          ? imageMapC[modelNum] || null
          : letter === 'D'
          ? imageMapD[modelNum] || null
          : letter === 'E'
          ? imageMapE[modelNum] || null
          : letter === 'F'
          ? imageMapF[modelNum] || null
          : letter === 'G'
          ? imageMapG[modelNum] || null
          : letter === 'H'
          ? imageMapH[modelNum] || null
          : letter === 'I'
          ? imageMapI[modelNum] || null
          : letter === 'J'
          ? imageMapJ[modelNum] || null
          : letter === 'K'
          ? imageMapK[modelNum] || null
          : letter === 'L'
          ? imageMapL[modelNum] || null
          : letter === 'M'
          ? imageMapM[modelNum] || null
          : null;
      const notesMapA = {
        '001': 'COTES 30 mm',
        '002': 'COTES 40 mm',
        '003': 'COTES 50 mm',
        '004': 'COTES 30 mm',
        '005': 'COTES 40 mm'
      };
      const notesMapC = {
        '001': 'COTES 30 mm',
        '002': 'COTES 40 mm',
        '003': 'COTES 50 mm',
        '004': 'COTES 70 mm',
        '005': 'COTES 30 mm',
        '006': 'COTES 40 mm',
        '007': 'COTES 50 mm',
        '008': 'COTES 70 mm',
        '009': 'COTES 40 mm',
        '010': 'COTES 40 mm',
        '011': 'COTES 50 mm',
        '012': 'COTES 70 mm'
      };
      const photoNotes =
        letter === 'A'
          ? notesMapA[modelNum] || null
          : letter === 'C'
          ? notesMapC[modelNum] || null
          : null;

      products.push({
        id: `${letter}-${modelNum}`,
        series: letter,
        model: modelNum,
        name: `${letter}-${modelNum}`,
        description: descriptions[descIndex],
        basePrice: 100,
        sizes: ['S', 'M', 'L'],
        rating: (4 + Math.random() * 0.9).toFixed(1),
        popular: i <= 2,
        color: `bg-gradient-to-br from-amber-${400 + idx * 100} to-orange-${300 + idx * 100}`,
        image,
        photoNotes
      });
    }
  });

  return products.sort(() => Math.random() - 0.5);
};

// ============= CARTE PRODUIT =============
const ProductCard = ({
  product,
  onAddToCart,
  isFavorite,
  onToggleFavorite,
  onView,
  isFeatured,
  onWhatsApp
}) => {
  const [hover, setHover] = useState(false);
  const seriesStyles = {
    A: 'classic cotes',
    B: 'classic chevron',
    C: 'classic curve',
    D: 'classic curve',
    E: 'classic spider',
    F: 'line sport',
    G: 'special nda',
    H: 'special harley',
    I: 'pano selle',
    J: 'classic ovale',
    K: 'classic lacer',
    L: 'classic wave',
    M: 'classic losange'
  };
  const mm =
    (String(product.photoNotes || product.image || '').match(/(30mm|40mm|50mm|70mm)/i) || [])[1] ||
    '';

  return (
    <div
      className={`relative bg-gradient-to-b from-white to-gray-50 rounded-3xl transition-all duration-500 hover:scale-[1.02] group cursor-pointer
        ${
          isFeatured
            ? 'border-4 border-amber-500 shadow-2xl'
            : 'border-2 border-gray-100 shadow-xl hover:shadow-2xl'
        }`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => onView(product)}
    >
      {product.popular && (
        <div className="absolute top-3 left-3 z-10">
          <div className="bg-amber-600 text-white px-2 py-1 rounded-md font-bold text-[10px] shadow-md">
            POPULAIRE
          </div>
        </div>
      )}

      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(product.id);
        }}
        className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 transition-transform"
      >
        <Heart
          size={20}
          className={`transition-colors ${
            isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'
          }`}
        />
      </button>

      <div className={`relative h-44 ${product.color} rounded-t-3xl overflow-hidden`}>
        {product.image && (
          <img
            src={product.image}
            alt={`Série ${product.series} ${product.model}`}
            className="absolute inset-0 w-full h-full object-contain opacity-80 select-none"
            draggable="false"
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            style={{ clipPath: 'inset(2% 2% 2% 2%)' }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent"></div>
        <div className="relative z-10 p-5 h-full flex flex-col justify-end">
          <div>
            <span className="text-3xl font-bold text-white drop-shadow">{product.series}</span>
            <div className="text-white/80 text-xs font-mono mt-1">#{product.model}</div>
          </div>
        </div>
      </div>

      {/* Contenu produit */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
          {product.name}
        </h3>
        <div className="text-xs text-gray-500 mb-1">
          {`Série ${product.series} • ${seriesStyles[product.series] || ''}${mm ? ` • ${mm}` : ''}`}
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={`${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
            <span className="text-gray-700 font-semibold ml-2 text-sm">{product.rating}</span>
          </div>
          <div className="text-gray-600 text-xs font-semibold">{product.sizes.length} tailles</div>
        </div>

        {/* Prix et quantités */}
        <div className="mb-6">
          <div className="flex items-end justify-between mb-3">
            <div>
              <div className="text-3xl font-bold text-amber-600">{product.basePrice}€</div>
              <div className="text-gray-500 text-sm">unité</div>
            </div>
          </div>
          <div className="mb-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onWhatsApp && onWhatsApp(product);
              }}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold shadow"
            >
              WhatsApp
            </button>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-semibold text-gray-700">Stock disponible</div>
            <ProgressBar
              current={product.stockCurrent ?? Math.floor(Math.random() * 15)}
              target={product.stockTarget ?? 20}
            />
          </div>
        </div>

        {/* Tailles */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">Choisir la taille:</span>
            <span className="text-xs text-gray-500">3 disponibles</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {product.sizes.map((size, idx) => (
              <button
                key={size}
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(product, size);
                }}
                className={`relative py-3 rounded-xl font-bold transition-all duration-300 group/btn
                  ${
                    hover
                      ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg transform -translate-y-1'
                      : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800'
                  }`}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <div className="relative z-10 flex flex-col items-center">
                  <Plus
                    size={16}
                    className="mb-1 opacity-0 group-hover/btn:opacity-100 transition-opacity"
                  />
                  <span>{size}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============= BARREL CAROUSEL AMÉLIORÉ =============
const BarrelCarousel = ({
  products,
  onAddToCart,
  favorites,
  onToggleFavorite,
  onView,
  onWhatsApp
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const handleWheel = useCallback(
    (e) => {
      e.preventDefault();
      if (isAnimating) return;
      if (e.deltaY > 0) handleScroll('next');
      else handleScroll('prev');
    },
    [isAnimating]
  );

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleScroll('next');
      } else {
        handleScroll('prev');
      }
    }
    setTouchStart(null);
  };

  const handleScroll = useCallback(
    (direction) => {
      if (isAnimating) return;
      setIsAnimating(true);

      setCurrentIndex((prev) => {
        if (direction === 'next') return (prev + 1) % products.length;
        if (direction === 'prev') return (prev - 1 + products.length) % products.length;
        return prev;
      });

      setTimeout(() => setIsAnimating(false), 600);
    },
    [isAnimating, products.length]
  );

  const getVisibleProducts = () => {
    const isMobile = window.innerWidth < 768;
    const range = isMobile ? 2 : 3;
    const visible = [];

    for (let i = -range; i <= range; i++) {
      const index = (currentIndex + i + products.length) % products.length;
      const scaleCenter = 1.02;
      const scaleSide = 0.96 - Math.abs(i) * 0.04;
      visible.push({
        product: products[index],
        offset: i,
        key: `${products[index].id}-${i}`,
        zIndex: 50 - Math.abs(i) * 10,
        opacity: 1 - Math.abs(i) * 0.12,
        scale: i === 0 ? scaleCenter : scaleSide
      });
    }

    return visible;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleScroll('next');
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, handleScroll]);

  return (
    <div
      className="relative py-10 bg-gradient-to-b from-gray-50 to-white rounded-3xl overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      {/* Background décoratif */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-transparent"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* En-tête carousel */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Explorez nos{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">
              Gabarits Premium
            </span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Sélectionnez, visualisez et commandez vos gabarits avec notre interface 3D immersive
          </p>
        </div>

        {/* Conteneur du carousel */}
        <div className="relative" style={{ minHeight: 'calc(100vh - 260px)' }}>
          {getVisibleProducts().map(({ product, offset, key, zIndex, opacity, scale }) => {
            const isMobile = window.innerWidth < 768;
            const rotation = isMobile ? 0 : offset * 20;
            const cardWidth = isMobile ? 360 : 480;
            const gap = isMobile ? 12 : 24;
            const translateX = offset * (cardWidth + gap);
            const translateZ = 0;

            return (
              <div
                key={key}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-out"
                style={{
                  transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotation}deg) scale(${scale})`,
                  opacity,
                  zIndex,
                  filter: `blur(${Math.abs(offset) * 0.5}px)`,
                  transformStyle: 'preserve-3d',
                  pointerEvents: offset === 0 ? 'auto' : 'none'
                }}
              >
                <div
                  className={`transition-transform duration-700 w-[340px] sm:w-[400px] lg:w-[460px]`}
                >
                  <ProductCard
                    product={product}
                    onAddToCart={onAddToCart}
                    isFavorite={favorites.includes(product.id)}
                    onToggleFavorite={onToggleFavorite}
                    onView={onView}
                    isFeatured={offset === 0}
                    onWhatsApp={onWhatsApp}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Contrôles */}
        <div className="flex justify-center items-center space-x-8 mt-12">
          <button
            onClick={() => handleScroll('prev')}
            disabled={isAnimating}
            className="p-4 bg-gradient-to-br from-white to-gray-100 rounded-2xl shadow-2xl hover:shadow-3xl transition-all hover:scale-110 disabled:opacity-50"
          >
            <ChevronDown size={16} className="text-amber-600 rotate-90" />
          </button>

          <div className="flex flex-col items-center">
            <div className="text-amber-600 text-sm font-semibold mb-2">Navigation</div>
            <div className="flex space-x-3">
              {products.slice(0, 5).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setIsAnimating(true);
                    setCurrentIndex(idx);
                    setTimeout(() => setIsAnimating(false), 600);
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentIndex % products.length === idx
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 scale-125'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={() => handleScroll('next')}
            disabled={isAnimating}
            className="p-4 bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all hover:scale-110 disabled:opacity-50"
          >
            <ChevronDown size={16} className="rotate-270" />
          </button>
        </div>

        {/* Indicateur de progression */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-4 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
            <span className="text-gray-700 font-semibold">Modèle</span>
            <span className="text-2xl font-bold text-amber-600">{currentIndex + 1}</span>
            <span className="text-gray-400">sur</span>
            <span className="text-gray-700 font-semibold">{products.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============= PANIER AMÉLIORÉ =============
const Cart = ({
  cart,
  cartTotal,
  onUpdateQuantity,
  onRemoveFromCart,
  onClose,
  showCart,
  onCheckout,
  showToast,
  onAddAccessory,
  onOrderSuccess,
  promo,
  onApplyPromo,
  prize,
  onOpenRoulette,
  rouletteUsed
}) => {
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientNotes] = useState('');

  // Liste des accessoires disponibles
  const accessories = [
    {
      id: 'acc-1',
      name: 'Stylo Traçage Pro',
      description: 'Pointe fine 0.5mm',
      price: 4.9,
      emoji: '🖊️',
      category: 'stylos',
      color: 'indigo',
      rating: 5,
      reviews: 128
    },
    {
      id: 'acc-2',
      name: 'Pack 5 Stylos Couleurs',
      description: 'Multicolore premium',
      price: 14.9,
      originalPrice: 19.9,
      emoji: '✏️',
      category: 'stylos',
      color: 'purple',
      rating: 5,
      reviews: 89,
      badge: '🔥 BEST'
    },
    {
      id: 'acc-3',
      name: 'Cutter Précision',
      description: 'Lame acier japonais',
      price: 12.9,
      emoji: '🔪',
      category: 'outils',
      color: 'emerald',
      rating: 4,
      reviews: 67
    },
    {
      id: 'acc-4',
      name: 'Règle Métal 50cm',
      description: 'Inox anti-rayures',
      price: 8.5,
      emoji: '📏',
      category: 'outils',
      color: 'gray',
      rating: 5,
      reviews: 203
    },
    {
      id: 'acc-5',
      name: 'Kit Sellerie Complet',
      description: '10 outils essentiels',
      price: 39.9,
      originalPrice: 59.9,
      emoji: '🧰',
      category: 'kits',
      color: 'amber',
      rating: 5,
      reviews: 312,
      badge: '⭐ PROMO'
    },
    {
      id: 'acc-6',
      name: 'Tapis Découpe A3',
      description: 'Auto-cicatrisant',
      price: 18.9,
      emoji: '🟩',
      category: 'kits',
      color: 'cyan',
      rating: 5,
      reviews: 156
    }
  ];

  const handleAddAccessory = (accessory) => {
    if (onAddAccessory) {
      onAddAccessory(accessory);
      showToast && showToast(`🎉 ${accessory.name} ajouté au panier!`);
    }
  };

  const normalizePhone = (value) => {
    const v = String(value || '').trim();
    const hasPlus = v.startsWith('+');
    const digits = v.replace(/[^\d]/g, '');
    if (hasPlus) return `+${digits}`;
    if (digits.startsWith('0')) return `+33${digits.slice(1)}`;
    if (digits.length >= 8) return `+33${digits}`;
    return digits;
  };
  const handlePhoneBlur = () => {
    setClientPhone(normalizePhone(clientPhone));
  };
  const cleanedPhone = clientPhone.replace(/[^\d]/g, '');
  const canSend = clientName.trim().length > 0 && cleanedPhone.length >= 8;
  const nameError = clientName.trim().length === 0;
  const phoneError = cleanedPhone.length < 8;
  const [promoInput, setPromoInput] = useState('');
  if (!showCart) return null;

  const sendOrderToBackend = async () => {
    if (!cart || cart.length === 0) {
      showToast && showToast('Votre panier est vide', 'error');
      return;
    }
    if (!canSend) {
      showToast && showToast('Veuillez renseigner nom et téléphone valides', 'error');
      return;
    }
    try {
      const payload = {
        client: { name: clientName.trim(), phone: clientPhone.trim(), notes: clientNotes },
        cart,
        totals: {
          subtotal: cartTotal.subtotal,
          final_total: cartTotal.finalTotal,
          subtotalGabarits: cartTotal.subtotalGabarits,
          subtotalAccessoires: cartTotal.subtotalAccessoires,
          pricePerUnit: cartTotal.pricePerUnit,
          totalItems: cartTotal.totalItems,
          totalGabarits: cartTotal.totalGabarits,
          discount: cartTotal.discount,
          promo_code: promo?.code || '',
          promo_amount: cartTotal.promoAmount,
          prize_label: prize?.label || '',
          prize_discount: cartTotal.prizeDiscount
        },
        meta: { ref: `CMD-${Date.now()}` }
      };
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        showToast && showToast("Erreur lors de l'envoi de la commande", 'error');
        return;
      }
      if (typeof onOrderSuccess === 'function') {
        onOrderSuccess(cartTotal);
      } else {
        showToast && showToast('Commande envoyée au commerçant');
      }
    } catch (e) {
      showToast && showToast('Erreur réseau', 'error');
    }
  };

  const contactMerchant = () => {
    if (!cart || cart.length === 0) {
      showToast && showToast('Votre panier est vide', 'error');
      return;
    }
    if (!canSend) {
      showToast && showToast('Veuillez renseigner nom et téléphone valides', 'error');
      return;
    }
    const raw = process.env.REACT_APP_MERCHANT_PHONE || '+33759652867';
    const phone = raw.replace(/[^\d]/g, '');

    // Séparer gabarits et accessoires pour le message
    const gabarits = cart.filter((item) => !item.isAccessory);
    const accessoires = cart.filter((item) => item.isAccessory);

    // Lignes pour les gabarits (prix par palier)
    const gabaritLines = gabarits.map(
      (item) =>
        `🔧 ${item.name} | Taille ${item.size || '-'} | Qté ${item.quantity} | ${
          item.quantity * cartTotal.pricePerUnit
        }€`
    );

    // Lignes pour les accessoires (prix propre)
    const accessoireLines = accessoires.map(
      (item) =>
        `📦 ${item.name} | Qté ${item.quantity} | ${(item.quantity * (item.basePrice || 0)).toFixed(
          2
        )}€`
    );

    // Construire le récapitulatif
    const recapLines = [];
    if (gabarits.length > 0) {
      recapLines.push('--- GABARITS ---');
      recapLines.push(...gabaritLines);
      recapLines.push(
        `Sous-total gabarits: ${cartTotal.subtotalGabarits}€ (${cartTotal.totalGabarits}x ${cartTotal.pricePerUnit}€)`
      );
      if (cartTotal.discount > 0) {
        recapLines.push(`Remise volume: -${cartTotal.discount}€`);
      }
    }
    if (accessoires.length > 0) {
      if (gabarits.length > 0) recapLines.push('');
      recapLines.push('--- ACCESSOIRES ---');
      recapLines.push(...accessoireLines);
      recapLines.push(`Sous-total accessoires: ${cartTotal.subtotalAccessoires.toFixed(2)}€`);
    }

    const totalLine = `✅ TOTAL: ${cartTotal.subtotal.toFixed(2)}€`;
    const headerLines = [
      `👤 Client: ${clientName || '—'} | 📞 Téléphone: ${clientPhone || '—'}`,
      clientNotes ? `📝 Notes: ${clientNotes}` : null
    ].filter(Boolean);
    const msg = encodeURIComponent(
      [
        '🛒 Bonjour, je souhaite discuter de cette commande:',
        '',
        ...headerLines,
        '',
        ...recapLines,
        '',
        totalLine
      ].join('\r\n')
    );
    const apiUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${msg}`;
    const ua = navigator.userAgent || '';
    const isIOS = /iPhone|iPad|iPod/i.test(ua);
    const isAndroid = /Android/i.test(ua);
    const isMobile = isIOS || isAndroid;

    if (isMobile) {
      window.location.href = apiUrl;
    } else {
      window.open(apiUrl, '_blank');
    }

    setTimeout(() => {
      if (isMobile) return;
      const to = process.env.REACT_APP_ORDER_EMAIL || 'fadymezghani12345@gmail.com';
      const subject = encodeURIComponent('Commande de gabarits et accessoires');
      const body = encodeURIComponent(
        [
          'Bonjour,',
          '',
          'Je souhaite valider la commande suivante:',
          '',
          ...recapLines,
          '',
          totalLine,
          '',
          'Merci de me confirmer la disponibilité et le délai.',
          'Cordialement,'
        ].join('\r\n')
      );
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />

      {/* Container principal avec 2 panneaux */}
      <div className="absolute right-0 top-0 h-full w-full max-w-5xl animate-slide-in-right flex">
        {/* ONGLET GAUCHE - Compléter votre commande */}
        <div className="hidden lg:block w-96 h-full bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 border-r-2 border-indigo-200 shadow-xl overflow-hidden">
          <div className="h-full flex flex-col">
            {/* En-tête onglet suppléments */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
              <div className="relative z-10">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Sparkles size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Compléter votre commande</h3>
                    <p className="text-purple-100 text-xs">Accessoires recommandés pour vous</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Liste des accessoires */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {/* Catégorie: Stylos */}
              <div className="mb-2">
                <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2 flex items-center">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                  Stylos & Marqueurs
                </h4>
              </div>

              {/* Accessoires Stylos */}
              {accessories
                .filter((a) => a.category === 'stylos')
                .map((accessory) => (
                  <div
                    key={accessory.id}
                    className={`bg-white rounded-2xl p-3 shadow-lg border border-${accessory.color}-100 hover:border-${accessory.color}-300 hover:shadow-xl transition-all duration-300 group cursor-pointer relative overflow-hidden`}
                  >
                    {accessory.badge && (
                      <div className="absolute top-2 right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {accessory.badge}
                      </div>
                    )}
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-14 h-14 bg-gradient-to-br from-${accessory.color}-500 to-${accessory.color}-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                      >
                        <span className="text-2xl">{accessory.emoji}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-gray-900 text-sm truncate">
                          {accessory.name}
                        </h5>
                        <p className="text-xs text-gray-500 truncate">{accessory.description}</p>
                        <div className="flex items-center mt-1">
                          <span className="text-xs text-yellow-500">
                            {'★'.repeat(accessory.rating)}
                            {'☆'.repeat(5 - accessory.rating)}
                          </span>
                          <span className="text-xs text-gray-400 ml-1">({accessory.reviews})</span>
                        </div>
                      </div>
                      <div className="text-right">
                        {accessory.originalPrice && (
                          <p className="text-xs text-gray-400 line-through">
                            {accessory.originalPrice.toFixed(2)}€
                          </p>
                        )}
                        <p className={`text-lg font-bold text-${accessory.color}-600`}>
                          {accessory.price.toFixed(2)}€
                        </p>
                        <button
                          onClick={() => handleAddAccessory(accessory)}
                          className={`mt-1 w-8 h-8 bg-gradient-to-r from-${accessory.color}-500 to-${accessory.color}-600 rounded-lg flex items-center justify-center text-white hover:scale-110 transition-transform shadow-md`}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

              {/* Catégorie: Outils */}
              <div className="mb-2 mt-4">
                <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2 flex items-center">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                  Outils & Accessoires
                </h4>
              </div>

              {/* Accessoires Outils */}
              {accessories
                .filter((a) => a.category === 'outils')
                .map((accessory) => (
                  <div
                    key={accessory.id}
                    className={`bg-white rounded-2xl p-3 shadow-lg border border-${accessory.color}-100 hover:border-${accessory.color}-300 hover:shadow-xl transition-all duration-300 group cursor-pointer relative overflow-hidden`}
                  >
                    {accessory.badge && (
                      <div className="absolute top-2 right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {accessory.badge}
                      </div>
                    )}
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-14 h-14 bg-gradient-to-br from-${accessory.color}-500 to-${accessory.color}-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                      >
                        <span className="text-2xl">{accessory.emoji}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-gray-900 text-sm truncate">
                          {accessory.name}
                        </h5>
                        <p className="text-xs text-gray-500 truncate">{accessory.description}</p>
                        <div className="flex items-center mt-1">
                          <span className="text-xs text-yellow-500">
                            {'★'.repeat(accessory.rating)}
                            {'☆'.repeat(5 - accessory.rating)}
                          </span>
                          <span className="text-xs text-gray-400 ml-1">({accessory.reviews})</span>
                        </div>
                      </div>
                      <div className="text-right">
                        {accessory.originalPrice && (
                          <p className="text-xs text-gray-400 line-through">
                            {accessory.originalPrice.toFixed(2)}€
                          </p>
                        )}
                        <p className={`text-lg font-bold text-${accessory.color}-600`}>
                          {accessory.price.toFixed(2)}€
                        </p>
                        <button
                          onClick={() => handleAddAccessory(accessory)}
                          className={`mt-1 w-8 h-8 bg-gradient-to-r from-${accessory.color}-500 to-${accessory.color}-600 rounded-lg flex items-center justify-center text-white hover:scale-110 transition-transform shadow-md`}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

              {/* Catégorie: Kits */}
              <div className="mb-2 mt-4">
                <h4 className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2 flex items-center">
                  <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                  Kits Complets
                </h4>
              </div>

              {/* Accessoires Kits */}
              {accessories
                .filter((a) => a.category === 'kits')
                .map((accessory) => (
                  <div
                    key={accessory.id}
                    className={`${
                      accessory.badge
                        ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300'
                        : 'bg-white border border-cyan-100'
                    } rounded-2xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer relative overflow-hidden`}
                  >
                    {accessory.badge && (
                      <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                        {accessory.badge}
                      </div>
                    )}
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-14 h-14 bg-gradient-to-br from-${accessory.color}-500 to-${accessory.color}-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                      >
                        <span className="text-2xl">{accessory.emoji}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-gray-900 text-sm truncate">
                          {accessory.name}
                        </h5>
                        <p className="text-xs text-gray-500 truncate">{accessory.description}</p>
                        <div className="flex items-center mt-1">
                          <span className="text-xs text-yellow-500">
                            {'★'.repeat(accessory.rating)}
                            {'☆'.repeat(5 - accessory.rating)}
                          </span>
                          <span className="text-xs text-gray-400 ml-1">({accessory.reviews})</span>
                        </div>
                      </div>
                      <div className="text-right">
                        {accessory.originalPrice && (
                          <p className="text-xs text-gray-400 line-through">
                            {accessory.originalPrice.toFixed(2)}€
                          </p>
                        )}
                        <p className={`text-lg font-bold text-${accessory.color}-600`}>
                          {accessory.price.toFixed(2)}€
                        </p>
                        <button
                          onClick={() => handleAddAccessory(accessory)}
                          className={`mt-1 w-8 h-8 bg-gradient-to-r from-${accessory.color}-500 to-${accessory.color}-600 rounded-lg flex items-center justify-center text-white hover:scale-110 transition-transform shadow-md`}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Footer onglet suppléments */}
            <div className="p-3 bg-gradient-to-r from-indigo-100 to-purple-100 border-t border-indigo-200">
              <p className="text-xs text-center text-indigo-700 font-medium">
                🎁 Livraison gratuite dès 50€ d'accessoires
              </p>
            </div>
          </div>
        </div>

        {/* ONGLET DROIT - Panier principal */}
        <div className="flex-1 h-full bg-gradient-to-b from-white to-gray-50 shadow-2xl border-l-4 border-amber-500 flex flex-col">
          {/* En-tête */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ShoppingCart size={20} className="text-white" />
                <h2 className="text-xl font-bold text-white">Votre Panier</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={24} className="text-white" />
              </button>
            </div>
            <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                onBlur={() => setClientName(clientName.trim())}
                placeholder="Nom du client (requis)"
                className="w-full px-2 py-1 bg-white/20 text-white placeholder-white/70 border border-white/30 rounded-md focus:border-white focus:ring-2 focus:ring-white/30 outline-none text-xs"
              />
              <input
                type="tel"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                onBlur={handlePhoneBlur}
                placeholder="Téléphone (requis)"
                className="w-full px-2 py-1 bg-white/20 text-white placeholder-white/70 border border-white/30 rounded-md focus:border-white focus:ring-2 focus:ring-white/30 outline-none text-xs"
              />
            </div>
            {nameError && <p className="text-red-100 text-xs mt-1">Nom requis pour envoyer</p>}
            {phoneError && (
              <p className="text-red-100 text-xs">Téléphone invalide, exemple +33XXXXXXXXX</p>
            )}
            {!phoneError && cleanedPhone && (
              <p className="text-white/90 text-xs">Numéro utilisé: {normalizePhone(clientPhone)}</p>
            )}

            {/* Code promo & Roulette */}
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 items-end">
              <div>
                <label className="text-xs font-semibold text-white/90">Code promo</label>
                <input
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="WELCOME10 / NOEL5 / GAB10"
                  className="mt-1 w-full px-2 py-1 bg-white/20 text-white placeholder-white/70 border border-white/30 rounded-md focus:border-white focus:ring-2 focus:ring-white/30 outline-none text-xs"
                />
                {promo?.code && cartTotal.promoAmount > 0 && (
                  <div className="text-green-100 text-xs font-semibold mt-1">
                    ✅ Code {promo.code} appliqué: -{cartTotal.promoAmount}€
                  </div>
                )}
              </div>
              <button
                onClick={() => onApplyPromo && onApplyPromo(promoInput)}
                className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-lg shadow hover:shadow-lg text-sm"
              >
                Appliquer
              </button>
              <button
                onClick={() => onOpenRoulette && onOpenRoulette()}
                disabled={rouletteUsed || cartTotal.subtotal < 50}
                className={`px-3 py-1.5 rounded-lg shadow text-sm font-bold transition ${
                  rouletteUsed || cartTotal.subtotal < 50
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg'
                }`}
              >
                🎁 Roulette
              </button>
              {rouletteUsed ? (
                <div className="text-white/90 text-xs font-semibold">Roulette utilisée</div>
              ) : cartTotal.subtotal < 50 ? (
                <div className="text-white/70 text-[11px]">Active à partir de 50€</div>
              ) : null}
            </div>
          </div>

          {/* Contenu du panier */}
          <div className="p-6 flex-1 overflow-y-auto">
            {cart.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingCart size={80} className="mx-auto text-gray-300 mb-6" />
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Panier vide</h3>
                <p className="text-gray-600 mb-8">Ajoutez des gabarits pour commencer</p>
                <button
                  onClick={onClose}
                  className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                >
                  Parcourir les produits
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item, idx) => (
                  <div
                    key={`${item.id}-${item.size}-${idx}`}
                    className={`bg-white rounded-xl p-3 shadow-md border ${
                      item.isAccessory ? 'border-indigo-200' : 'border-gray-100'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div
                        className={`w-12 h-12 ${
                          item.isAccessory
                            ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
                            : 'bg-gradient-to-br from-amber-500 to-amber-600'
                        } rounded-lg flex items-center justify-center`}
                      >
                        {item.isAccessory && item.emoji ? (
                          <span className="text-xl">{item.emoji}</span>
                        ) : (
                          <span className="text-white font-bold text-lg">{item.series}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-bold text-gray-900 text-sm">{item.name}</h4>
                            {item.isAccessory && (
                              <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">
                                Accessoire
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => onRemoveFromCart(item.id, item.size)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <X size={18} />
                          </button>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          {!item.isAccessory && (
                            <div className="flex items-center space-x-3">
                              <span className="text-sm text-gray-500">Taille:</span>
                              <span className="px-2 py-0.5 bg-gray-100 rounded-md font-bold text-xs">
                                {item.size}
                              </span>
                            </div>
                          )}
                          {item.isAccessory && (
                            <span className="text-xs text-indigo-600 font-medium">
                              {item.basePrice?.toFixed(2)}€ / unité
                            </span>
                          )}
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                              <button
                                onClick={() => onUpdateQuantity(item.id, item.size, -1)}
                                className="px-2 py-1 hover:bg-gray-200 rounded-md transition-colors"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="font-bold min-w-[26px] text-center text-sm">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => onUpdateQuantity(item.id, item.size, 1)}
                                className="px-2 py-1 hover:bg-gray-200 rounded-md transition-colors"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                            <span
                              className={`text-lg font-bold ${
                                item.isAccessory ? 'text-indigo-600' : 'text-amber-600'
                              }`}
                            >
                              {item.isAccessory
                                ? (item.quantity * (item.basePrice || 0)).toFixed(2)
                                : item.quantity * cartTotal.pricePerUnit}
                              €
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer du panier */}
          {cart.length > 0 && (
            <div className="border-t border-gray-200 p-4">
              {/* Progression remise (seulement pour les gabarits) */}
              {cartTotal.totalGabarits > 0 && (
                <div className="mb-3">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-gray-700">
                        {`Progression vers ${cartTotal.nextTarget || 20}+ gabarits`}
                      </span>
                      <span className="font-bold text-amber-600">
                        {cartTotal.totalGabarits}/{cartTotal.nextTarget || 20}
                      </span>
                    </div>
                    <ProgressBar
                      current={cartTotal.totalGabarits}
                      target={cartTotal.nextTarget || 20}
                    />
                  </div>
                  {cartTotal.nextTarget && (
                    <p className="text-xs text-amber-600 font-semibold text-center mt-2">
                      Plus que {cartTotal.nextTarget - cartTotal.totalGabarits} gabarits pour{' '}
                      {cartTotal.nextTarget >= 20 ? '85€/pièce' : '90€/pièce'}
                    </p>
                  )}
                </div>
              )}

              {/* Total */}
              <div className="space-y-2 mb-3">
                {/* Sous-total Gabarits */}
                {cartTotal.totalGabarits > 0 && (
                  <div className="flex justify-between text-gray-700 text-sm">
                    <span>
                      Gabarits ({cartTotal.totalGabarits}x {cartTotal.pricePerUnit}€)
                    </span>
                    <span className="font-bold">{cartTotal.subtotalGabarits}€</span>
                  </div>
                )}

                {/* Sous-total Accessoires */}
                {cartTotal.subtotalAccessoires > 0 && (
                  <div className="flex justify-between text-indigo-600 text-sm">
                    <span>Accessoires</span>
                    <span className="font-bold">{cartTotal.subtotalAccessoires.toFixed(2)}€</span>
                  </div>
                )}

                {/* Remise volume (seulement gabarits) */}
                {cartTotal.discount > 0 && (
                  <div className="flex justify-between text-green-600 text-sm">
                    <span>Remise volume gabarits</span>
                    <span className="font-bold">-{cartTotal.discount}€</span>
                  </div>
                )}
                {cartTotal.promoAmount > 0 && (
                  <div className="flex justify-between text-purple-600">
                    <span>{promo?.code ? `Code ${promo.code}` : 'Code promo'}</span>
                    <span className="font-bold">-{cartTotal.promoAmount}€</span>
                  </div>
                )}
                {cartTotal.prizeDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>{prize?.label || 'Gain roulette'}</span>
                    <span className="font-bold">-{cartTotal.prizeDiscount}€</span>
                  </div>
                )}

                {/* Total final */}
                <div className="border-t border-gray-300 pt-2 flex justify-between text-lg">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-amber-600">
                    {cartTotal.finalTotal.toFixed(2)}€
                  </span>
                </div>
              </div>

              {/* Actions de commande */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={contactMerchant}
                  disabled={!canSend}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-2 rounded-lg shadow hover:shadow-lg transition-all duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  💬 Contacter pour commander
                </button>
                <button
                  onClick={sendOrderToBackend}
                  disabled={!canSend}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-2 rounded-lg shadow hover:shadow-lg transition-all duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  📨 Envoyer au commerçant
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============= COMPOSANT PRINCIPAL =============
function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeries, setSelectedSeries] = useState('');

  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [viewHistory, setViewHistory] = useState([]);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [toast, setToast] = useState(null);
  const [filters, setFilters] = useState({
    series: [],
    sizes: [],
    maxPrice: 200
  });
  const [showOrders, setShowOrders] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState(null);
  const [showSeriesSheet, setShowSeriesSheet] = useState(false);
  const [showRoulette, setShowRoulette] = useState(false);
  const [promo, setPromo] = useState({ code: '', amount: 0 });
  const [prize, setPrize] = useState({ label: '', discount: 0, freeShipping: false });
  const [rouletteUsed, setRouletteUsed] = useState(false);
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('auth_token') || '');
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const raw = localStorage.getItem('auth_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // Redirige vers la page d’accueil UNIQUEMENT si l’utilisateur recharge (navigation POP)
  const navType = useNavigationType();
  useEffect(() => {
    if (navType === 'POP' && location.pathname === '/panier') {
      navigate('/', { replace: true });
    }
  }, [navType, location.pathname, navigate]);
  // CartId généré/chargé immédiatement afin d'être disponible avant l'ouverture de la roulette
  const [cartId, setCartId] = useState(() => {
    let cid = localStorage.getItem('gabarits-cartId');
    if (!cid) {
      cid =
        (typeof crypto !== 'undefined' && crypto.randomUUID?.()) ||
        Math.random().toString(36).substr(2, 10);
      try {
        localStorage.setItem('gabarits-cartId', cid);
      } catch (_) {
        /* ignore quota / safari private mode errors */
      }
    }
    return cid;
  });

  // Afficher la roulette à l’ouverture du site si l’utilisateur est connecté et n’a pas encore vu aujourd’hui
  useEffect(() => {
    if (location.pathname === '/' && currentUser) {
      const key = `roulette_shown_${currentUser.id}`;
      const last = localStorage.getItem(key);
      const today = new Date();
      const stamp = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
      if (last !== stamp) {
        setShowRoulette(true);
        localStorage.setItem(key, stamp);
      }
    }
  }, [location.pathname, currentUser]);

  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [showWarrantyModal, setShowWarrantyModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const products = useMemo(() => generateProducts(), []);
  const [stockMap, setStockMap] = useState({});
  const [imageManifest, setImageManifest] = useState({});
  useEffect(() => {
    fetch('/api/stock')
      .then((r) => r.json())
      .then((data) => setStockMap(data?.data || {}))
      .catch(() => setStockMap({}));
    fetch('/images-manifest.json')
      .then((r) => r.json())
      .then((data) => setImageManifest(data || {}))
      .catch(() => setImageManifest({}));
  }, []);
  const series = useMemo(() => [...new Set(products.map((p) => p.series))], [products]);

  const email = process.env.REACT_APP_ORDER_EMAIL || 'contact.gabarits@gmail.com';
  const phone = process.env.REACT_APP_MERCHANT_PHONE || '+33759652867';
  const fbUrl = process.env.REACT_APP_FACEBOOK_URL || 'https://facebook.com/gabarits.fr';
  const igUrl = process.env.REACT_APP_INSTAGRAM_URL || 'https://instagram.com/gabarits.fr';
  const liUrl = process.env.REACT_APP_LINKEDIN_URL || 'https://linkedin.com/';
  const waUrl = `https://wa.me/${phone.replace(/[^\\d]/g, '')}?text=${encodeURIComponent(
    'Bonjour, j’\u00e9 une question sur la livraison'
  )}`;

  // Persistance des données
  useEffect(() => {
    const saved = {
      cart: localStorage.getItem('gabarits-cart'),
      favorites: localStorage.getItem('gabarits-favorites'),
      history: localStorage.getItem('gabarits-history')
    };

    if (saved.cart) setCart(JSON.parse(saved.cart));
    const cid =
      localStorage.getItem('gabarits-cartId') ||
      crypto.randomUUID?.() ||
      Math.random().toString(36).substr(2, 10);
    localStorage.setItem('gabarits-cartId', cid);
    setCartId(cid);
    if (saved.favorites) setFavorites(JSON.parse(saved.favorites));
    if (saved.history) setViewHistory(JSON.parse(saved.history));
  }, []);

  useEffect(() => {
    localStorage.setItem('gabarits-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('gabarits-favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('gabarits-history', JSON.stringify(viewHistory));
  }, [viewHistory]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadOrders = async () => {
    const urls = [
      '/api/orders',
      'http://localhost:5002/api/orders',
      'http://localhost:5001/api/orders',
      'http://localhost:5000/api/orders'
    ];
    setOrdersLoading(true);
    setOrdersError(null);
    for (const url of urls) {
      try {
        const res = await fetch(url);
        const text = await res.text();
        let data = null;
        try {
          data = JSON.parse(text);
        } catch {
          data = null;
        }
        if (res.ok && data && data.ok) {
          setOrders(data.data || []);
          setOrdersLoading(false);
          return;
        }
      } catch (e) {
        // try next url
      }
    }
    setOrdersLoading(false);
    setOrdersError('Backend indisponible (proxy). Réessayez ou vérifiez le serveur.');
  };

  const filteredProducts = useMemo(() => {
    const decorated = products.map((p) => ({
      ...p,
      stockCurrent: stockMap[p.id]?.current ?? 15,
      stockTarget: stockMap[p.id]?.target ?? 20,
      image: imageManifest[p.id] || p.image
    }));
    return decorated.filter((product) => {
      const matchSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchSeries = !selectedSeries || product.series === selectedSeries;
      const matchFilters =
        (filters.series.length === 0 || filters.series.includes(product.series)) &&
        (filters.sizes.length === 0 ||
          product.sizes.some((size) => filters.sizes.includes(size))) &&
        product.basePrice <= filters.maxPrice;

      return matchSearch && matchSeries && matchFilters;
    });
  }, [products, stockMap, imageManifest, searchTerm, selectedSeries, filters]);

  const cartTotal = useMemo(() => {
    // Séparer les gabarits des accessoires
    const gabarits = cart.filter((item) => !item.isAccessory);
    const accessoires = cart.filter((item) => item.isAccessory);

    // Calculer le total des gabarits (avec prix par palier)
    const totalGabarits = gabarits.reduce((sum, item) => sum + item.quantity, 0);
    const pricePerUnit = totalGabarits >= 20 ? 85 : totalGabarits >= 10 ? 90 : 100;
    const subtotalGabarits = totalGabarits * pricePerUnit;
    const discount = totalGabarits * (100 - pricePerUnit);

    // Calculer le total des accessoires (avec leur prix propre)
    const subtotalAccessoires = accessoires.reduce(
      (sum, item) => sum + item.quantity * (item.basePrice || 0),
      0
    );

    // Total combiné
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = subtotalGabarits + subtotalAccessoires;
    const promoAmount = promo.amount || 0;
    const prizeDiscount = prize.discount || 0;

    // Calcul des frais de livraison
    const shippingCost = subtotal >= 200 || prize.freeShipping ? 0 : 9.9;

    const finalTotal = Math.max(0, subtotal - promoAmount - prizeDiscount + shippingCost);

    const nextTarget = totalGabarits < 10 ? 10 : totalGabarits < 20 ? 20 : null;

    return {
      totalItems,
      totalGabarits,
      pricePerUnit,
      subtotal,
      finalTotal,
      subtotalGabarits,
      subtotalAccessoires,
      discount,
      nextTarget,
      promoAmount,
      prizeDiscount,
      shippingCost
    };
  }, [cart, promo, prize]);

  const applyPromo = async (codeInput) => {
    const code = String(codeInput || '')
      .trim()
      .toUpperCase();
    if (!code) {
      setPromo({ code: '', amount: 0 });
      showToast('Code vide', 'error');
      return;
    }
    const urls = [
      '/api/promo/validate',
      'http://localhost:5002/api/promo/validate',
      'http://localhost:5001/api/promo/validate',
      'http://localhost:5000/api/promo/validate'
    ];
    for (const url of urls) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, subtotal: cartTotal.subtotal })
        });
        const text = await res.text();
        let data = null;
        try {
          data = JSON.parse(text);
        } catch {
          data = null;
        }
        if (res.ok && data && data.ok) {
          const amount = Number(data.discount || 0);
          setPromo({ code, amount });
          showToast(`Code appliqué: ${code} (-${amount}€)`);
          return;
        }
      } catch (e) {
        // try next url
      }
    }
    showToast('Serveur promo indisponible (proxy)', 'error');
  };

  const [prizes, setPrizes] = useState([
    { label: '🎟️ -5€', type: 'fixed', value: 5 },
    { label: '🎟️ -10€', type: 'fixed', value: 10 },
    { label: '⭐ -8€', type: 'fixed', value: 8 },
    { label: '🎯 -10%', type: 'percent', value: 10 },
    { label: '🚚 Livraison gratuite', type: 'shipping' },
    {
      label: '🎁 Stylo offert',
      type: 'gift',
      gift: { id: 'acc-1', name: 'Stylo Traçage Pro', emoji: '🖊️' }
    },
    {
      label: '🎁 Règle 50cm offerte',
      type: 'gift',
      gift: { id: 'acc-4', name: 'Règle Métal 50cm', emoji: '📏' }
    }
  ]);

  // Chargement des segments depuis le backend au montage
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/roulette/segments');
        const data = await res.json();
        if (data.ok && Array.isArray(data.segments) && data.segments.length) {
          const list = data.segments;
          // S'assurer qu'un segment "Perdu" existe
          if (!list.find((s) => s.type === 'none')) {
            list.push({ label: 'Perdu', type: 'none', color: '#D1D5DB', icon: '😢' });
          }
          setPrizes(list);
        }
      } catch (e) {
        console.warn('roulette segments fallback');
      }
    })();
  }, []);

  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showStockAdmin, setShowStockAdmin] = useState(false);
  const [showUpsell, setShowUpsell] = useState(false);
  useEffect(() => {
    const blockContextMenu = (e) => {
      const t = e.target || {};
      if (t.tagName && t.tagName.toLowerCase() === 'img') {
        e.preventDefault();
      }
    };
    const blockKeys = (e) => {
      const k = (e.key || '').toLowerCase();
      if (
        (e.ctrlKey && (k === 's' || k === 'p')) ||
        (e.ctrlKey && e.shiftKey && (k === 's' || k === 'i' || k === 'p'))
      ) {
        e.preventDefault();
      }
    };
    document.addEventListener('contextmenu', blockContextMenu, { capture: true });
    document.addEventListener('keydown', blockKeys, { capture: true });
    return () => {
      document.removeEventListener('contextmenu', blockContextMenu, { capture: true });
      document.removeEventListener('keydown', blockKeys, { capture: true });
    };
  }, []);

  const setMeta = (name, content) => {
    let tag = document.querySelector(`meta[name="${name}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('name', name);
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
  };
  const setOg = (property, content) => {
    let tag = document.querySelector(`meta[property="${property}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('property', property);
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
  };
  const updateProductSEO = (product) => {
    const origin = window.location.origin;
    const title = `${product.series}-${product.model} | Gabarits.fr`;
    const desc = product.photoNotes
      ? `${product.photoNotes} • ${product.description}`
      : product.description;
    const seriesStyles = {
      A: 'classic cotes',
      B: 'classic chevron',
      C: 'classic curve',
      D: 'classic curve',
      E: 'classic spider',
      F: 'line sport',
      G: 'special nda',
      H: 'special harley',
      I: 'pano selle',
      J: 'classic ovale',
      K: 'classic lacer',
      L: 'classic wave',
      M: 'classic losange'
    };
    const mmFromNotes = (String(product.photoNotes || '').match(/(\d+\s?mm)/i) || [])[1] || '';
    const mmFromImage =
      (String(product.image || '').match(/(30mm|40mm|50mm|70mm)/i) || [])[1] || '';
    const mm = mmFromNotes || mmFromImage;
    const style = seriesStyles[product.series] || '';
    const keywords = [
      `gabarit sellerie serie ${product.series}${product.model}`,
      style,
      mm,
      product.description,
      'gabarits sellerie',
      'gabarits auto',
      'gabarits moto'
    ]
      .filter(Boolean)
      .join(',')
      .toLowerCase();
    document.title = title;
    setMeta('description', desc);
    setMeta('keywords', keywords);
    setOg('og:title', title);
    setOg('og:description', desc);
    if (product.image) setOg('og:image', origin + product.image);
    const jsonId = 'seo-product-jsonld';
    const script = document.getElementById(jsonId) || document.createElement('script');
    script.type = 'application/ld+json';
    script.id = jsonId;
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: `${product.series}-${product.model}`,
      description: desc,
      brand: { '@type': 'Brand', name: 'Gabarits.fr' },
      image: product.image ? origin + product.image : undefined,
      offers: {
        '@type': 'Offer',
        priceCurrency: 'EUR',
        price: String(product.basePrice || 100),
        availability: 'https://schema.org/InStock'
      }
    });
    if (!script.parentNode) document.head.appendChild(script);
  };
  const resetSEO = () => {
    document.title = 'Gabarits.fr';
    setMeta('description', 'Gabarits de sellerie auto et moto – séries A à M.');
    setMeta('keywords', 'gabarits sellerie auto moto, gabaritsfr');
    setOg('og:title', 'Gabarits.fr');
    setOg('og:description', 'Gabarits de sellerie auto et moto.');
  };
  useEffect(() => {
    if (selectedProduct) updateProductSEO(selectedProduct);
    else resetSEO();
  }, [selectedProduct]);

  const addGiftToCart = (gift) => {
    setCart((prev) => [
      ...prev,
      {
        id: gift.id,
        name: gift.name,
        description: 'Cadeau roulette',
        series: 'ACC',
        basePrice: 0,
        size: 'Unique',
        quantity: 1,
        isAccessory: true,
        isGift: true,
        emoji: gift.emoji,
        addedAt: new Date().toISOString()
      }
    ]);
  };

  const handleWinPrize = (p) => {
    if (rouletteUsed) return;
    if (p.type === 'fixed') {
      setPrize({ label: p.label, discount: Number(p.value || 0) });
      showToast(`Gagné: ${p.label}`);
    } else if (p.type === 'percent') {
      const amt = Math.round(((cartTotal.subtotal || 0) * Number(p.value || 0)) / 100);
      setPrize({ label: p.label, discount: amt });
      showToast(`Gagné: ${p.label}`);
    } else if (p.type === 'shipping') {
      setPrize({ label: p.label, discount: 0, freeShipping: true });
      showToast(`Gagné: ${p.label}`);
    } else if (p.type === 'gift') {
      addGiftToCart(p.gift);
      setPrize({ label: p.label, discount: 0 });
      showToast(`Gagné: ${p.label}`);
    }
    setRouletteUsed(true);
  };

  const addToCart = (product, size, skipUpsell = false) => {
    const existingItem = cart.find((item) => item.id === product.id && item.size === size);

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          ...product,
          size,
          quantity: 1,
          addedAt: new Date().toISOString()
        }
      ]);
    }

    showToast(`🎉 ${product.name} (${size}) ajouté au panier`);
  };

  const updateQuantity = (productId, size, change) => {
    setCart(
      cart
        .map((item) => {
          if (item.id === productId && item.size === size) {
            const newQuantity = item.quantity + change;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (productId, size) => {
    setCart(cart.filter((item) => !(item.id === productId && item.size === size)));
    showToast('🗑️ Produit retiré du panier', 'error');
  };

  // Ajouter un accessoire au panier
  const addAccessory = (accessory) => {
    const existingItem = cart.find((item) => item.id === accessory.id);

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === accessory.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          id: accessory.id,
          name: accessory.name,
          description: accessory.description,
          series: 'ACC', // Série pour accessoires
          basePrice: accessory.price,
          size: 'Unique',
          quantity: 1,
          isAccessory: true,
          emoji: accessory.emoji,
          addedAt: new Date().toISOString()
        }
      ]);
    }
  };

  const toggleFavorite = (productId) => {
    setFavorites((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleProductView = (product) => {
    const idx = products.findIndex((p) => p.id === product.id);
    setSelectedIndex(idx >= 0 ? idx : 0);
    setSelectedProduct(idx >= 0 ? products[idx] : product);
    setShowProductModal(true);
    setViewHistory((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      return [product, ...filtered].slice(0, 6);
    });
  };

  const goPrevProduct = () => {
    setSelectedIndex((i) => {
      const ni = (i - 1 + products.length) % products.length;
      setSelectedProduct(products[ni]);
      return ni;
    });
  };

  const goNextProduct = () => {
    setSelectedIndex((i) => {
      const ni = (i + 1) % products.length;
      setSelectedProduct(products[ni]);
      return ni;
    });
  };

  const handleSearchSelect = (product) => {
    setSearchTerm('');
    handleProductView(product);
  };

  const openContact = () => {
    const raw = process.env.REACT_APP_MERCHANT_PHONE || '+33759652867';
    const phoneDigits = raw.replace(/[^\d]/g, '');
    const msg = encodeURIComponent('Bonjour, je souhaite vous contacter.');
    const apiUrl = `https://api.whatsapp.com/send?phone=${phoneDigits}&text=${msg}`;
    const ua = navigator.userAgent || '';
    const isMobile = /iPhone|iPad|iPod|Android/i.test(ua);
    if (isMobile) {
      window.location.href = apiUrl;
    } else {
      window.open(apiUrl, '_blank');
    }
    setTimeout(() => {
      const subject = encodeURIComponent('Contact');
      const body = encodeURIComponent('Bonjour, je souhaite des informations.');
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    }, 1800);
  };

  const openWhatsAppProduct = (product) => {
    const raw = process.env.REACT_APP_MERCHANT_PHONE || '+33759652867';
    const phoneDigits = raw.replace(/[^\d]/g, '');
    const msg = encodeURIComponent(
      `Bonjour, je suis intéressé par ${product.name} (Série ${product.series} #${product.model}). Prix: ${product.basePrice}€`
    );
    const apiUrl = `https://api.whatsapp.com/send?phone=${phoneDigits}&text=${msg}`;
    const ua = navigator.userAgent || '';
    const isMobile = /iPhone|iPad|iPod|Android/i.test(ua);
    if (isMobile) {
      window.location.href = apiUrl;
    } else {
      window.open(apiUrl, '_blank');
    }
  };

  const UpsellModal = ({ onClose, onAddAccessory, onSkip }) => {
    const accs = [
      {
        id: 'acc-1',
        name: 'Stylo Tracage Pro',
        description: 'Pointe fine 0.5mm',
        price: 4.9,
        emoji: '🖊️'
      },
      {
        id: 'acc-2',
        name: 'Pack 5 Stylos Couleurs',
        description: 'Multicolore premium',
        price: 14.9,
        emoji: '✏️',
        badge: 'BEST'
      },
      {
        id: 'acc-3',
        name: 'Cutter Précision',
        description: 'Lame acier japonais',
        price: 12.9,
        emoji: '🔪'
      },
      {
        id: 'acc-4',
        name: 'Règle Métal 50cm',
        description: 'Inox anti-rayures',
        price: 8.5,
        emoji: '📏'
      },
      {
        id: 'acc-7',
        name: 'Fil couture industriel 100m',
        description: 'Polyester haute résistance',
        price: 6.9,
        emoji: '🧵'
      },
      {
        id: 'acc-8',
        name: 'Aiguilles sellerie 10pcs',
        description: 'Courbes et droites',
        price: 7.9,
        emoji: '🪡'
      },
      {
        id: 'acc-9',
        name: 'Spray colle néoprène 500ml',
        description: 'Assemblage rapide',
        price: 9.9,
        emoji: '🧴'
      },
      {
        id: 'acc-10',
        name: 'Bande double-face couture',
        description: 'Maintien temporaire',
        price: 4.5,
        emoji: '🩹'
      },
      {
        id: 'acc-11',
        name: 'Kit nettoyage cuir',
        description: 'Brosse + lotion',
        price: 12.9,
        emoji: '🧽'
      },
      {
        id: 'acc-12',
        name: 'Crayon craie textile',
        description: 'Effaçable à l’eau',
        price: 3.9,
        emoji: '✏️'
      },
      {
        id: 'acc-13',
        name: 'Ruban mesure 150cm',
        description: 'Graduations précises',
        price: 2.9,
        emoji: '📐'
      },
      {
        id: 'acc-14',
        name: 'Ciseaux couture pro',
        description: 'Acier trempé',
        price: 16.9,
        emoji: '✂️'
      },
      {
        id: 'acc-15',
        name: 'Pièces renfort mousse',
        description: 'Support lombaire',
        price: 8.9,
        emoji: '🧩'
      },
      {
        id: 'acc-16',
        name: 'Passepoil décoratif 5m',
        description: 'Noir 5mm',
        price: 5.9,
        emoji: '🪢'
      }
    ];
    return (
      <div
        className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-t-2xl p-4 flex items-center justify-between">
            <div className="font-bold">Produits supplémentaires</div>
            <button className="text-white/90 hover:text-white" onClick={onClose}>
              ✕
            </button>
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {accs.map((a) => (
              <div key={a.id} className="border rounded-xl p-4 shadow bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-2xl">
                    {a.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{a.name}</div>
                    <div className="text-sm text-gray-600">{a.description}</div>
                  </div>
                  <div className="text-amber-700 font-bold">{a.price.toFixed(2)} €</div>
                </div>
                <div className="mt-3 flex justify-end">
                  <button
                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    onClick={() => onAddAccessory(a)}
                  >
                    Ajouter
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t bg-gray-50 rounded-b-2xl flex justify-end gap-3">
            <button
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              onClick={onClose}
            >
              Continuer les achats
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              onClick={onSkip}
            >
              Aller au panier
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render CartPage when on /panier route
  if (location.pathname === '/panier') {
    return (
      <>
        <CartPage
          cart={cart}
          cartTotal={cartTotal}
          onUpdateQuantity={updateQuantity}
          onRemoveFromCart={removeFromCart}
          showToast={showToast}
          onApplyPromo={applyPromo}
          onOpenRoulette={() => setShowRoulette(true)}
          promo={promo}
          onUsed={() => setRouletteUsed(true)}
          prize={prize}
          onProceedToCheckout={() => {
            if (!currentUser) {
              setShowAuthModal(true);
              return;
            }
            navigate('/checkout');
          }}
        />
        {showRoulette && (
          <RouletteModal
            onClose={() => setShowRoulette(false)}
            onWin={handleWinPrize}
            prizes={prizes}
            canSpin={!rouletteUsed}
            onUsed={() => setRouletteUsed(true)}
            cartId={cartId}
            token={authToken}
          />
        )}
      </>
    );
  }

  // Render Checkout when on /checkout route
  if (location.pathname === '/checkout') {
    if (!currentUser) {
      // Ouvrir l’auth modal et forcer retour panier
      setShowAuthModal(true);
      navigate('/panier');
      return null;
    }
    return (
      <Checkout
        cart={cart}
        cartTotal={cartTotal}
        promo={promo}
        prize={prize}
        authToken={authToken}
        onOrderCreated={(order) => {
          setShowOrderConfirmation(true);
        }}
      />
    );
  }

  if (location.pathname === '/confirmation') {
    return <Confirmation />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {showProductModal && selectedProduct && (
        <ProductPreviewModal
          product={selectedProduct}
          onClose={() => {
            setShowProductModal(false);
            setSelectedProduct(null);
          }}
          onPrev={goPrevProduct}
          onNext={goNextProduct}
        />
      )}

      {showOrderConfirmation && (
        <OrderConfirmation order={cartTotal} onClose={() => setShowOrderConfirmation(false)} />
      )}

      {showStockAdmin && <StockAdmin onClose={() => setShowStockAdmin(false)} />}

      {/* Modals informatifs */}
      {showContactModal && (
        <ContactModal onClose={() => setShowContactModal(false)} onWhatsApp={openContact} />
      )}
      {showDeliveryModal && (
        <DeliveryModal onClose={() => setShowDeliveryModal(false)} waUrl={waUrl} />
      )}
      {showFaqModal && <FaqModal onClose={() => setShowFaqModal(false)} email={email} />}
      {showWarrantyModal && (
        <WarrantyModal onClose={() => setShowWarrantyModal(false)} email={email} />
      )}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onLoginSuccess={(token, user) => {
            setAuthToken(token);
            setCurrentUser(user);
          }}
        />
      )}
      {showUpsell && (
        <UpsellModal
          onClose={() => setShowUpsell(false)}
          onAddAccessory={addAccessory}
          onSkip={() => {
            setShowUpsell(false);
            navigate('/panier');
          }}
        />
      )}
      {showRoulette && (
        <RouletteModal
          onClose={() => setShowRoulette(false)}
          onWin={handleWinPrize}
          prizes={prizes}
          canSpin={!rouletteUsed}
          onUsed={() => setRouletteUsed(true)}
          cartId={cartId}
          token={authToken}
        />
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b-4 border-amber-500 shadow-2xl">
        <div className="w-full max-w-none sm:max-w-7xl mx-auto px-3 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl">
                  <span className="text-white font-bold text-2xl">G</span>
                </div>
                <div className="absolute -top-2 -right-2">
                  <Sparkles size={16} className="text-yellow-400" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Gabarits.fr
                </h1>
                <p className="text-xs text-gray-600 flex items-center">
                  <Award size={12} className="mr-1 text-amber-600" />
                  Sellerie Auto & Moto Premium
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <AccountDropdown onSignIn={() => setShowAuthModal(true)} />
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-white border-2 border-amber-500 text-amber-700 px-4 py-2 rounded-2xl font-semibold hover:bg-amber-50"
              >
                Se connecter
              </button>
              <button
                onClick={() => setShowUpsell(true)}
                className="relative hidden sm:flex bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-3 rounded-2xl font-bold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 items-center space-x-3"
              >
                <ShoppingCart size={16} />
                <span>Panier</span>
                {cart.length > 0 && (
                  <span className="absolute -top-3 -right-3 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold shadow-lg">
                    {cartTotal.totalItems}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  setShowOrders(true);
                  loadOrders();
                }}
                className="hidden sm:flex bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                📜 Commandes
              </button>

              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                <Menu size={16} />
              </button>

              <div className="flex sm:hidden items-center space-x-2">
                <button
                  onClick={() => setShowSeriesSheet(true)}
                  className="p-2 bg-gray-100 rounded-xl shadow hover:bg-gray-200"
                >
                  <Filter size={16} className="text-amber-600" />
                </button>
                <button
                  onClick={() => setShowUpsell(true)}
                  className="relative p-2 bg-amber-100 rounded-xl shadow hover:bg-amber-200"
                >
                  <ShoppingCart size={16} className="text-amber-700" />
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-lg">
                      {cartTotal.totalItems}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowOrders(true);
                    loadOrders();
                  }}
                  className="p-2 bg-gray-100 rounded-xl shadow hover:bg-gray-200"
                >
                  <ClipboardList size={16} className="text-gray-800" />
                </button>
              </div>
            </div>
          </div>

          {/* Barre de recherche */}
          <div className="mt-6 relative">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-600"
                size={16}
              />
              <input
                type="text"
                placeholder="🔍 Rechercher un gabarit, une série..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-2xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 outline-none transition-all text-lg shadow-lg"
              />
              <SearchSuggestions
                searchTerm={searchTerm}
                products={products}
                onSelect={handleSearchSelect}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation des séries */}
      <div className="hidden sm:block bg-gradient-to-r from-white to-amber-50 border-b-2 border-gray-100 sticky top-16 sm:top-24 z-40 shadow-lg">
        <div className="w-full max-w-none sm:max-w-7xl mx-auto px-3 sm:px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              {selectedSeries ? `Série ${selectedSeries}` : 'Toutes les séries'}
            </h2>
            <div className="flex space-x-3"></div>
          </div>

          <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setSelectedSeries('')}
              className={`px-5 py-3 rounded-xl font-semibold whitespace-nowrap transition-all duration-300 ${
                selectedSeries === ''
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg'
                  : 'bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200'
              }`}
            >
              ✨ Toutes
            </button>
            {series.map((s) => {
              const seriesCount = products.filter((p) => p.series === s).length;
              return (
                <button
                  key={s}
                  onClick={() => setSelectedSeries(s)}
                  className={`px-5 py-3 rounded-xl font-semibold whitespace-nowrap transition-all duration-300 flex items-center space-x-2 ${
                    selectedSeries === s
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg'
                      : 'bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200'
                  }`}
                >
                  <span>Série {s}</span>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{seriesCount}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <button
        onClick={() => setShowStockAdmin(true)}
        className="fixed bottom-6 right-6 px-4 py-2 rounded-full bg-amber-600 text-white shadow-lg hover:bg-amber-700"
      >
        Admin Stock
      </button>

      {/* Menu mobile */}
      {showMobileMenu && (
        <div className="lg:hidden bg-white border-b shadow-xl">
          <div className="max-w-7xl mx-auto px-6 py-6 space-y-4">
            <div className="flex items-center space-x-3 text-gray-700 p-3 hover:bg-gray-50 rounded-xl">
              <Phone size={18} className="text-amber-600" />
              <span className="font-medium">01 23 45 67 89</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-700 p-3 hover:bg-gray-50 rounded-xl">
              <Mail size={18} className="text-amber-600" />
              <span className="font-medium">contact@gabarits.fr</span>
            </div>
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <main className="w-full max-w-none sm:max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-6 sm:py-8">
        {/* Bannière tarifs */}
        <div className="mb-12 bg-gradient-to-br from-amber-500 via-amber-600 to-orange-500 rounded-3xl p-8 text-white shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-4">💰 Tarifs Dégressifs</h2>
            <p className="text-amber-100 text-lg">
              Plus vous commandez, moins vous payez par pièce
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/20">
              <div className="text-center">
                <p className="text-5xl font-bold mb-2">100€</p>
                <p className="text-amber-100 font-semibold">1 - 9 pièces</p>
                <p className="text-sm text-amber-200 mt-2">Prix standard</p>
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/30 relative">
              <div className="absolute -top-4 right-4 z-10">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-xl">
                  🏆 LE PLUS POPULAIRE
                </div>
              </div>
              <div className="text-center">
                <p className="text-5xl font-bold mb-2">90€</p>
                <p className="text-amber-100 font-semibold">10+ pièces</p>
                <p className="text-sm text-amber-200 mt-2">Économisez 10€/pièce</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/20">
              <div className="text-center">
                <p className="text-5xl font-bold mb-2">85€</p>
                <p className="text-amber-100 font-semibold">20+ pièces</p>
                <p className="text-sm text-amber-200 mt-2">Meilleur prix</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 text-center">
            <div className="flex items-center justify-center space-x-2">
              <Shield size={20} />
              <span>Garantie 2 ans</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Truck size={20} />
              <span>Livraison offerte</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Award size={20} />
              <span>Qualité premium</span>
            </div>
          </div>
        </div>

        {/* Filtres avancés */}
        <AdvancedFilters filters={filters} onFiltersChange={setFilters} series={series} />

        {/* Affichage des produits */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-2xl">
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Aucun gabarit trouvé</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              Essayez de modifier vos filtres ou de rechercher une autre série
            </p>
            <button
              onClick={() => {
                setSelectedSeries('');
                setFilters({ series: [], sizes: [], maxPrice: 200 });
                setSearchTerm('');
              }}
              className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                isFavorite={favorites.includes(product.id)}
                onToggleFavorite={toggleFavorite}
                onView={handleProductView}
                onWhatsApp={openWhatsAppProduct}
              />
            ))}
          </div>
        )}
        {showSeriesSheet && (
          <SeriesSheet
            series={series}
            products={products}
            selectedSeries={selectedSeries}
            onSelect={(s) => {
              setSelectedSeries(s);
              setShowSeriesSheet(false);
            }}
            onClose={() => setShowSeriesSheet(false)}
          />
        )}

        {/* Historique des consultations */}
        {viewHistory.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center space-x-3">
                <Clock size={24} className="text-amber-600" />
                <span>Récemment consultés</span>
              </h3>
              <button
                onClick={() => setViewHistory([])}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Effacer l'historique
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {viewHistory.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleProductView(product)}
                  className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-2 border-gray-100 text-left group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">{product.series}</span>
                    </div>
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                      {product.series}
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-800 text-sm truncate mb-2">{product.name}</h4>
                  <p className="text-xs text-gray-600 truncate">{product.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-bold text-amber-600">{product.basePrice}€</span>
                    <ChevronRight size={14} className="text-gray-400 group-hover:text-amber-600" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* StorySlider (généré automatiquement) */}
      <StorySlider />

      {/* Panier */}

      <OrdersPanel
        showOrders={showOrders}
        onClose={() => setShowOrders(false)}
        orders={orders}
        loading={ordersLoading}
        error={ordersError}
        onRefresh={loadOrders}
      />
      {/* Footer */}

      <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white mt-16">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">G</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-amber-400">Gabarits.fr</h3>
                  <p className="text-gray-400 text-sm">Sellerie premium</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Votre spécialiste en gabarits de sellerie auto et moto. Qualité française depuis
                2010.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Nos Séries</h4>
              <ul className="space-y-2">
                {series.slice(0, 4).map((s) => (
                  <li key={s}>
                    <button
                      onClick={() => setSelectedSeries(s)}
                      className="text-gray-400 hover:text-amber-400 transition-colors"
                    >
                      Série {s}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setShowContactModal(true)}
                    className="text-gray-400 hover:text-amber-400 transition-colors"
                  >
                    Contact
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setShowDeliveryModal(true)}
                    className="text-gray-400 hover:text-amber-400 transition-colors"
                  >
                    Livraison
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setShowFaqModal(true)}
                    className="text-gray-400 hover:text-amber-400 transition-colors"
                  >
                    FAQ
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setShowWarrantyModal(true)}
                    className="text-gray-400 hover:text-amber-400 transition-colors"
                  >
                    Garantie
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <Phone size={16} className="text-amber-400" />
                  <a
                    href={`tel:${phone}`}
                    className="text-gray-400 hover:text-amber-400 transition-colors"
                  >
                    {phone}
                  </a>
                </li>
                <li className="flex items-center space-x-3">
                  <Mail size={16} className="text-amber-400" />
                  <a
                    href={`mailto:${email}`}
                    className="text-gray-400 hover:text-amber-400 transition-colors"
                  >
                    {email}
                  </a>
                </li>
              </ul>
              <div className="mt-6">
                <p className="text-gray-400 text-sm">Suivez-nous :</p>
                <div className="flex space-x-3 mt-2">
                  <a
                    href={fbUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
                  >
                    <Facebook size={14} /> Facebook
                  </a>
                  <a
                    href={igUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
                  >
                    <Instagram size={14} /> Instagram
                  </a>
                  <a
                    href={liUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
                  >
                    <Linkedin size={14} /> LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 Gabarits.fr - Tous droits réservés. |
              <a href="/cgv" className="hover:text-amber-400 ml-2">
                CGV
              </a>{' '}
              |
              <a href="/mentions-legales" className="hover:text-amber-400 ml-2">
                Mentions légales
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// noop
