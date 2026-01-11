export const generateProducts = () => {
  const series = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const products = [];

  series.forEach((letter) => {
    const count = letter === 'B' ? 12 : letter === 'G' ? 6 : 4;
    for (let i = 1; i <= count; i++) {
      const modelNum = String(i).padStart(3, '0');
      let description = '';

      if (letter === 'A') {
        description = `Traçage couture professionnel`;
      } else if (letter === 'G') {
        description = `Motif nid d'abeille premium`;
      } else {
        description = `Gabarit série ${letter} expert`;
      }

      products.push({
        id: `${letter}-${modelNum}`,
        series: letter,
        model: modelNum,
        name: `${letter}-${modelNum}`,
        description,
        basePrice: 100,
        sizes: ['S', 'M', 'L'],
        rating: (4 + Math.random()).toFixed(1),
        popular: i <= 2
      });
    }
  });

  return products;
};
