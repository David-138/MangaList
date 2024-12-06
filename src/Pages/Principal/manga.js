import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../../Components/Header/header";
import serialization from "../AyudaParaInserts/serialization";
import "./../css/manga.css";

function MangaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [manga, setManga] = useState(null);
  const [coverImage, setCoverImage] = useState("");
  const [demografia, setDemografia] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5000/manga/${id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setManga(data);

        const revista = data.serializacion;
        if (revista && serialization[revista]) {
          setDemografia(serialization[revista]);
        } else {
          setDemografia(
            "La revista aún no está en el archivo serialization.js"
          );
        }

        const kitsuId = data.ID_Portada;
        if (kitsuId) {
          fetch(`https://kitsu.io/api/edge/manga/${kitsuId}`)
            .then((response) => response.json())
            .then((kitsuData) => {
              const cover = kitsuData.data?.attributes?.posterImage?.small;
              if (cover) {
                setCoverImage(cover);
              }
            })
            .catch((error) =>
              console.error("Error al cargar la portada desde Kitsu:", error)
            );
        }
      })
      .catch((error) =>
        console.error("Error al cargar el manga desde la base de datos:", error)
      );
  }, [id]);

  if (!manga) return <div>Cargando...</div>;

  const fromPage = location.state?.fromPage ?? 0;

  return (
    <>
      <Header />
      <h1>{manga.titulo || manga.title}</h1>
      <div className="datos">
        <div className="portada">
          {coverImage && (
            <img
              src={coverImage}
              alt={`Portada de ${manga.titulo || manga.title}`}
            />
          )}
          <p className="sinopsis">{manga.sinopsis}</p>
        </div>
        <div className="otrosDatos">
          <h3>Demografía:</h3>
          <p>{demografia}</p>
          <h3>Géneros:</h3>
          {manga.genres && manga.genres.length > 0 ? (
            <ul>
              {manga.genres.map((genre, index) => (
                <li key={index}>{genre}</li>
              ))}
            </ul>
          ) : (
            <p>No hay géneros disponibles.</p>
          )}
          <button onClick={() => navigate(`/mangaList/?page=${fromPage}`)}>
            Volver a la lista
          </button>
        </div>
      </div>
    </>
  );
}

export default MangaDetail;
