import { Link } from "react-router-dom";
import Header from "../../Components/Header/header";
import "../css/main.css";
function main() {
  return (
    <>
      <Header />
      <div className="menuMain">
        <Link to={`/MangaList`}>
          <div className="menuBoton">
            <img src="/assets/img/listaMangas.png" alt="Lista"></img>
          </div>
        </Link>
        <Link to={`/Search`}>
          <div className="menuBoton">
            <img src="/assets/img/BusquedaAvanzada.png" alt="BusquedaAvanzada"></img>
          </div>
        </Link>
        <Link to={`/Achievements`}>
          <div className="menuBoton">
            <img src="/assets/img/logroBoton.png" alt="Logros"></img>
          </div>
        </Link>
      </div>
    </>
  );
}

export default main;
