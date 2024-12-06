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
            <img src="/assets/img/listaMangas.png" alt=""></img>
          </div>
        </Link>
        <Link to={`/AdvancedSearch`}>
          <div className="menuBoton">
            <img src="/assets/img/BusquedaAvanzada.png" alt=""></img>
          </div>
        </Link>
        <Link to={`/Achievements`}>
          <div className="menuBoton">
            <img src="/assets/img/logroBoton.png" alt=""></img>
          </div>
        </Link>
      </div>
    </>
  );
}

export default main;
