type Product = {
  id: string;
  series: string;
  model: string;
  name: string;
  description: string;
  basePrice: number;
  sizes: string[];
  rating: string;
  popular: boolean;
  color: string;
  image: string | null;
  photoNotes: string | null;
  createdAt: string;
  specialOrder: boolean;
};

const descriptions = [
  'Traçage couture professionnel',
  "Motif nid d'abeille premium",
  'Gabarit expert sellerie auto',
  'Design moto sport premium',
  'Précision millimétrique',
  'Qualité industrie française'
];

const imageMapA: Record<string, string> = {
  '001': '/images/gabarit-sellerie-serie-a1-classic-cotes-30mm-gabaritsfr.png',
  '002': '/images/gabarit-sellerie-serie-a2-classic-cotes-40mm-gabaritsfr.png',
  '003': '/images/gabarit-sellerie-serie-a3-classic-cotes-50mm-gabaritsfr.png',
  '004': '/images/gabarit-sellerie-serie-a4-classic-cotes-30mm-gabaritsfr.png',
  '005': '/images/gabarit-sellerie-serie-a5-classic-cotes-40mm-gabaritsfr.png'
};
const imageMapB: Record<string, string> = {
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
  '011': '/images/gabarit-sellerie-serie-b12-classic-chevron-70mm-gabaritsfr.png'
};
const imageMapC: Record<string, string> = {
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
const imageMapD: Record<string, string> = {
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
const imageMapE: Record<string, string> = {
  '001': '/images/gabarit-sellerie-serie-e1-classic-spider-30mm-gabaritsfr.png',
  '002': '/images/gabarit-sellerie-serie-e2-classic-spider-50mm-gabaritsfr.png',
  '003': '/images/gabarit-sellerie-serie-e3-classic-spider-50mm-gabaritsfr.png',
  '004': '/images/gabarit-sellerie-serie-e4-sclassic-pider-gabaritsfr.png',
  '005': '/images/gabarit-sellerie-serie-e5-classic-spider-gabaritsfr.png',
  '006': '/images/gabarit-sellerie-serie-e6-classic-spider-gabaritsfr.png'
};
const imageMapF: Record<string, string> = {
  '001': '/images/gabarit-sellerie-serie-f1-line-sport-30mm-gabaritsfr.png',
  '002': '/images/gabarit-sellerie-serie-f2-line-sport-40mm-gabaritsfr.png',
  '003': '/images/gabarit-sellerie-serie-f3-line-sport-50mm-gabaritsfr.png',
  '004': '/images/gabarit-sellerie-serie-f4-line-sport-70mm-gabaritsfr.png'
};
const imageMapG: Record<string, string> = {
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
const imageMapH: Record<string, string> = {
  '001': '/images/gabarit-sellerie-serie-h1-special-harley-gabaritsfr.png',
  '002': '/images/gabarit-sellerie-serie-h2-special-harley-gabaritsfr.png',
  '003': '/images/gabarit-sellerie-serie-h3-special-harley-gabaritsfr.png',
  '004': '/images/gabarit-sellerie-serie-h4-special-harley-gabaritsfr.png'
};
const imageMapI: Record<string, string> = {
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
const imageMapJ: Record<string, string> = {
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
const imageMapK: Record<string, string> = {
  '001': '/images/gabarit-sellerie-serie-K1-classic-lacer-gabaritsfr.png',
  '002': '/images/gabarit-sellerie-serie-K2-classic-lacer-gabaritsfr.png',
  '003': '/images/gabarit-sellerie-serie-K3-classic-lacer-gabaritsfr.png',
  '004': '/images/gabarit-sellerie-serie-K4-classic-lacer-gabaritsfr.png'
};
const imageMapL: Record<string, string> = {
  '001': '/images/gabarit-sellerie-serie-L1-classic-wave-gabaritsfr.png',
  '002': '/images/gabarit-sellerie-serie-L2-classic-wave-gabaritsfr.png',
  '003': '/images/gabarit-sellerie-serie-L3-classic-wave-gabaritsfr.png',
  '004': '/images/gabarit-sellerie-serie-L4-classic-wave-gabaritsfr.png',
  '005': '/images/gabarit-sellerie-serie-L5-classic-wave-gabaritsfr.png'
};
const imageMapM: Record<string, string> = {
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

const photoNotesA: Record<string, string> = {
  '001': 'COTES 30 mm',
  '002': 'COTES 40 mm',
  '003': 'COTES 50 mm',
  '004': 'COTES 30 mm',
  '005': 'COTES 40 mm'
};
const photoNotesC: Record<string, string> = {
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

const seriesList = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];

export const CATALOG: Product[] = (() => {
  const arr: Product[] = [];
  seriesList.forEach((letter, idx) => {
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
      const model = String(i).padStart(3, '0');
      const descIndex = (idx + i) % descriptions.length;
      const basePrice =
        letter === 'F'
          ? 130
          : letter === 'G'
          ? 140
          : letter === 'H'
          ? 150
          : letter === 'I'
          ? 160
          : letter === 'J'
          ? 170
          : letter === 'K'
          ? 180
          : letter === 'L'
          ? 190
          : letter === 'M'
          ? 200
          : 100;
      const image =
        letter === 'A'
          ? imageMapA[model] || null
          : letter === 'B'
          ? imageMapB[model] || null
          : letter === 'C'
          ? imageMapC[model] || null
          : letter === 'D'
          ? imageMapD[model] || null
          : letter === 'E'
          ? imageMapE[model] || null
          : letter === 'F'
          ? imageMapF[model] || null
          : letter === 'G'
          ? imageMapG[model] || null
          : letter === 'H'
          ? imageMapH[model] || null
          : letter === 'I'
          ? imageMapI[model] || null
          : letter === 'J'
          ? imageMapJ[model] || null
          : letter === 'K'
          ? imageMapK[model] || null
          : letter === 'L'
          ? imageMapL[model] || null
          : letter === 'M'
          ? imageMapM[model] || null
          : null;
      const photoNotes =
        letter === 'A'
          ? photoNotesA[model] || null
          : letter === 'C'
          ? photoNotesC[model] || null
          : null;
      arr.push({
        id: `${letter}-${model}`,
        series: letter,
        model,
        name: `${letter}-${model}`,
        description: descriptions[descIndex],
        basePrice,
        sizes: ['S', 'M', 'L'],
        rating: (4 + Math.random() * 0.9).toFixed(1),
        popular: i <= 2,
        color: `bg-gradient-to-br from-amber-${400 + idx * 100} to-orange-${300 + idx * 100}`,
        image,
        photoNotes,
        createdAt: new Date(Date.now() - (idx * 50 + i) * 86400000).toISOString(),
        specialOrder: ['F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'].includes(letter)
      });
    }
  });
  return arr;
})();

export function getProductById(id: string): Product | undefined {
  return CATALOG.find((p) => p.id.toLowerCase() === id.toLowerCase());
}

export const SERIES_BY_CATEGORY: Record<string, string[]> = {
  moto: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M']
};

export function getCategoryForSeries(series: string): 'moto' {
  return 'moto';
}
