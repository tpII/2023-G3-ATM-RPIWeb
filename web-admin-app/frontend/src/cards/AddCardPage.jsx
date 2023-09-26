import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './cards.css'

function AddCardPage() {
    const navigate = useNavigate();
    const [nro, setNro] = useState('');
    const [pin, setPin] = useState('');
    const [fechavto, setFechavto] = useState('');
    const [cvv, setCvv] = useState('');
    const [clientes, setClientes] = useState([{}]);
    const [clienteSeleccionado, setClienteSeleccionado] = useState('');

    useEffect(() => {
      // Obtener cantidades desde la database
      fetch("http://127.0.0.1:2000/api/users/all")
        .then((res) => res.json())
        .then((data) => setClientes(data.Usuarios))
        .catch((err) => console.error("Error: ", err));
    }, []);
  
    const handleSubmit = (e) => {
      e.preventDefault();

      // Crear objeto y realizar post request
      const nuevaTarjeta = {
        clienteSeleccionado,
        nro,
        pin: parseInt(pin),
        fechavto,
        cvv: parseInt(cvv)
      };
  
      axios.post("http://127.0.0.1:2000/api/cards/addcard", nuevaTarjeta)
        .then(navigate('/cards',{replace:true}))

      // Limpia los campos después de enviar
      setNro('');
      setPin('');
      setFechavto('');
      setCvv('');
      setClienteSeleccionado('');
    };

    const handleChangeCliente = (e) => {
      setClienteSeleccionado(e.target.value);
    };
  
    return (
      <form onSubmit={handleSubmit} className='main-content'>
        <label>
          Número de Tarjeta:
          <input
            type="text"
            value={nro}
            onChange={(e) => setNro(e.target.value)}
            required
          />
        </label>
  
        <label>
          PIN:
          <input
            type="number"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            required
          />
        </label>
  
        <label>
          Fecha de Vencimiento:
          <input
            type="date"
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
            onChange={(e) => setCvv(e.target.value)}
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
          >
            <option value="">Selecciona un cliente...</option>
            {clientes.map((cliente) => (
              <option key={cliente._id} value={cliente._id}>
                {cliente.nombre}
              </option>
            ))}
          </select>
        </label>

        <button type="submit" className='big-btn submit-btn'>Agregar Tarjeta</button>
      </form>
    );
}

export default AddCardPage;
