import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./../css/registro.css";
import Header from "../../Components/Header/header";

function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleCheckAndRegister = async () => {
    if (password !== confirmPassword) {
      setMessage("Las contraseñas no coinciden");
      return;
    }

    try {
      const checkResponse = await fetch("http://localhost:5000/check-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username }),
      });

      const checkData = await checkResponse.json();

      if (checkData.exists) {
        setMessage("El usuario o el email ya están registrados.");
        return;
      }
      const registerResponse = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
      });

      if (registerResponse.ok) {
        setMessage("Registro exitoso.");
      } else {
        setMessage("Hubo un error al registrar el usuario.");
      }
    } catch (error) {
      setMessage("Error de conexión con el servidor.");
    }
  };

  return (
    <>
    <Header/>
    <div className="registro">
      <h2>Registro</h2>
      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <input
        type="text"
        placeholder="Nombre de usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="Confirmar contraseña"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <br />
      <div className="botones">
        <button onClick={handleCheckAndRegister}>Registrarse</button>
        <Link to={`/Login`}>
          <button>¿Ya tienes cuenta?</button>
        </Link>
      </div>
      <p>{message}</p>
    </div>
    </>
  );
}

export default Register;
