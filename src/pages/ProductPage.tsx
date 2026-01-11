import React, { useMemo, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import {
  Star,
  Heart,
  ShoppingCart,
  Share2,
  Shield,
  Truck,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useCartStore } from '../store/index.tsx';
import { CATALOG, getProductById, SERIES_BY_CATEGORY, getCategoryForSeries } from '../data/catalog';

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [sp] = useSearchParams();
  const { addItem } = useCartStore();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [usage, setUsage] = useState<'moto' | 'auto' | 'maison' | 'bateau'>('moto');
  const [selectedTab, setSelectedTab] = useState<'description' | 'specs' | 'reviews'>(
    'description'
  );
  const [isWishlisted, setIsWishlisted] = useState(false);
  const catalogProduct = useMemo(() => (id ? getProductById(id) : undefined), [id]);
  const categoryKey = useMemo(() => {
    const ctx = sp.get('category');
    if (ctx) return ctx as any;
    return catalogProduct ? getCategoryForSeries(catalogProduct.series) : undefined;
  }, [catalogProduct, sp]);
  const categoryLabel = useMemo(() => {
    const map: Record<string, string> = {
      moto: 'Moto',
      auto: 'Voiture',
      maison: 'Maison / Mur',
      bateau: 'Bateau'
    };
    return categoryKey ? map[categoryKey] : 'Gabarits';
  }, [categoryKey]);
  const product = useMemo(() => {
    if (!catalogProduct) return null as any;
    return {
      id: catalogProduct.id,
      name: catalogProduct.name,
      price: catalogProduct.basePrice,
      originalPrice: undefined as number | undefined,
      rating: Number(catalogProduct.rating),
      reviews: 0,
      inStock: true,
      stock: 15,
      images: catalogProduct.image ? [catalogProduct.image] : [],
      badge: 'Gabarit',
      discount: 0,
      category: categoryLabel,
      brand: 'Gabarits.fr',
      seller: { name: 'Gabarits.fr', rating: 4.8, reviews: 1200 },
      description: catalogProduct.description,
      features: [],
      specifications: {},
      shipping: {
        free: true,
        estimated: (catalogProduct as any).specialOrder ? '7-10 jours ouvrés' : '2-3 jours ouvrés',
        express: !(catalogProduct as any).specialOrder
      },
      warranty: 'Artisan'
    };
  }, [catalogProduct]);

  const reviews = [
    {
      id: '1',
      user: 'Jean D.',
      rating: 5,
      date: '2024-01-15',
      comment:
        'Excellent produit ! La qualité de construction est exceptionnelle et les photos sont incroyables.',
      helpful: 23,
      verified: true
    },
    {
      id: '2',
      user: 'Marie L.',
      rating: 4,
      date: '2024-01-10',
      comment: 'Très bon téléphone mais le prix est élevé. Les performances sont au rendez-vous.',
      helpful: 15,
      verified: true
    },
    {
      id: '3',
      user: 'Pierre M.',
      rating: 5,
      date: '2024-01-08',
      comment: "Passage de l'iPhone 13 Pro Max, c'est un vrai upgrade. Le titane est magnifique.",
      helpful: 8,
      verified: false
    }
  ];

  const related = useMemo(() => {
    if (!catalogProduct) return [] as typeof CATALOG;
    const seriesList = SERIES_BY_CATEGORY['moto'] || [];
    return CATALOG.filter(
      (p) =>
        p.id !== catalogProduct.id &&
        (p.series === catalogProduct.series || seriesList.includes(p.series))
    ).slice(0, 4);
  }, [catalogProduct, categoryKey]);

  // Dimensions personnalisées pour voiture/maison/bateau (ou tout autre)
  const [customWidth, setCustomWidth] = useState(260);
  const [customHeight, setCustomHeight] = useState(180);
  const baselineArea = 260 * 180;
  const dynamicPrice = useMemo(() => {
    if (!catalogProduct) return 0;
    if (usage === 'moto') return catalogProduct.basePrice;
    const area = Math.max(1, customWidth * customHeight);
    const factor = area / baselineArea;
    const base = catalogProduct.basePrice;
    return Math.max(1, Math.round(base * factor));
  }, [catalogProduct, usage, customWidth, customHeight]);
  const openInCreator = () => {
    const cat = categoryKey || 'moto';
    window.location.href = `/search?category=${cat}&w=${customWidth}&h=${customHeight}`;
  };

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      productId: product.id,
      quantity: quantity,
      price: dynamicPrice,
      name: product.name,
      image: product.images[0],
      usage
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // Navigation vers checkout
    window.location.href = '/checkout';
  };

  const nextImage = () => {
    if (!product || product.images.length === 0) return;
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    if (!product || product.images.length === 0) return;
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  if (!catalogProduct) {
    return (
      <div className="container-amazon py-10">
        <div className="card-amazon p-6">Produit introuvable</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amazon-gray">
      <div className="container-amazon py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-secondary-600 mb-6">
          <Link to="/" className="hover:text-primary-600 transition-colors">
            Accueil
          </Link>
          <span>/</span>
          <Link to="/search" className="hover:text-primary-600 transition-colors">
            Produits
          </Link>
          <span>/</span>
          {categoryKey ? (
            <Link
              to={`/search?category=${categoryKey}`}
              className="hover:text-primary-600 transition-colors"
            >
              {categoryLabel}
            </Link>
          ) : (
            <span className="text-secondary-900">Gabarits</span>
          )}
          <span>/</span>
          <span className="text-secondary-900 font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Galerie d'images */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-amazon-lg overflow-hidden bg-white">
              {product.images.length > 0 ? (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-secondary-600">
                  Aucune image
                </div>
              )}

              {/* Navigation images */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-amazon transition-all"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-amazon transition-all"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}

              {/* Badges */}
              {product.badge && (
                <div className="absolute top-4 left-4">
                  <span className="badge-promo">{product.badge}</span>
                </div>
              )}
              {product.discount && (
                <div className="absolute top-4 right-4">
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    -{product.discount}%
                  </span>
                </div>
              )}
            </div>

            {/* Miniatures */}
            {product.images.length > 0 && (
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-amazon border-2 transition-all ${
                      selectedImage === index
                        ? 'border-primary-500 ring-2 ring-primary-200'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover rounded-amazon"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Informations produit */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-sm text-secondary-600">{product.brand}</span>
                <span className="text-secondary-400">•</span>
                <span
                  className={`badge-cat ${
                    categoryKey === 'moto'
                      ? 'cat-moto'
                      : categoryKey === 'auto'
                      ? 'cat-auto'
                      : categoryKey === 'maison'
                      ? 'cat-maison'
                      : categoryKey === 'bateau'
                      ? 'cat-nautique'
                      : ''
                  }`}
                >
                  {categoryLabel}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-secondary-900 mb-4">{product.name}</h1>

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-secondary-600">
                  {product.rating} ({product.reviews} avis)
                </span>
              </div>

              <div className="flex items-center space-x-4 mb-4">
                <div className="text-4xl font-bold text-primary-600">{dynamicPrice}€</div>
                {product.originalPrice && (
                  <div className="text-2xl text-secondary-500 line-through">
                    {product.originalPrice}€
                  </div>
                )}
                {product.discount && (
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-bold">
                    -{product.discount}% Économie
                  </span>
                )}
                {(catalogProduct as any)?.specialOrder && (
                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-bold">
                    Sur commande
                  </span>
                )}
                {usage !== 'moto' && (
                  <span className="px-3 py-1 rounded-full bg-secondary-100 text-secondary-800 text-sm">
                    Prix calculé par taille
                  </span>
                )}
              </div>

              {/* Usage selection */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-secondary-700 font-medium">Usage:</span>
                <select
                  value={usage}
                  onChange={(e) => setUsage(e.target.value as any)}
                  className="input-amazon w-40"
                >
                  <option value="moto">Moto</option>
                  <option value="auto">Voiture</option>
                  <option value="maison">Maison / Mur</option>
                  <option value="bateau">Bateau</option>
                </select>
              </div>

              <div className="flex items-center space-x-2 mb-6">
                {product.inStock ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-green-700 font-medium">
                      En stock ({product.stock} disponible{product.stock > 1 ? 's' : ''})
                    </span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <span className="text-red-700 font-medium">Rupture de stock</span>
                  </>
                )}
              </div>
            </div>

            {/* Sélecteur quantité */}
            <div className="flex items-center space-x-4">
              <span className="text-secondary-700 font-medium">Quantité:</span>
              <div className="flex items-center border border-gray-300 rounded-amazon">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-secondary-50 transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 hover:bg-secondary-50 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="w-full btn-primary !py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Ajouter au panier
              </button>

              <button
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="w-full btn-secondary !py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Achat immédiat
              </button>

              {/* Dimensions personnalisées */}
              <div className="card-amazon p-4 mt-4">
                <div className="text-secondary-900 font-medium mb-2">Dimensions personnalisées</div>
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="text-xs text-secondary-500">Largeur (mm)</span>
                    <input
                      type="number"
                      value={customWidth}
                      onChange={(e) => setCustomWidth(parseInt(e.target.value || '260'))}
                      className="input-amazon w-24"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-secondary-500">Hauteur (mm)</span>
                    <input
                      type="number"
                      value={customHeight}
                      onChange={(e) => setCustomHeight(parseInt(e.target.value || '180'))}
                      className="input-amazon w-24"
                    />
                  </div>
                  <button className="btn-secondary" onClick={openInCreator}>
                    Voir dans Catalogue
                  </button>
                </div>
                <div className="text-xs text-secondary-600 mt-2">
                  Pour Voiture / Maison / Bateau, saisissez la taille voulue et ouvrez dans le
                  créateur.
                </div>
              </div>
            </div>

            {/* Boutons secondaires */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-amazon border transition-all ${
                  isWishlisted
                    ? 'bg-red-50 border-red-200 text-red-700'
                    : 'border-gray-300 text-secondary-700 hover:bg-secondary-50'
                }`}
              >
                <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
                <span>{isWishlisted ? 'Retirer' : 'Ajouter'} aux favoris</span>
              </button>

              <button className="flex items-center space-x-2 px-4 py-2 rounded-amazon border border-gray-300 text-secondary-700 hover:bg-secondary-50 transition-all">
                <Share2 className="h-4 w-4" />
                <span>Partager</span>
              </button>
            </div>

            {/* Avantages */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-secondary-50 rounded-amazon-lg">
              <div className="flex items-center space-x-3">
                <Truck className="h-6 w-6 text-primary-600" />
                <div>
                  <div className="font-medium text-secondary-900">Livraison gratuite</div>
                  <div className="text-sm text-secondary-600">{product.shipping.estimated}</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Shield className="h-6 w-6 text-primary-600" />
                <div>
                  <div className="font-medium text-secondary-900">Garantie</div>
                  <div className="text-sm text-secondary-600">{product.warranty}</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <RotateCcw className="h-6 w-6 text-primary-600" />
                <div>
                  <div className="font-medium text-secondary-900">Retour gratuit</div>
                  <div className="text-sm text-secondary-600">30 jours</div>
                </div>
              </div>
            </div>

            {/* Vendeur */}
            <div className="p-4 border border-gray-200 rounded-amazon-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-bold text-lg">
                      {product.seller.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-secondary-900">{product.seller.name}</div>
                    <div className="flex items-center space-x-1 text-sm text-secondary-600">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span>{product.seller.rating}</span>
                      <span>({product.seller.reviews} ventes)</span>
                    </div>
                  </div>
                </div>
                <Link
                  to={`/seller/${product.seller.name.toLowerCase().replace(' ', '-')}`}
                  className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                >
                  Voir la boutique
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {[
                { id: 'description', label: 'Description' },
                { id: 'specs', label: 'Spécifications' },
                { id: 'reviews', label: `Avis (${reviews.length})` }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    selectedTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-secondary-500 hover:text-secondary-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {selectedTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-secondary-700 mb-6">{product.description}</p>
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                  Caractéristiques principales
                </h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-secondary-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedTab === 'specs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(product.specifications as Record<string, string>).length === 0 ? (
                  <div className="text-secondary-700">À compléter</div>
                ) : (
                  Object.entries(product.specifications as Record<string, string>).map(
                    ([key, value]) => (
                      <div key={key} className="flex justify-between py-3 border-b border-gray-200">
                        <span className="font-medium text-secondary-900">{key}</span>
                        <span className="text-secondary-700">{value}</span>
                      </div>
                    )
                  )
                )}
              </div>
            )}

            {selectedTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl font-bold text-secondary-900">{product.rating}</div>
                    <div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.floor(product.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-secondary-600">
                        Basé sur {reviews.length} avis
                      </div>
                    </div>
                  </div>
                  <button className="btn-primary">Écrire un avis</button>
                </div>

                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border border-gray-200 rounded-amazon-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-primary-600 font-semibold">
                              {review.user.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-secondary-900">{review.user}</div>
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-secondary-600">{review.date}</span>
                              {review.verified && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Achat vérifié
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-secondary-700 mb-4">{review.comment}</p>
                      <div className="flex items-center space-x-4">
                        <button className="flex items-center space-x-1 text-sm text-secondary-600 hover:text-primary-600 transition-colors">
                          <ThumbsUp className="h-4 w-4" />
                          <span>Utile ({review.helpful})</span>
                        </button>
                        <button className="flex items-center space-x-1 text-sm text-secondary-600 hover:text-primary-600 transition-colors">
                          <ThumbsDown className="h-4 w-4" />
                          <span>Pas utile</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Produits similaires */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-secondary-900 mb-8">Produits similaires</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((rp) => (
              <Link
                key={rp.id}
                to={`/product/${rp.id}`}
                className="card-amazon group overflow-hidden"
              >
                <div className="aspect-square overflow-hidden bg-white">
                  {rp.image ? (
                    <img
                      src={rp.image}
                      alt={rp.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-secondary-600">
                      —
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-secondary-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {rp.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-primary-600">{rp.basePrice}€</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm text-secondary-600">{rp.rating}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
