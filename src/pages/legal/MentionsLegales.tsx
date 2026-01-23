import React from 'react';

const MentionsLegales: React.FC = () => {
  return (
    <div className="container-amazon py-10">
      <h1 className="text-3xl font-bold text-secondary-900 mb-8">Mentions Légales</h1>
      
      <div className="bg-white p-8 rounded-amazon-lg shadow-sm border border-gray-200 space-y-8">
        <section>
          <p className="text-secondary-700 leading-relaxed mb-4">
            Conformément aux dispositions de la loi n°2004-575 du 21 juin 2004 pour la confiance dans l’économie numérique, il est précisé aux utilisateurs du site <strong>gabarits.fr</strong> l’identité des différents intervenants dans le cadre de sa réalisation et de son suivi.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-secondary-900 mb-4">Éditeur du site</h2>
          <p className="text-secondary-700 leading-relaxed">
            <strong>Nom commercial :</strong> Gabarits.fr<br />
            <strong>Responsable de la publication :</strong> [Ton nom / raison sociale]<br />
            <strong>Statut juridique :</strong> [Auto-entrepreneur / SARL / SAS / autre]<br />
            <strong>Adresse :</strong> [Adresse complète]<br />
            <strong>Email :</strong> [email de contact]<br />
            <strong>Téléphone :</strong> [optionnel mais recommandé]<br />
            <strong>SIRET :</strong> [numéro SIRET]
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-secondary-900 mb-4">Hébergement</h2>
          <p className="text-secondary-700 leading-relaxed">
            <strong>Hébergeur :</strong> [OVH / autre]<br />
            <strong>Adresse :</strong> [adresse de l’hébergeur]<br />
            <strong>Téléphone :</strong> [téléphone hébergeur]
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-secondary-900 mb-4">Propriété intellectuelle</h2>
          <p className="text-secondary-700 leading-relaxed">
            L’ensemble du contenu présent sur le site gabarits.fr (textes, images, graphismes, logos, fichiers, gabarits, etc.) est protégé par le droit de la propriété intellectuelle.
            Toute reproduction, représentation, modification ou exploitation, totale ou partielle, sans autorisation préalable est strictement interdite.
          </p>
        </section>
      </div>
    </div>
  );
};

export default MentionsLegales;
