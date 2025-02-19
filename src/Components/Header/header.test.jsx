import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Header from "./header";
import { describe, it, expect, vi } from "vitest";
import React from "react";

vi.mock("react-router-dom", () => ({
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

describe("Componente header (realmente solo es la barra de búsqueda)", () => {
  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              ID_manga: "93",
              ID_portada: "111",
            },
          ]),
      })
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("Se ve la barra al pulsar la lupa", () => {
    render(<Header />);

    const lupa = screen.getByAltText("Buscar");
    fireEvent.click(lupa);

    const inputBusqueda = screen.getByPlaceholderText(
      "Buscar manga por nombre"
    );
    expect(inputBusqueda).toBeInTheDocument();
  });

  it("Sale el mensaje de búsqueda mientras se busca", async () => {
    render(<Header />);

    const lupa = screen.getByAltText("Buscar");
    fireEvent.click(lupa);

    const inputBusqueda = screen.getByPlaceholderText(
      "Buscar manga por nombre"
    );
    fireEvent.change(inputBusqueda, { target: { value: "Dragon Ball" } });

    expect(screen.getByText("Buscando...")).toBeInTheDocument();
  });

  it("Esta cosa funciona y se ven los mangas al buscar", async () => {
    global.fetch = vi.fn((url) => {
      if (url.includes("search/manga")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([{ ID_manga: "93", ID_portada: "111" }]),
        });
      }
      if (url.includes("kitsu.io")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              data: {
                attributes: {
                  posterImage: {
                    small: "http://localhost:3000/manga/DragonBall.jpg",
                  },
                  titles: { en_jp: "Dragon Ball" },
                },
              },
            }),
        });
      }
      return Promise.reject(new Error("Not Found"));
    });

    render(<Header />);

    const lupa = screen.getByAltText("Buscar");
    fireEvent.click(lupa);

    const inputBusqueda = screen.getByPlaceholderText(
      "Buscar manga por nombre"
    );
    fireEvent.change(inputBusqueda, { target: { value: "Dragon Ball" } });

    expect(await screen.findByText('Dragon Ball')).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByRole("img", { name: "Dragon Ball" })).toHaveAttribute(
        "src",
        "http://localhost:3000/manga/DragonBall.jpg"
      )
    );
  });
});
