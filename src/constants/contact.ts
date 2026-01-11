export const CONTACT = {
  email: 'contact.gabarits@gmail.com',
  phone: '+33759652867',
  social: {
    facebook: 'https://facebook.com/gabarits.fr',
    instagram: 'https://instagram.com/gabarits.fr',
    linkedin: 'https://linkedin.com/',
  },
}

export const WHATSAPP_URL = `https://wa.me/${CONTACT.phone.replace(/[^\d]/g, '')}?text=${encodeURIComponent('Bonjour, j’ai une question sur la livraison')}`

