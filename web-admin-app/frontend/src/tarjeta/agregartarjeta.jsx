
import React, { useState } from 'react';
import axios from 'axios';
import { Router, useNavigate } from 'react-router-dom';

function Agregartarjetas() {
    const navigate=useNavigate();
    const [nro, setNro] = useState('');
    const [pin, setPin] = useState('');
    const [fechavto, setFechavto] = useState('');
    const [cvv, setCvv] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
  
      // Aquí puedes enviar los datos del formulario a tu servidor o hacer lo que desees con ellos
      const nuevaTarjeta = {
        nro,
        pin: parseInt(pin),
        fechavto,
        cvv: parseInt(cvv),
      };
  
      console.log('Nueva tarjeta:', nuevaTarjeta);
      axios.post("http://127.0.0.1:2000/api/cards/addcard",
        nuevaTarjeta)
        .then(navigate('/cards',{replace:true}))
      // Limpia los campos después de enviar
      setNro('');
      setPin('');
      setFechavto('');
      setCvv('');
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <label>
          Número de Tarjeta:
          <input
            type="text"
            value={nro}
            onChange={(e) => setNro(e.target.value)}
            required
          />
        </label>
        <br />
  
        <label>
          PIN:
          <input
            type="number"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            required
          />
        </label>
        <br />
  
        <label>
          Fecha de Vencimiento:
          <input
            type="date"
            value={fechavto}
            onChange={(e) => setFechavto(e.target.value)}
            required
          />
        </label>
        <br />
  
        <label>
          CVV:
          <input
            type="number"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            required
          />
        </label>
        <br />
  
        <button type="submit">Agregar Tarjeta</button>
      </form>
    );
}

export default Agregartarjetas;
