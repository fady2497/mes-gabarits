## Objectif
- Agrandir la carte centrale du carousel et réduire les vides autour pour une impression de remplissage.
- Garder une lisibilité claire et des performances correctes.

## Modifications du Carousel
1. Étendre la zone du carousel pour accueillir une carte plus large:
   - `src/App.js:941` → changer `className="relative h-[720px]"` en `className="relative min-h-[720px] md:min-h-[800px]"`.
2. Augmenter le nombre de cartes visibles pour remplir les côtés:
   - `src/App.js:887–925` (`getVisibleProducts`) → passer `range` à `isMobile ? 0 : 3`.
3. Calculer les déplacements en fonction d’une largeur de carte fixe:
   - Ajouter `const cardWidth = isMobile ? 360 : 480; const gap = isMobile ? 12 : 24;`.
   - Dans le rendu, remplacer le `translateX` actuel par `offset * (cardWidth + gap)`.
4. Ajuster les échelles pour que la carte centrale occupe plus d’espace sans trop écraser les autres:
   - Centre: `scaleCenter = isMobile ? 1.1 : 1.2`.
   - Côtés: `scaleSide = 0.95 - Math.abs(i) * 0.05`.
5. Réduire les effets 3D qui génèrent du vide visuel:
   - Supprimer `translateZ` (mettre `0`) et réduire le flou: `filter: blur(${Math.abs(offset) * 0.5}px)`.
   - Conserver une légère rotation `rotateY` uniquement pour la profondeur visuelle.
6. Diminuer la baisse d’opacité pour que les cartes latérales contribuent au remplissage:
   - `opacity = 1 - Math.abs(i) * 0.12`.

## Ajustements de la carte produit
1. Fixer une largeur explicite de la carte pour éviter la dépendance au scale:
   - `src/App.js:731–738` (div racine de `ProductCard`) → ajouter classes de largeur: `w-[360px] sm:w-[420px] lg:w-[520px]`.
2. Réduire légèrement la hauteur du header pour compenser la largeur:
   - `src/App.js:2084–2094` → `h-44` peut rester, garder `p-5`.

## Comportement mobile
- Mobile: une seule carte, pleine largeur:
  - `range = 0`, rotation = `0`, blur = `0`, `w-full` pour `ProductCard`.
  - `cardWidth` devient la largeur de l’écran (utilisation des classes responsive `w-full sm:w-[420px]`).

## Vérification
- Lancer le front et vérifier:
  - La carte centrale occupe ~70–80% de la largeur sur desktop.
  - Les cartes latérales visibles réduisent le vide sur les bords.
  - Pas de chevauchement du contenu (prix, tailles, boutons).
- Ajuster finement `cardWidth`/`gap` si besoin en fonction de ta préférence exacte.

Souhaites-tu que j’applique ces changements maintenant ?