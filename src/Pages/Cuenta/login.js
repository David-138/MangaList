import "./../css/registro.css";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../Components/Header/header";

function Login() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          NombreUsuario: usernameOrEmail,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        alert(`Bienvenido, ${data.nombre}!`);
        window.location.href = "/Profile";
      } else {
        setError(data.message || "Credenciales inválidas");
        console.log("Contraseña recibida en el servidor:", password);
      }
    } catch (error) {
      setError("Error al conectar con el servidor");
    }
  };

  return (
    <>
      <Header />
      <div className="login">
        <h2>Inicio de Sesión</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              placeholder="Usuario"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button type="submit">Iniciar Sesión</button>
          <Link to={`/Register`}>
            <button>¿Aún no tienes cuenta?</button>
          </Link>
        </form>
      </div>
    </>
  );
}

export default Login;
