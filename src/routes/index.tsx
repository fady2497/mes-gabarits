import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import Home from '../pages/Home';
import ProductPage from '../pages/ProductPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import SearchPage from '../pages/SearchPage';

import MyGabarits from '../pages/MyGabarits';
import ContactPage from '../pages/ContactPage';
import LivraisonPage from '../pages/support/Livraison';
import FAQPage from '../pages/support/FAQ';
import GarantiePage from '../pages/support/Garantie';
import AdsAdmin from '../pages/admin/AdsAdmin';
import OrdersAdmin from '../pages/admin/OrdersAdmin';
import SuppliersAdmin from '../pages/admin/SuppliersAdmin';
import ProductsAdmin from '../pages/admin/ProductsAdmin';
import AdminGuard from '../components/AdminGuard';
import AuthPage from '../pages/AuthPage';
import ClientSpacePage from '../pages/ClientSpacePage';
import MentionsLegales from '../pages/legal/MentionsLegales';
import CGV from '../pages/legal/CGV';
import PolitiqueConfidentialite from '../pages/legal/PolitiqueConfidentialite';

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="search" element={<SearchPage />} />
          {/* route createur retirée */}
          <Route path="mes-gabarits" element={<MyGabarits />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="support/livraison" element={<LivraisonPage />} />
          <Route path="support/faq" element={<FAQPage />} />
          <Route path="support/garantie" element={<GarantiePage />} />
          <Route path="legal/mentions-legales" element={<MentionsLegales />} />
          <Route path="legal/cgv" element={<CGV />} />
          <Route path="legal/confidentialite" element={<PolitiqueConfidentialite />} />
          <Route path="admin/ads" element={<AdsAdmin />} />
          <Route
            path="admin/orders"
            element={
              <AdminGuard>
                <OrdersAdmin />
              </AdminGuard>
            }
          />
          <Route
            path="admin/suppliers"
            element={
              <AdminGuard>
                <SuppliersAdmin />
              </AdminGuard>
            }
          />
          <Route
            path="admin/products"
            element={
              <AdminGuard>
                <ProductsAdmin />
              </AdminGuard>
            }
          />
          <Route path="product/:id" element={<ProductPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          {/* Authentification */}
          <Route path="auth/login" element={<AuthPage mode="login" />} />
          <Route path="auth/register" element={<AuthPage mode="register" />} />
          <Route path="espace-client" element={<ClientSpacePage />} />
          {/* À implémenter plus tard */}
          <Route path="seller/*" element={<div>Dashboard vendeur - À implémenter</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
