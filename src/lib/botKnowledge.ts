export const SERIES = {
  hexagone: 'Hexagone (A/M): pas 30/40/50/70 mm, rendu moderne et premium',
  chevron: 'Chevron (B): aligné ou décalé, look custom classique',
  curve: 'Curve/Wave (C/L): courbes fluides, esthétique élégante',
  line: 'Line sport (F): lignes parallèles, style racing',
  spider: 'Spider (E): rayonnant, centre mis en valeur'
};

export const SIZES = {
  guidance:
    'Choisir le pas: selle sport/route → 40–50 mm; touring large → 50–70 mm; petite assise → 30–40 mm; viser ~8–12 pavés visibles sur la zone utile',
  measure:
    'Mesurer: largeur utile (au centre), longueur de zone matelassée. Photo bien cadrée + règle visible si possible'
};

export const MATERIALS = {
  combos:
    'Combinaisons: alcantara au centre + bords lisses/perforés; surpiqûre contrastée (gris/blanc/doré) ou ton‑sur‑ton pour sobriété',
  thread:
    'Surpiqûre: épaisseur supérieure pour custom, simple pour sport; couleur assortie à carrosserie ou logos'
};

export const MODELS = {
  bmw_gs:
    'BMW GS: Hexagone 40–50 mm; surpiqûre contrastée; panneaux latéraux lisses; logo discret possible',
  tmax: 'Yamaha TMAX: Hexagone 40–50 mm ou Line sport; logo brodé; surpiqûre dorée/contraste courant',
  goldwing:
    'Honda Goldwing: 50–70 mm (Hexagone/Chevron); cohérence avec dosseret; priorité confort régulier',
  harley: 'Harley Davidson: Chevron 40–70 mm ou Wave; cuir lisse/perforé; surpiqûre épaisse',
  gs_adventure:
    'BMW GS Adventure: Hexagone 50 mm conseillé pour assise large; contrastes sobres (gris/blanc)',
  tmax_tech_kamo:
    'TMAX Tech Kamo: surpiqûre dorée recommandée; Hexagone 40–50 mm; option Line sur zones latérales',
  multistrada:
    'Ducati Multistrada: Hexagone 40–50 mm ou Line sport; surpiqûre rouge/ton rouge conseillé',
  ktm_adventure: 'KTM Adventure: Chevron 40–50 mm ou Hexagone 40–50; surpiqûre orange',
  burgman: 'Suzuki Burgman: Hexagone 30–40 mm ou Line; confort prioritaire; surpiqûre noire/grise',
  mp3: 'Piaggio MP3: assise compacte → Hexagone 30–40 mm; option Wave pour style urbain; surpiqûre grise',
  bonneville: 'Triumph Bonneville: Chevron/Wave 40–50 mm pour look vintage; surpiqûre crème/beige',
  r_ninet:
    'BMW R nineT: Hexagone 40 mm ou Chevron 40 mm; sobriété premium; surpiqûre blanche/grise',
  kawasaki_z: 'Kawasaki Z: Line sport 40 mm; surpiqûre verte',
  yamaha_mt: 'Yamaha MT: Line sport 40–50 mm; surpiqûre bleu/gris'
};

export const LOGISTICS = {
  pricing: 'Tarifs: standards dès 9€; packs séries; remises par quantité; sur‑mesure sur devis',
  shipping:
    'Livraison: 2–4 jours ouvrés avec suivi; retours 14 jours pour standards (hors sur‑mesure)'
};

export function recommendPas(widthCm: number) {
  if (!Number.isFinite(widthCm) || widthCm <= 0) return 'Indiquez la largeur utile en cm';
  if (widthCm < 24) return '30–40 mm (petite assise)';
  if (widthCm < 30) return '40 mm (sport/route)';
  if (widthCm < 36) return '40–50 mm (polyvalent)';
  if (widthCm < 42) return '50 mm (touring)';
  return '50–70 mm (assise très large)';
}

export const catalogueUrl = '/search?category=moto';

export function recommendThreadColor(baseColor: string) {
  const c = (baseColor || '').toLowerCase();
  if (c.includes('rouge')) return 'rouge/ton carrosserie ou noir pour sobriété';
  if (c.includes('orange')) return 'orange ton sur ton ou blanc pour contraste';
  if (c.includes('vert')) return 'vert assorti ou gris pour discret';
  if (c.includes('bleu')) return 'bleu assorti ou gris/blanc';
  if (c.includes('dor')) return 'doré sur noir/gris pour premium';
  return 'gris/blanc (contraste propre) ou noir (sobre)';
}

export function buildSystemPrompt() {
  const lines = [
    "Tu es l'assistant de Gabarits.fr.",
    'Réponds UNIQUEMENT sur les gabarits de sellerie moto: séries, tailles, compatibilité, matériaux, tarifs, livraison, sur‑mesure.',
    'Style: français, concis, 3–6 puces max; étapes simples quand utile; ne pas digresser.',
    `Séries: ${Object.values(SERIES).join('; ')}.`,
    `Tailles: ${SIZES.guidance}.`,
    `Matériaux: ${MATERIALS.combos}.`,
    `Modèles: BMW GS, TMAX, Goldwing, Harley — ${MODELS.bmw_gs}; ${MODELS.tmax}; ${MODELS.goldwing}; ${MODELS.harley}.`,
    `Tarifs/Livraison: ${LOGISTICS.pricing}; ${LOGISTICS.shipping}.`
  ];
  return lines.join(' \n ');
}
