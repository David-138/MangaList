import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MangaList from "./mangalist";
import { describe, it, expect, vi } from "vitest";
import React from "react";
import { useSearchParams } from "react-router-dom";

vi.mock("react-router-dom", () => ({
  useSearchParams: vi.fn(() => {
    const searchParams = new URLSearchParams({ page: "0" });
    const setSearchParams = vi.fn();
    return [searchParams, setSearchParams];
  }),
  Link: ({ children }) => <>{children}</>,
}));

describe("Componente MangaList", () => {
  it('Carga 20 mangas', async () => {
    const mockMangas = Array.from({ length: 20 }, (_, i) => ({
      ID_manga: i,
      titulo: `Manga ${i + 1}`,
      ID_Portada: i,
    }));
  
    global.fetch = vi.fn((url) => {
      if (url.includes('localhost:5000/mangas')) {
        return Promise.resolve({
          json: () => Promise.resolve({ mangas: mockMangas }),
        });
      }
      if (url.includes('kitsu.io/api/edge/manga')) {
        return Promise.resolve({
          json: () => Promise.resolve({ data: { attributes: { posterImage: { small: 'image_url' } } }}),
        });
      }
    });
  
    render(<MangaList />);
    for (let i = 1; i <= 20; i++) {
      expect(await screen.findByText(`Manga ${i}`)).toBeInTheDocument();
    }
  });

  it('Salta de página', async () => {
    const mockMangas = Array.from({ length: 20 }, (_, i) => ({
      ID_manga: i,
      titulo: `Manga ${i + 1}`,
    }));

    global.fetch = vi.fn((url) => {
      if (url.includes("localhost:5000/mangas")) {
        return Promise.resolve({
          json: () => Promise.resolve({ mangas: mockMangas }),
        });
      }
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            data: { attributes: { posterImage: { small: "image_url" } } },
          }),
      });
    });

    const setSearchParamsMock = vi.fn();
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams({ page: "0" }),
      setSearchParamsMock,
    ]);

    render(<MangaList />);

    const nextPageButton = screen.getByText("Siguiente");
    fireEvent.click(nextPageButton);

    await waitFor(() => {
      expect(setSearchParamsMock).toHaveBeenCalledWith({ page: 1 });
    });
  });
});
