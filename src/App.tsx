import React from 'react';
import AppRoutes from './routes';
import { CartProvider } from './store/index.tsx';

const App: React.FC = () => {
  return (
    <CartProvider>
      <AppRoutes />
    </CartProvider>
  );
};

export default App;
