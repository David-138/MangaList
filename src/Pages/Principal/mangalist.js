import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../../Components/Header/header";
import "./../css/mangaList.css";

function MangaList() {
  const [mangas, setMangas] = useState([]);
  const [coverImages, setCoverImages] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const limit = 20;
  const page = parseInt(searchParams.get("page") || "0", 10);

  useEffect(() => {
    fetch(`http://localhost:5000/mangas?page=${page}&limit=${limit}`)
      .then((response) => response.json())
      .then((data) => {
        setMangas(data.mangas);
        data.mangas.forEach((manga) => {
          if (manga.ID_Portada) {
            fetch(`https://kitsu.io/api/edge/manga/${manga.ID_Portada}`)
              .then((response) => response.json())
              .then((kitsuData) => {
                setCoverImages((prev) => ({
                  ...prev,
                  [manga.ID_manga]: kitsuData.data.attributes.posterImage.small,
                }));
              })
              .catch((error) =>
                console.error("Error al cargar portada:", error)
              );
          }
        });
      })
      .catch((error) => console.error("Error al cargar mangas:", error));
  }, [page]);

  const handleNextPage = () => {
    setSearchParams({ page: page + 1 });
  };

  const handlePrevPage = () => {
    setSearchParams({ page: Math.max(page - 1, 0) });
  };

  return (
    <>
      <Header />
      <div>
        <h1>Lista de Mangas</h1>
        <ul>
          {mangas.map((manga) => (
            <li key={manga.ID_manga}>
              <div className="mangaSelect">
                <Link
                  className="portadas"
                  to={`/manga/${manga.ID_manga}`}
                  state={{ fromPage: page }}
                >
                  <img
                    src={coverImages[manga.ID_manga] || "/placeholder.jpg"}
                    alt={manga.titulo || manga.title}
                  />
                </Link>
                <Link
                  to={`/manga/${manga.ID_manga}`}
                  state={{ fromPage: page }}
                >
                  {manga.titulo || manga.title}
                </Link>
              </div>
            </li>
          ))}
        </ul>
        <div>
          <button onClick={handlePrevPage} disabled={page === 0}>
            Anterior
          </button>
          <button onClick={handleNextPage}>Siguiente</button>
        </div>
      </div>
    </>
  );
}

export default MangaList;
