import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import miApi from "..";
import PageHeader from "../common/PageHeader";

// assets
import icon from './../assets/face.svg'

function AddUserPage() {
  const [nombre, setNombre] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Crear objeto y realizar post request
    const nuevoUsuario = { nombre };

    miApi.post("users/adduser", nuevoUsuario)
      .then(res => navigate("/users", { replace: true }))
      .catch(err => alert("Error al agregar usuario - " + err))

    // Limpia los campos después de enviar
    setNombre("");
  };

  return (
    <div className="main-content">
      <div className="main-header">
        <Link to="/users">
          <PageHeader color="#ccccff" icon={icon} name="Usuarios" />
        </Link>
      </div>

      <form onSubmit={handleSubmit} >
      <label>
        Nombre y Apellido:
        <input
          type="text"
          minLength={8}
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </label>
      <button type="submit" className="submit-btn big-btn">Agregar Usuario</button>
    </form>
    </div>
    
  );
}

export default AddUserPage;
