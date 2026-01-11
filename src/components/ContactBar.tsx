import React from 'react';
import { Phone, Mail } from 'lucide-react';
import { CONTACT } from '../constants/contact';

export default function ContactBar() {
  return (
    <div className="bg-white border-b border-gray-200 text-secondary-700">
      <div className="container-amazon py-2 flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <a
            href={`tel:${CONTACT.phone}`}
            className="flex items-center gap-1 hover:text-secondary-900"
          >
            <Phone size={16} /> {CONTACT.phone}
          </a>
          <a
            href={`mailto:${CONTACT.email}`}
            className="flex items-center gap-1 hover:text-secondary-900"
          >
            <Mail size={16} /> {CONTACT.email}
          </a>
        </div>
        <div />
      </div>
    </div>
  );
}
