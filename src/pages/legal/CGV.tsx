import React from 'react';

const CGV: React.FC = () => {
  return (
    <div className="container-amazon py-10">
      <h1 className="text-3xl font-bold text-secondary-900 mb-8">Conditions Générales de Vente (CGV)</h1>
      
      <div className="bg-white p-8 rounded-amazon-lg shadow-sm border border-gray-200 space-y-8 text-secondary-700">
        <section>
          <h2 className="text-xl font-bold text-secondary-900 mb-4">1. Objet</h2>
          <p className="leading-relaxed">
            Les présentes conditions régissent les ventes de gabarits de sellerie par l'entreprise <strong>Gabarits.fr</strong>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-secondary-900 mb-4">2. Prix</h2>
          <p className="leading-relaxed">
            Les prix de nos produits sont indiqués en euros toutes taxes comprises (TTC), sauf indication contraire et hors frais de traitement et d'expédition.
            Toutes les commandes quelle que soit leur origine sont payables en euros.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-secondary-900 mb-4">3. Commandes</h2>
          <p className="leading-relaxed">
            Vous pouvez passer commande sur Internet via le site <strong>gabarits.fr</strong>.
            Les informations contractuelles sont présentées en langue française et feront l'objet d'une confirmation au plus tard au moment de la validation de votre commande.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-secondary-900 mb-4">4. Validation de votre commande</h2>
          <p className="leading-relaxed">
            Toute commande figurant sur le site Internet suppose l'adhésion aux présentes Conditions Générales.
            Toute confirmation de commande entraîne votre adhésion pleine et entière aux présentes conditions générales de vente, sans exception ni réserve.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-secondary-900 mb-4">5. Paiement</h2>
          <p className="leading-relaxed">
            Le fait de valider votre commande implique pour vous l'obligation de payer le prix indiqué.
            Le règlement de vos achats s'effectue par carte bancaire grâce au système sécurisé.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-secondary-900 mb-4">6. Rétractation</h2>
          <p className="leading-relaxed">
            Conformément aux dispositions de l'article L.121-21 du Code de la Consommation, vous disposez d'un délai de rétractation de 14 jours à compter de la réception de vos produits pour exercer votre droit de rétractation sans avoir à justifier de motifs ni à payer de pénalité.
            Les retours sont à effectuer dans leur état d'origine et complets (emballage, accessoires, notice). Dans ce cadre, votre responsabilité est engagée. Tout dommage subi par le produit à cette occasion peut être de nature à faire échec au droit de rétractation.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-secondary-900 mb-4">7. Disponibilité</h2>
          <p className="leading-relaxed">
            Nos produits sont proposés tant qu'ils sont visibles sur le site et dans la limite des stocks disponibles.
            Pour les produits non stockés, nos offres sont valables sous réserve de disponibilité chez nos fournisseurs.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-secondary-900 mb-4">8. Livraison</h2>
          <p className="leading-relaxed">
            Les produits sont livrés à l'adresse de livraison indiquée au cours du processus de commande, dans le délai indiqué sur la page de validation de la commande (généralement 5 à 7 jours).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-secondary-900 mb-4">9. Garantie</h2>
          <p className="leading-relaxed">
            Tous nos produits bénéficient de la garantie légale de conformité et de la garantie des vices cachés, prévues par les articles 1641 et suivants du Code civil.
            En cas de non-conformité d'un produit vendu, il pourra être retourné, échangé ou remboursé.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-secondary-900 mb-4">10. Droit applicable en cas de litiges</h2>
          <p className="leading-relaxed">
            La langue du présent contrat est la langue française. Les présentes conditions de vente sont soumises à la loi française.
            En cas de litige, les tribunaux français seront les seuls compétents.
          </p>
        </section>
      </div>
    </div>
  );
};

export default CGV;
