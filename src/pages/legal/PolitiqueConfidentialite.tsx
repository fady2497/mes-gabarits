import React from 'react';

const PolitiqueConfidentialite: React.FC = () => {
  return (
    <div className="container-amazon py-10">
      <h1 className="text-3xl font-bold text-secondary-900 mb-8">Politique de Confidentialité</h1>
      
      <div className="bg-white p-8 rounded-amazon-lg shadow-sm border border-gray-200 space-y-8 text-secondary-700">
        <section>
          <p className="leading-relaxed mb-4">
            Le site <strong>gabarits.fr</strong> attache une grande importance à la protection des données personnelles de ses utilisateurs.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-secondary-900 mb-4">1. Données collectées</h2>
          <p className="leading-relaxed">
            Les données susceptibles d’être collectées sont :
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Nom et prénom</li>
            <li>Adresse email</li>
            <li>Adresse postale</li>
            <li>Informations nécessaires au traitement des commandes</li>
          </ul>
          <p className="leading-relaxed mt-2">
            Ces données sont collectées uniquement dans le cadre de l’utilisation du site et des commandes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-secondary-900 mb-4">2. Utilisation des données</h2>
          <p className="leading-relaxed">
            Les données collectées sont utilisées pour :
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Le traitement des commandes</li>
            <li>La gestion de la relation client</li>
            <li>L’amélioration des services proposés</li>
          </ul>
          <p className="leading-relaxed mt-2">
            Aucune donnée n’est vendue ou cédée à des tiers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-secondary-900 mb-4">3. Sécurité</h2>
          <p className="leading-relaxed">
            Gabarits.fr met en œuvre toutes les mesures nécessaires pour assurer la sécurité et la confidentialité des données personnelles.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-secondary-900 mb-4">4. Droits des utilisateurs</h2>
          <p className="leading-relaxed">
            Conformément au Règlement Général sur la Protection des Données (RGPD), l’utilisateur dispose d’un droit d’accès, de rectification et de suppression de ses données.
            Toute demande peut être adressée par email à : [email de contact].
          </p>
        </section>
      </div>
    </div>
  );
};

export default PolitiqueConfidentialite;
