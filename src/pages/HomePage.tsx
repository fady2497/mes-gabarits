import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Download, Zap, Award, Play, Pause } from 'lucide-react';
import { Button } from '../components/ui/button';

const HomePage: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    // Auto-play video after component mounts
    const timer = setTimeout(() => {
      if (videoRef.current) {
        videoRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            // Handle autoplay restrictions
            console.log('Autoplay prevented');
          });
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            className="w-full h-full object-cover opacity-30"
            loop
            muted
            playsInline
            poster="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          >
            <source
              src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-black/90" />
        </div>

        {/* Video Controls */}
        <button
          onClick={toggleVideo}
          className="absolute bottom-8 right-8 z-10 bg-black/50 backdrop-blur-sm rounded-full p-3 text-white hover:bg-black/70 transition-colors"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent animate-pulse">
            Gabarits Premium
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            Créez des gabarits professionnels pour motos, voitures, maisons et bateaux avec notre
            outil de conception universel
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/search?category=moto">
              <Button variant="premium" size="lg" className="text-lg px-8 py-4">
                <Zap className="w-5 h-5 mr-2" />
                Commencer la création
              </Button>
            </Link>
            <Link to="/catalogue/moto">
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-4 border-amber-500 text-amber-400 hover:bg-amber-500/10"
              >
                <Download className="w-5 h-5 mr-2" />
                Voir le catalogue
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-amber-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-amber-400 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              Une solution universelle
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Notre plateforme s'adapte à tous vos projets, qu'ils soient automobiles, nautiques ou
              architecturaux
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Moto Card */}
            <div className="group relative bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 border border-amber-500/20 hover:border-amber-400/40 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10">
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity">
                <Award className="w-10 h-10 text-white" />
              </div>
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Motos</h3>
                <p className="text-gray-400 mb-6">
                  Gabarits professionnels pour selles moto, housses et accessoires de sellerie
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center text-amber-400">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  <span className="text-sm">Templates Sport & Touring</span>
                </div>
                <div className="flex items-center text-amber-400">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  <span className="text-sm">Cruiser & Custom</span>
                </div>
                <div className="flex items-center text-amber-400">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  <span className="text-sm">Mesures précises incluses</span>
                </div>
              </div>
            </div>

            {/* Voiture Card */}
            <div className="group relative bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 border border-amber-500/20 hover:border-amber-400/40 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Voitures</h3>
                <p className="text-gray-400 mb-6">
                  Créez des gabarits pour sièges auto, housses et accessoires intérieurs
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center text-amber-400">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  <span className="text-sm">Berline & Compact</span>
                </div>
                <div className="flex items-center text-amber-400">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  <span className="text-sm">SUV & 4x4</span>
                </div>
                <div className="flex items-center text-amber-400">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  <span className="text-sm">Formats adaptatifs</span>
                </div>
              </div>
            </div>

            {/* Maison & Bateau Card */}
            <div className="group relative bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 border border-amber-500/20 hover:border-amber-400/40 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Maison & Bateau</h3>
                <p className="text-gray-400 mb-6">
                  Gabarits pour mobilier, coussins, biminis et accessoires marins
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center text-amber-400">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  <span className="text-sm">Canapés & Fauteuils</span>
                </div>
                <div className="flex items-center text-amber-400">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  <span className="text-sm">Coussins & Tentes</span>
                </div>
                <div className="flex items-center text-amber-400">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  <span className="text-sm">Biminis & Tauds</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-amber-600 to-amber-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Prêt à créer ?</h2>
          <p className="text-xl text-amber-100 mb-8">
            Rejoignez des milliers de professionnels qui utilisent nos gabarits premium
          </p>
          <Link to="/search?category=moto">
            <Button
              variant="outline"
              size="lg"
              className="bg-white text-amber-700 hover:bg-amber-50 border-white"
            >
              <Award className="w-5 h-5 mr-2" />
              Commencer maintenant
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
