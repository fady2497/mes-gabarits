import React, { useMemo, useState, useEffect } from 'react';
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
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useCartStore } from '../store/index.tsx';
import { setMeta, setCanonical, setJsonLd } from '../utils/seo';
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
        estimated: '5-7 jours',
        express: true
      },
      warranty: '2 ans',
      faq: [
        {
          q: 'Comment utiliser ce gabarit ?',
          a: 'Posez le gabarit sur votre mousse ou matière, tracez les contours avec un stylo argent ou une craie, puis cousez en suivant les lignes.'
        },
        {
          q: 'Est-ce réutilisable ?',
          a: 'Oui, nos gabarits en polypropylène sont conçus pour durer et servir sur des centaines de projets.'
        },
        {
          q: 'Quelle aiguille utiliser ?',
          a: "Nous recommandons une aiguille de taille 90 à 110 selon l'épaisseur de votre fil et matière."
        }
      ]
    };
  }, [catalogProduct]);

  // SEO Dynamique
  useEffect(() => {
    if (!product) return;
    const url = `https://gabarits.fr/product/${product.id}`;
    document.title = `${product.name} | Gabarits.fr`;
    setCanonical(url);
    const desc = `${product.description} — Gabarits professionnels pour sellerie moto.`;
    setMeta('name', 'description', desc);
    setMeta('property', 'og:title', `${product.name} | Gabarits.fr`);
    setMeta('property', 'og:description', desc);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:type', 'product');
    setMeta('property', 'og:image', product.images?.[0] || 'https://gabarits.fr/images/gabarit-sellerie-serie-g1-special-nda-gabaritsfr.png');
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', `${product.name} | Gabarits.fr`);
    setMeta('name', 'twitter:description', desc);
    setMeta('name', 'twitter:image', product.images?.[0] || 'https://gabarits.fr/images/gabarit-sellerie-serie-g1-special-nda-gabaritsfr.png');
    const price = dynamicPrice || product.price;
    setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      image: product.images?.[0] ? `https://gabarits.fr${product.images[0]}` : undefined,
      description: desc,
      brand: { '@type': 'Brand', name: 'Gabarits.fr' },
      offers: {
        '@type': 'Offer',
        url,
        priceCurrency: 'EUR',
        price,
        availability: 'http://schema.org/InStock'
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: Number(product.rating || '4.8'),
        reviewCount: 120
      }
    });
  }, [product, dynamicPrice]);

  const longDesc = useMemo(() => {
    if (!catalogProduct) return '';
    const s = catalogProduct.series;
    const base = {
      A: 'Hexagone',
      B: 'Chevron',
      C: 'Curve',
      D: 'Curve',
      E: 'Spider',
      F: 'Line sport',
      G: 'Spécial',
      H: 'Spécial Harley',
      I: 'Pano & Selle',
      J: 'Ovale',
      K: 'Lacer',
      L: 'Wave',
      M: 'Losange'
    } as Record<string, string>;
    const motif = base[s] || 'Motif';
    const coteMatch =
      (catalogProduct.photoNotes || '').match(/(\d{2,3})\s*mm/) ||
      catalogProduct.description.match(/(\d{2,3})\s*mm/);
    const cote = coteMatch ? `${coteMatch[1]} mm` : '';
    const lines = [
      `Série ${s} — ${motif}${cote ? ` ${cote}` : ''}.`,
      'Gabarit prêt à l’emploi pour traçage couture régulier.',
      'Compatible sellerie moto; autres usages possibles sur demande.',
      catalogProduct.photoNotes ? `Notes photo: ${catalogProduct.photoNotes}.` : ''
    ].filter(Boolean);
    return lines.join(' ');
  }, [catalogProduct]);
  const tips = useMemo(() => {
    if (!catalogProduct) return [] as string[];
    const series = catalogProduct.series;
    const coteMatch =
      (catalogProduct.photoNotes || '').match(/(\d{2,3})\s*mm/) ||
      catalogProduct.description.match(/(\d{2,3})\s*mm/);
    const mm = coteMatch ? parseInt(coteMatch[1]) : undefined;
    const res: string[] = [];
    if (mm) {
      if (mm <= 35) res.push('Pas fin: idéal petite assise ou look discret.');
      else if (mm <= 50)
        res.push('Pas moyen: usage route/sport, bon équilibre rendu/temps de pose.');
      else res.push('Pas large: touring/custom, accent visuel fort.');
      res.push(`Ce modèle utilise un pas ${mm} mm.`);
    }
    const motifNote: Record<string, string> = {
      A: 'Hexagone: look premium; éviter sur très petites selles si pas > 50 mm.',
      B: 'Chevron: convient sport/custom; possible en aligné ou décalé.',
      C: 'Curve/Wave: rendu fluide; bien sur selles avec galbe.',
      F: 'Line sport: lignes parallèles régulières, style racing.',
      L: 'Wave: ondule plus visible sur pas large.',
      M: 'Losange: classique intemporel; surpiqûre épaisse conseillée.'
    };
    if (motifNote[series]) res.push(motifNote[series]);
    res.push('Tracer au feutre effaçable, piquer en partant du centre pour garder la régularité.');
    return res;
  }, [catalogProduct]);
  const upsell = useMemo(() => {
    if (!catalogProduct) return [] as typeof CATALOG;
    const pool = CATALOG.filter(
      (p) =>
        p.id !== catalogProduct.id &&
        (p.series === catalogProduct.series || ['F', 'L', 'M', 'C'].includes(p.series))
    ).slice(0, 4);
    return pool;
  }, [catalogProduct]);

  function buildReviews(cp?: any) {
    if (!cp) return [];
    const s = cp.series;
    const motifMap: Record<string, string> = {
      A: 'Hexagone',
      B: 'Chevron',
      C: 'Curve',
      D: 'Curve',
      E: 'Spider',
      F: 'Line sport',
      G: 'Spécial',
      H: 'Harley',
      I: 'Pano & Selle',
      J: 'Ovale',
      K: 'Lacer',
      L: 'Wave',
      M: 'Losange'
    };
    const motif = motifMap[s] || 'Motif';
    const coteMatch =
      (cp.photoNotes || '').match(/(\d{2,3})\s*mm/) || cp.description.match(/(\d{2,3})\s*mm/);
    const cote = coteMatch ? `${coteMatch[1]} mm` : undefined;
    const baseDate = '2025-01-05';
    return [
      {
        id: 'r1',
        user: 'Atelier Motos Paris',
        rating: 5,
        date: baseDate,
        comment: `Pose très propre. ${motif}${cote ? ` ${cote}` : ''} donne un rendu régulier sur selle route. Tracé au feutre, couture nickel.`,
        helpful: 18,
        verified: true
      },
      {
        id: 'r2',
        user: 'Sellerie Sud',
        rating: 4,
        date: '2025-01-02',
        comment:
          'Bon gabarit, les repères sont clairs. Surpiqûre contrastée conseillée pour mettre le motif en valeur.',
        helpful: 9,
        verified: true
      },
      {
        id: 'r3',
        user: 'Moto Custom 67',
        rating: 5,
        date: '2024-12-28',
        comment:
          'Essai réussi sur une selle large touring. Le pas convient bien; le client a apprécié la régularité.',
        helpful: 6,
        verified: false
      }
    ];
  }
  const reviews = useMemo(() => buildReviews(catalogProduct), [catalogProduct]);

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
                <span className="text-secondary-600">({reviews.length} avis)</span>
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
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex flex-col w-full sm:w-auto">
                    <span className="text-xs text-secondary-500">Largeur (mm)</span>
                    <input
                      type="number"
                      value={customWidth}
                      onChange={(e) => setCustomWidth(parseInt(e.target.value || '260'))}
                      className="input-amazon w-full sm:w-24"
                    />
                  </div>
                  <div className="flex flex-col w-full sm:w-auto">
                    <span className="text-xs text-secondary-500">Hauteur (mm)</span>
                    <input
                      type="number"
                      value={customHeight}
                      onChange={(e) => setCustomHeight(parseInt(e.target.value || '180'))}
                      className="input-amazon w-full sm:w-24"
                    />
                  </div>
                  <button className="btn-secondary w-full sm:w-auto" onClick={openInCreator}>
                    Voir dans Catalogue
                  </button>
                </div>
                <div className="text-xs text-secondary-600 mt-2">
                  Pour Voiture / Maison / Bateau, saisissez la taille voulue et ouvrez dans le
                  créateur.
                </div>
              </div>
            </div>
            <div className="mt-8">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xl font-bold text-secondary-900">Complétez votre achat</div>
                {upsell.length > 0 && (
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      upsell.forEach((p) =>
                        addItem({
                          productId: p.id,
                          quantity: 1,
                          price: p.basePrice,
                          name: p.name,
                          image: p.image,
                          usage
                        })
                      );
                    }}
                  >
                    Tout ajouter
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upsell.map((p, i) => (
                  <div
                    key={p.id}
                    className="border border-gray-200 rounded-amazon-lg p-3 flex items-center justify-between gap-3 bg-white"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-20 bg-white rounded-amazon overflow-hidden flex items-center justify-center">
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="text-secondary-600 text-xs">Image</div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-secondary-900">{p.name}</div>
                        <div className="text-sm text-secondary-600">
                          {Number(p.rating).toFixed(1)}
                        </div>
                        <div className="text-primary-700 font-bold">{p.basePrice}€</div>
                      </div>
                    </div>
                    <button
                      className="btn-primary"
                      onClick={() =>
                        addItem({
                          productId: p.id,
                          quantity: 1,
                          price: p.basePrice,
                          name: p.name,
                          image: p.image,
                          usage
                        })
                      }
                    >
                      Ajouter
                    </button>
                  </div>
                ))}
                {upsell.length === 0 && (
                  <div className="text-secondary-700">Aucun complément suggéré</div>
                )}
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
                  <div className="text-sm text-secondary-600">5-7 jours</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Shield className="h-6 w-6 text-primary-600" />
                <div>
                  <div className="font-medium text-secondary-900">Garantie</div>
                  <div className="text-sm text-secondary-600">{product.warranty}</div>
                </div>
              </div>

              {/* Retour gratuit section removed */}
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
                      {/* <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span>{product.seller.rating}</span> */}
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
                <p className="text-secondary-700 mb-3">{longDesc}</p>
                <p className="text-secondary-700 mb-6">{product.description}</p>
                <div className="rounded-amazon-lg border border-gray-200 p-4 bg-secondary-50">
                  <div className="font-semibold text-secondary-900 mb-2">
                    Conseils d’utilisation
                  </div>
                  <ul className="list-disc pl-5">
                    {tips.map((t, i) => (
                      <li key={i} className="text-secondary-700">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                  Caractéristiques principales
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {[
                    'Matériau : Polypropylène indéchirable',
                    'Épaisseur : 0.8mm (flexible & robuste)',
                    'Traçage : Net et précis',
                    "Durabilité : Réutilisable à l'infini",
                    'Origine : Fabriqué en France 🇫🇷',
                    'Usage : Pro & Amateur'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                      <span className="text-secondary-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
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
                                  Atelier vérifié
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
