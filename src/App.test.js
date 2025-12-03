import { render, screen } from '@testing-library/react';
import App from './App';

test('affiche le titre Gabarits.fr', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /Gabarits\.fr/i })).toBeInTheDocument();
});
