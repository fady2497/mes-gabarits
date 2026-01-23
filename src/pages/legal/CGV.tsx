import React from 'react';

const CGV: React.FC = () => {
  return (
    <div className="container-amazon py-10">
      <h1 className="text-3xl font-bold text-secondary-900 mb-8">Conditions Générales de Vente (CGV)</h1>
      
      <div className="bg-white p-8 rounded-amazon-lg shadow-sm border border-gray-200 space-y-8 text-secondary-700">
        <section>
          <p className="leading-relaxed mb-4">
            Les présentes Conditions Générales de Vente (CGV) régissent les ventes de produits proposées sur le site <strong>gabarits.fr</strong>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-secondary-900 mb-4">1. Produits</h2>
          <p className="leading-relaxed">
            Les produits proposés sont des gabarits destinés à un usage professionnel ou artisanal, principalement dans le domaine de la sellerie auto et moto.
            Chaque produit est décrit avec le plus grand soin. Les photographies sont non contractuelles.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-secondary-900 mb-4">2. Prix</h2>
          <p className="leading-relaxed">
            Les prix sont indiqués en euros (€), toutes taxes comprises (TTC) ou hors taxes (HT) selon le statut du vendeur.
            Gabarits.fr se réserve le droit de modifier ses prix à tout moment, sans effet rétroactif.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-secondary-900 mb-4">3. Commande</h2>
          <p className="leading-relaxed">
            Toute commande passée sur le site implique l’acceptation pleine et entière des présentes CGV.
            Une confirmation de commande est envoyée par email après validation du paiement.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-secondary-900 mb-4">4. Paiement</h2>
          <p className="leading-relaxed">
            Le paiement est exigible immédiatement à la commande.
            Les paiements sont sécurisés via les solutions proposées sur le site (carte bancaire, PayPal ou autre).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-secondary-900 mb-4">5. Livraison</h2>
          <p className="leading-relaxed">
            Les produits sont livrés à l’adresse indiquée par le client lors de la commande.
            Les délais de livraison sont indiqués à titre indicatif et peuvent varier selon la nature du produit (fabrication, stock, transport).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-secondary-900 mb-4">6. Droit de rétractation</h2>
          <p className="leading-relaxed">
            Conformément à la législation en vigueur, le droit de rétractation ne s’applique pas aux produits personnalisés ou fabriqués sur mesure.
            Pour les produits standards, le client dispose d’un délai légal de rétractation, sous réserve que le produit soit retourné en parfait état.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-secondary-900 mb-4">7. Responsabilité</h2>
          <p className="leading-relaxed">
            Gabarits.fr ne saurait être tenu responsable d’une mauvaise utilisation des produits ou d’une incompatibilité avec un usage non prévu.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-secondary-900 mb-4">8. Droit applicable</h2>
          <p className="leading-relaxed">
            Les présentes CGV sont soumises au droit français.
            En cas de litige, une solution amiable sera privilégiée avant toute action judiciaire.
          </p>
        </section>
      </div>
    </div>
  );
};

export default CGV;
