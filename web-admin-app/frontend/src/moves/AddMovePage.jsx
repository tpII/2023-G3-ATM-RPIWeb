import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import miApi from "..";

// assets
import icon from "./../assets/swap_horiz.svg";

// otros componentes
import PageHeader from "../common/PageHeader";

const AddMovePage = () => {
  const [users, setUsers] = useState([])
  const [origen, setOrigen] = useState('')
  const [destino, setDestino] = useState('')
  const [monto, setMonto] = useState(0)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault();

    // Controlar que origen y destino no coincidan
    if (origen === destino) {
      alert("Origen y destinatorio deben ser distintos")
      return
    }

    const doc = {
      emisorId: origen,
      receptorId: destino,
      monto: monto
    }

    miApi.post('/moves/add', doc)
      .then(res => navigate("/moves", {replace: true}))
      .catch(err => alert(err))
  };

  useEffect(() => {
    miApi.get('/users/all')
      .then(res => setUsers(res.data.Usuarios))
      .catch(err => console.error("Error: " + err))
  }, [])

  return (
    <div className="main-content">
      <div className="main-header">
        <Link to="/moves">
          <PageHeader color="#ccffcc" icon={icon} name="Transacciones" />
        </Link>
      </div>

      <form onSubmit={handleSubmit} >
      <label>Cliente origen:
        <select required id="origen" onChange={e => setOrigen(e.target.value)} >
          <option key="default" value=""> Selecciona un cliente... </option>
          { listarClientes(users) }
        </select>
      </label>
      <label>Destinatario:
        <select required id="destino" onChange={e => setDestino(e.target.value)} >
          <option key="default" value=""> Selecciona un cliente... </option>
          { listarClientes(users) }
        </select>
      </label>
      <label>Monto: 
        <input required type="number" min={100} onChange={e => setMonto(e.target.value)}></input>
      </label>
      <button type="submit" className="submit-btn big-btn">Registrar</button>
    </form>
    </div>
  )
}

function listarClientes(clientes) {
  return clientes.map((cliente, index) => (
    <option key={index} value={cliente._id}>
      {cliente.nombre}
    </option>
  ))
}

export default AddMovePage