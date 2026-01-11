import React, { useEffect, useState } from 'react';
import { Bot } from 'lucide-react';

export default function FloatingDock() {
  const [visible, setVisible] = useState(true);
  const [isLandscape, setIsLandscape] = useState(false);
  useEffect(() => {
    const update = () => {
      const mq =
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(orientation: landscape)').matches;
      setIsLandscape(!!mq);
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update as any);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update as any);
    };
  }, []);
  useEffect(() => {
    setVisible(true);
  }, []);
  const openBot = () => {
    window.dispatchEvent(new CustomEvent('open-support-bot'));
  };
  return (
    <div
      className="fixed z-50 pointer-events-auto"
      style={{
        left: '50%',
        transform: 'translateX(-50%)',
        bottom: isLandscape
          ? 'calc(env(safe-area-inset-bottom) + 80px)'
          : 'calc(env(safe-area-inset-bottom) + 16px)'
      }}
    >
      <div
        className={`rounded-full bg-black/60 backdrop-blur-md border border-white/10 shadow-lg px-3 py-2 flex items-center gap-2 transition-all duration-200 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <button
          onClick={openBot}
          aria-label="Assistance"
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center hover:scale-105 transition"
        >
          <Bot className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
