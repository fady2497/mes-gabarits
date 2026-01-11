import { render, screen } from '@testing-library/react';
import React from 'react';

// Utilise le mock automatique fallback depuis __mocks__
jest.mock(
  'react-router-dom',
  () => {
    const React = require('react');
    return {
      __esModule: true,
      BrowserRouter: ({ children }) => <div>{children}</div>,
      Routes: ({ children }) => <div>{children}</div>,
      Route: ({ children }) => <div>{children}</div>,
      Link: ({ children, to }) => <a href={typeof to === 'string' ? to : '#'}>{children}</a>,
      Outlet: ({ children }) => <div>{children}</div>,
      useNavigate: jest.fn(),
      useLocation: () => ({ pathname: '/' })
    };
  },
  { virtual: true }
);

import App from './App';

// Mock global crypto for tests
global.crypto = {
  randomUUID: () => 'test-uuid'
};

test('affiche le titre Gabarits.fr', async () => {
  render(<App />);
  const titres = await screen.findAllByText(/Gabarits\.fr/i);
  expect(titres.length).toBeGreaterThan(0);
});
