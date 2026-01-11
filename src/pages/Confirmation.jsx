import { useNavigate } from 'react-router-dom';

const Confirmation = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen grid place-items-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow p-8 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-2xl font-bold mb-2">Commande confirmée</h1>
        <p className="text-gray-600 mb-6">Nous vous contacterons pour la livraison.</p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="px-6 py-3 rounded-lg bg-amber-600 text-white hover:bg-amber-700"
        >
          Retour à l’accueil
        </button>
      </div>
    </div>
  );
};

export default Confirmation;
