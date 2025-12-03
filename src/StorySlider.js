import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const images = [
  '/images/moto1.jpeg',
  '/images/moto2.jpeg',
  '/images/siege1.jpeg',
  '/images/siege2.jpeg',
  '/images/moto3.jpeg',
  '/images/siege4.jpeg',
  '/images/siege5.jpeg',
  '/images/siege6.jpeg',
  '/images/siege3.jpeg'
];

function StorySlider() {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Gestion du défilement automatique
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextImage();
          return 0;
        }
        return prev + 1;
      });
    }, 40);

    return () => clearInterval(interval);
  }, []);

  const nextImage = () => {
    setIndex((i) => (i + 1) % images.length);
    setProgress(0);
  };

  const prevImage = () => {
    setIndex((i) => (i - 1 + images.length) % images.length);
    setProgress(0);
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-20 relative">
      {/* Barre de progression style Stories */}
      <div className="flex gap-2 mb-4 px-4">
        {images.map((_, i) => (
          <div key={i} className="h-1 flex-1 bg-gray-300 rounded">
            <div
              className={`h-full rounded ${i === index ? 'bg-blue-500' : 'bg-gray-400'}`}
              style={{ width: i === index ? `${progress}%` : '100%' }}
            ></div>
          </div>
        ))}
      </div>

      {/* Image */}
      <div className="relative w-full h-96 rounded-xl overflow-hidden shadow-xl">
        <img src={images[index]} alt="story" className="w-full h-full object-cover" />

        {/* Flèche gauche */}
        <button
          onClick={prevImage}
          className="absolute top-1/2 left-3 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full shadow-lg"
        >
          <ChevronLeft size={28} />
        </button>

        {/* Flèche droite */}
        <button
          onClick={nextImage}
          className="absolute top-1/2 right-3 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full shadow-lg"
        >
          <ChevronRight size={28} />
        </button>
      </div>
    </div>
  );
}

export default StorySlider;
