import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddUserPage() {
  const [nombre, setNombre] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Crear objeto y realizar post request
    const nuevoUsuario = { nombre };

    axios
      .post("http://127.0.0.1:2000/api/users/adduser", nuevoUsuario)
      .then(navigate("/users", { replace: true }));

    // Limpia los campos después de enviar
    setNombre("");
  };

  return (
    <form onSubmit={handleSubmit} className="main-content">
      <label>
        Nombre:
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </label>
      <button type="submit" className="submit-btn big-btn">Agregar Usuario</button>
    </form>
  );
}

export default AddUserPage;
