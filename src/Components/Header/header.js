import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./header.css";

function Header() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthenticated(true);
    }
  }, []);

  const [showMenu, setShowMenu] = useState(false);
  const toggleMenu = () => {
    setShowMenu(!showMenu);
    if (showBuscar) {
      setShowBuscar(!showBuscar);
    }
  };

  const [showBuscar, setShowBuscar] = useState(false);
  const toggleBuscar = () => {
    setShowBuscar(!showBuscar);
    if (showMenu) {
      setShowMenu(!showMenu);
    }
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      setLoading(true);

      fetch(`http://localhost:5000/search/manga?search=${encodeURIComponent(searchQuery)}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al buscar en la base de datos");
          }
          return response.json();
        })
        .then(async (data) => {
          const mangaWithCovers = await Promise.all(
            data.map(async (manga) => {
              const kitsuResponse = await fetch(
                `https://kitsu.io/api/edge/manga/${manga.ID_portada}`
              );
              const kitsuData = await kitsuResponse.json();
              return {
                ...manga,
                coverImage: kitsuData.data.attributes.posterImage.small,
                title: kitsuData.data.attributes.titles.en_jp || kitsuData.data.attributes.titles.en,
              };
            })
          );
          setSearchResults(mangaWithCovers);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error al buscar manga:", error);
          setLoading(false);
        });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <div className="header">
      <div className="headermenu">
        <img
          className="imgmenu"
          src="/assets/img/menu.png"
          alt=""
          onClick={toggleMenu}
        />
        <nav>
          {!token ? (
            <Link to="/login">
              <button className="logBoton">Iniciar Sesión</button>
            </Link>
          ) : (
            <>
              <Link to="/Profile">
                <img className="icon" src="/assets/img/icon.png" alt=""></img>
              </Link>
            </>
          )}
        </nav>

        <img
          className="imgbuscar"
          src="/assets/img/lupa.png"
          alt=""
          onClick={toggleBuscar}
        />
      </div>
      <div className="headerlist">
        <ul className={showMenu ? "" : "hidden"}>
          <li>
            <a href="/">Main</a>
          </li>
          <li>
            <a href="/Achievements">Logros</a>
          </li>
          <li>
            <a href="/Search">Busqueda avanzada</a>
          </li>
          <li>
            <a href="/MangaList">Lista de Mangas</a>
          </li>
        </ul>
      </div>
      <div className={showBuscar ? "buscar" : "hidden"}>
        <div className="barraBusqueda">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Buscar manga por nombre"
          />
        </div>
        {loading && <p>Buscando...</p>}
        <div className="resultado">
          {searchResults.length > 0 ? (
            searchResults.map((manga) => (
              <div className="mangaSelect" key={manga.ID_manga}>
                <Link className="portadas" to={`/manga/${manga.ID_manga}`}>
                  <img src={manga.coverImage} alt={manga.title} />
                </Link>
                <Link to={`/manga/${manga.ID_manga}`}>{manga.title}</Link>
              </div>
            ))
          ) : (
            <p>No se encontraron resultados.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
