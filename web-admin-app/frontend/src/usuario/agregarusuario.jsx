import React, { useState } from 'react';
import axios from 'axios';
import { Router, useNavigate } from 'react-router-dom';
function Agregarusuario() {
  const navigate=useNavigate();
  const [nombre, setNombre] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();

    // Aquí puedes enviar los datos del formulario a tu servidor o hacer lo que desees con ellos
    const nuevoUsuario = {
      nombre
    };

    console.log('Nueva usuario:', nuevoUsuario);
    axios.post("http://127.0.0.1:2000/api/users/adduser",
      nuevoUsuario)
      .then(navigate('/users',{replace:true}))
    // Limpia los campos después de enviar
    setNombre('');
  };
  return (
    <form onSubmit={handleSubmit}>
    <label>
      Nombre:
      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />
    </label>
    <button type="submit">Agregar Usuario</button>
    </form>
  )
}

export default Agregarusuario