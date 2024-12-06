import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Header from "../../Components/Header/header";
import "./../css/search.css";

const Search = () => {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const handleGenreChange = (event) => {
    const genre = event.target.value;
    setSelectedGenres((prevGenres) =>
      prevGenres.includes(genre)
        ? prevGenres.filter((g) => g !== genre)
        : [...prevGenres, genre]
    );
  };

  useEffect(() => {
    if (selectedGenres.length === 0) {
      setSearchResults([]);
      return;
    }

    const genreQuery = selectedGenres.join(",");
    fetch(
      `http://localhost:5000/advanced-search?genres=${encodeURIComponent(
        genreQuery
      )}`
    )
      .then((response) => response.json())
      .then((data) => setSearchResults(data))
      .catch((error) => console.error("Error al realizar la búsqueda:", error));
  }, [selectedGenres]);

  return (
    <>
      <Header />
      <h1>Búsqueda Avanzada de Manga</h1>
      <div className="advSearch">
        <h3>Selecciona Géneros:</h3>
        <div className="check">
          <label>
            <input
              type="checkbox"
              value="Action"
              onChange={handleGenreChange}
            />
            Action
          </label>
          <label>
            <input
              type="checkbox"
              value="Adventure"
              onChange={handleGenreChange}
            />
            Adventure
          </label>
          <label>
            <input
              type="checkbox"
              value="Comedy"
              onChange={handleGenreChange}
            />
            Comedy
          </label>
          <label>
            <input type="checkbox" value="Drama" onChange={handleGenreChange} />
            Drama
          </label>
          <label>
            <input type="checkbox" value="Ecchi" onChange={handleGenreChange} />
            Ecchi
          </label>
          <label>
            <input
              type="checkbox"
              value="Fantasy"
              onChange={handleGenreChange}
            />
            Fantasy
          </label>
          <label>
            <input type="checkbox" value="Harem" onChange={handleGenreChange} />
            Harem
          </label>
          <label>
            <input
              type="checkbox"
              value="Henshin"
              onChange={handleGenreChange}
            />
            Henshin
          </label>
          <label>
            <input
              type="checkbox"
              value="Horror"
              onChange={handleGenreChange}
            />
            Horror
          </label>
          <label>
            <input
              type="checkbox"
              value="Isekai"
              onChange={handleGenreChange}
            />
            Isekai
          </label>
          <label>
            <input
              type="checkbox"
              value="Magical Girl"
              onChange={handleGenreChange}
            />
            Magical Girl
          </label>
          <label>
            <input type="checkbox" value="Mecha" onChange={handleGenreChange} />
            Mecha
          </label>
          <label>
            <input
              type="checkbox"
              value="Mystery"
              onChange={handleGenreChange}
            />
            Mystery
          </label>
          <label>
            <input
              type="checkbox"
              value="Psychological"
              onChange={handleGenreChange}
            />
            Psychological
          </label>
          <label>
            <input
              type="checkbox"
              value="Romance"
              onChange={handleGenreChange}
            />
            Romance
          </label>
          <label>
            <input
              type="checkbox"
              value="School"
              onChange={handleGenreChange}
            />
            School
          </label>
          <label>
            <input
              type="checkbox"
              value="Science Fiction"
              onChange={handleGenreChange}
            />
            Science Fiction
          </label>
          <label>
            <input
              type="checkbox"
              value="Slice of Life"
              onChange={handleGenreChange}
            />
            Slice of Life
          </label>
          <label>
            <input
              type="checkbox"
              value="Thriller"
              onChange={handleGenreChange}
            />
            Thriller
          </label>
          <label>
            <input
              type="checkbox"
              value="Virtual Reality"
              onChange={handleGenreChange}
            />
            Virtual Reality
          </label>
        </div>
      </div>
      <div>
        {searchResults.length > 0 ? (
          <ul>
            {searchResults.map((manga) => (
              <li key={manga.ID_manga}>
                <div className="mangaSelect">
                  <Link className="portada" to={`/manga/${manga.ID_portada}`}>
                    <img
                      src={`https://kitsu.io/api/edge/media/${manga.ID_portada}`}
                      alt={manga.titulo}
                    />
                  </Link>
                  <Link to={`/manga/${manga.ID_portada}`}>{manga.titulo}</Link>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No se encontraron resultados.</p>
        )}
      </div>
    </>
  );
};

export default Search;
