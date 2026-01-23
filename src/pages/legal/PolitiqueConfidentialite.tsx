import React from 'react';

const PolitiqueConfidentialite: React.FC = () => {
  return (
    <div className="container-amazon py-10">
      <h1 className="text-3xl font-bold text-secondary-900 mb-8">Politique de Confidentialité</h1>
      
      <div className="bg-white p-8 rounded-amazon-lg shadow-sm border border-gray-200 space-y-8 text-secondary-700">
        <section>
          <h2 className="text-xl font-bold text-secondary-900 mb-4">1. Collecte de l’information</h2>
          <p className="leading-relaxed">
            Nous recueillons des informations lorsque vous vous inscrivez sur notre site, lorsque vous vous connectez à votre compte, faites un achat, participez à un concours, et / ou lorsque vous vous déconnectez. 
            Les informations recueillies incluent votre nom, votre adresse e-mail, numéro de téléphone, et / ou carte de crédit.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-secondary-900 mb-4">2. Utilisation des informations</h2>
          <p className="leading-relaxed">
            Toutes les informations que nous recueillons auprès de vous peuvent être utilisées pour :
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Personnaliser votre expérience et répondre à vos besoins individuels</li>
            <li>Fournir un contenu publicitaire personnalisé</li>
            <li>Améliorer notre site Web</li>
            <li>Améliorer le service client et vos besoins de prise en charge</li>
            <li>Vous contacter par e-mail</li>
            <li>Administrer un concours, une promotion, ou une enquête</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-secondary-900 mb-4">3. Confidentialité du commerce en ligne</h2>
          <p className="leading-relaxed">
            Nous sommes les seuls propriétaires des informations recueillies sur ce site. Vos informations personnelles ne seront pas vendues, échangées, transférées, ou données à une autre société pour n’importe quelle raison, sans votre consentement, en dehors de ce qui est nécessaire pour répondre à une demande et / ou une transaction, comme par exemple pour expédier une commande.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-secondary-900 mb-4">4. Divulgation à des tiers</h2>
          <p className="leading-relaxed">
            Nous ne vendons, n’échangeons et ne transférons pas vos informations personnelles identifiables à des tiers. Cela ne comprend pas les tierce parties de confiance qui nous aident à exploiter notre site Web ou à mener nos affaires, tant que ces parties conviennent de garder ces informations confidentielles.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-secondary-900 mb-4">5. Protection des informations</h2>
          <p className="leading-relaxed">
            Nous mettons en œuvre une variété de mesures de sécurité pour préserver la sécurité de vos informations personnelles. Nous utilisons un cryptage à la pointe de la technologie pour protéger les informations sensibles transmises en ligne. Nous protégeons également vos informations hors ligne. Seuls les employés qui ont besoin d’effectuer un travail spécifique (par exemple, la facturation ou le service à la clientèle) ont accès aux informations personnelles identifiables.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-secondary-900 mb-4">6. Consentement</h2>
          <p className="leading-relaxed">
            En utilisant notre site, vous consentez à notre politique de confidentialité.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PolitiqueConfidentialite;
