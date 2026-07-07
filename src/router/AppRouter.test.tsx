import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppRouter from './AppRouter';

it('renders login page', () => {
  render(
    <MemoryRouter initialEntries={['/login']}>
      <AppRouter />
    </MemoryRouter>
  );

  expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
});
