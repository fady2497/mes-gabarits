import React from 'react';
import { CONTACT, WHATSAPP_URL } from '../constants/contact';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="container-amazon py-10">
      <div className="rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 text-white p-6 mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Contact</h1>
        <div className="flex items-center gap-3">
          <a
            href={`tel:${CONTACT.phone}`}
            className="btn-secondary bg-white text-slate-900 hover:bg-amber-100"
          >
            Appeler
          </a>
          <a
            href={`mailto:${CONTACT.email}`}
            className="btn-secondary bg-white text-slate-900 hover:bg-amber-100"
          >
            Écrire un email
          </a>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="btn-secondary bg-white text-slate-900 hover:bg-amber-100"
          >
            WhatsApp
          </a>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-amazon p-6 hover:shadow-md">
          <div className="flex items-center gap-2 text-secondary-900 mb-2">
            <Phone /> Téléphone
          </div>
          <a href={`tel:${CONTACT.phone}`} className="text-primary-700 font-semibold">
            {CONTACT.phone}
          </a>
        </div>
        <div className="card-amazon p-6 hover:shadow-md">
          <div className="flex items-center gap-2 text-secondary-900 mb-2">
            <Mail /> Email
          </div>
          <a href={`mailto:${CONTACT.email}`} className="text-primary-700 font-semibold">
            {CONTACT.email}
          </a>
        </div>
        <div className="card-amazon p-6 hover:shadow-md">
          <div className="flex items-center gap-2 text-secondary-900 mb-2">
            <MessageCircle /> WhatsApp
          </div>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="text-primary-700 font-semibold"
          >
            Ouvrir WhatsApp
          </a>
        </div>
      </div>
      <div className="card-amazon p-6 mt-6">
        <div className="flex items-center gap-2 text-secondary-900 mb-2">
          <MapPin /> Localisation
        </div>
        <div className="text-secondary-700">
          Atelier situé en France 🇫🇷<br />
          Expédition rapide dans toute l'Europe.
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-secondary-600">
          Notre équipe vous répond sous 24h ouvrées (Lundi - Samedi).
        </div>
      </div>
    </div>
  );
}
