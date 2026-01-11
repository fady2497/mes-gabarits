import React from 'react';
import { MessageCircle } from 'lucide-react';
import { whatsappUrl } from '../config';

export default function FloatingWhatsapp() {
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40 rounded-full shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white p-4 hover:scale-[1.03] transition"
      aria-label="WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
    </a>
  );
}
