import React from 'react';

const MentionsLegales: React.FC = () => {
  return (
    <div className="container-amazon py-10">
      <h1 className="text-3xl font-bold text-secondary-900 mb-8">Mentions Légales</h1>
      
      <div className="bg-white p-8 rounded-amazon-lg shadow-sm border border-gray-200 space-y-8">
        <section>
          <h2 className="text-xl font-bold text-secondary-900 mb-4">1. Éditeur du site</h2>
          <p className="text-secondary-700 leading-relaxed">
            Le site <strong>gabarits.fr</strong> est édité par l'entreprise <strong>Gabarits.fr</strong>,<br />
            spécialisée dans la conception et la vente de gabarits de sellerie pour automobiles et motos.<br />
            <br />
            <strong>Siège social :</strong> [Votre Adresse Complète]<br />
            <strong>Email :</strong> contact@gabarits.fr<br />
            <strong>Téléphone :</strong> 06 00 00 00 00<br />
            <strong>SIRET :</strong> [Numéro SIRET]<br />
            <strong>Directeur de la publication :</strong> [Votre Nom]
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-secondary-900 mb-4">2. Hébergement</h2>
          <p className="text-secondary-700 leading-relaxed">
            Le site est hébergé par :<br />
            <strong>GitHub Pages / Vercel / OVH</strong><br />
            Adresse de l'hébergeur<br />
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-secondary-900 mb-4">3. Propriété intellectuelle</h2>
          <p className="text-secondary-700 leading-relaxed">
            L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. 
            Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
            La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est formellement interdite sauf autorisation expresse du directeur de la publication.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-secondary-900 mb-4">4. Protection des données</h2>
          <p className="text-secondary-700 leading-relaxed">
            Conformément à la loi « Informatique et Libertés », vous disposez d'un droit d'accès, de modification et de suppression des données qui vous concernent.
            Pour l'exercer, contactez-nous via notre formulaire de contact ou par email.
          </p>
        </section>
      </div>
    </div>
  );
};

export default MentionsLegales;
