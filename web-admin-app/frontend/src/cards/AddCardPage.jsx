import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import miApi from "..";

// estilos
import "./cards.css";
import icon from "./../assets/credit_card.svg";

// componentes
import CreditCard from "./CreditCard";
import PageHeader from "../common/PageHeader";

function AddCardPage() {
  const navigate = useNavigate();
  const [nro, setNro] = useState("");
  const [pin, setPin] = useState("");
  const [fechavto, setFechavto] = useState("");
  const [cvv, setCvv] = useState("");
  const [clientes, setClientes] = useState([{}]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState("");

  useEffect(() => {
    // Obtener cantidades desde la database
    miApi
      .get("users/all")
      .then((res) => setClientes(res.data.Usuarios))
      .catch((err) => console.error("Error: ", err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Control de parámetros
    if (!clienteSeleccionado) return;
    
    if (nro.length < 16) {
      alert("Número de tarjeta debe tener 16 dígitos")
      return
    }

    if (cvv.length < 3) {
      alert("Código de seguridad (CVV) debe tener 3 dígitos")
      return
    }

    // Crear objeto y realizar post request
    const nuevaTarjeta = {
      clienteSeleccionado,
      nro,
      pin: parseInt(pin),
      fechavto,
      cvv: parseInt(cvv),
    };

    miApi
      .post("cards/addcard", nuevaTarjeta)
      .then(navigate("/cards", { replace: true }))
      .catch((err) => alert("Error al agregar tarjeta - " + err));

    // Limpia los campos después de enviar
    setNro("");
    setPin("");
    setFechavto("");
    setCvv("");
    setClienteSeleccionado("");
  };

  const handleChangeCliente = (e) => {
    setClienteSeleccionado(e.target.value);
  };

  return (
    // Las tarjetas de Mastercard empiezan con 4 y tienen 13-16 digitos
    // Fuente: https://moneytips.com/anatomy-of-a-credit-card
    <div className="main-content">
      <div className="main-header">
        <Link to="/cards">
          <PageHeader color="#ffcccc" icon={icon} name="Tarjetas" />
        </Link>
      </div>

      <CreditCard
        numero={nro}
        fechavto={fechavto}
        nombre={
          clientes.filter((c) => c._id === clienteSeleccionado)[0]?.nombre ||
          "???"
        }
      />

      <form onSubmit={handleSubmit}>
        <label>
          Número de Tarjeta:
          <input
            type="number"
            value={nro}
            onChange={(e) => {
              e.target.value = e.target.value.slice(0, 16);
              setNro(e.target.value);
            }}
            required
          />
        </label>

        <label>
          PIN:
          <input
            type="number"
            value={pin}
            onChange={(e) => {
              e.target.value = e.target.value.slice(0, 4);
              setPin(e.target.value);
            }}
            required
          />
        </label>

        <label>
          Fecha de Vencimiento:
          <input
            type="date"
            min="2023-01-01"
            max="2099-12-31"
            value={fechavto}
            onChange={(e) => setFechavto(e.target.value)}
            required
          />
        </label>

        <label>
          CVV:
          <input
            type="number"
            value={cvv}
            onChange={(e) => {
              e.target.value = e.target.value.slice(0, 3);
              setCvv(e.target.value);
            }}
            required
          />
        </label>

        <label>
          Cliente:
          <select
            id="cliente"
            name="cliente"
            value={clienteSeleccionado}
            onChange={handleChangeCliente}
            required
          >
            <option key="default" value="">
              Selecciona un cliente...
            </option>
            {clientes.map((cliente, index) => (
              <option key={index} value={cliente._id}>
                {cliente.nombre}
              </option>
            ))}
          </select>
        </label>

        <button type="submit" className="big-btn submit-btn">
          Agregar Tarjeta
        </button>
      </form>
    </div>
  );
}

export default AddCardPage;
