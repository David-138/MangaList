import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import MangaDetail from './manga';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';

vi.mock('react-router-dom', () => ({
  useParams: () => ({ id: '28508' }),
  useNavigate: () => vi.fn(),
  useLocation: () => ({ state: { fromPage: 1 } }),
  Link: ({ children }) => <>{children}</>,
}));

describe('Componente MangaDetail', () => {
  it('Se muestra el mensaje de carga mientras el manga carga', () => {
    render(<MangaDetail />);
    const loadingMessage = screen.getByText('Cargando...');
    expect(loadingMessage).toBeInTheDocument();
  });

  it('Sale el mensaje de que la demografía no está disponible si no lo está', async () => {
    const mockManga = {
      titulo: 'Kumo desu ga, nani ka?',
      serializacion: 'Manga publicado de forma independiente o no se ha definido la revista'
    };
  
    global.fetch = vi.fn(() => Promise.resolve({ json: () => Promise.resolve(mockManga) }));
  
    render(<MangaDetail />);
    const demografiaMessage = await screen.findByText(/El manga es autopublicado o la revista aún no está en el archivo serialization\.js/);
    expect(demografiaMessage).toBeInTheDocument();
  });
});