import React, { useEffect, useState } from 'react';
import miApi from '..'

// assets
import "./SettingsPage.css";
import { useNavigate } from 'react-router-dom';


function Settings() {
  const [minValue, setMinValue] = useState(0.0);
  const [maxValue, setMaxValue] = useState(0.0);
  const [minError, setMinError] = useState();
  const [maxError, setMaxError] = useState();
  const navigate = useNavigate()

  // Carga de limites actuales al ingresar a la página
  useEffect(() => {
    miApi.get('/settings/limites').then(res => {
      setMinValue(res.data.min)
      setMaxValue(res.data.max)
    }).catch(err => alert("No se pueden obtener los límites actuales"))
  }, [])
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Restablecer los mensajes de error
    setMinError('');
    setMaxError('');

    if (minValue <= 0) {
      setMinError('El mínimo debe ser mayor que cero.');
      return;
    }    
    if (maxValue < minValue) {
      setMaxError('El máximo no puede ser menor que el mínimo.');
      return;
    } 

    // Realiza la acción solo si pasó las validaciones
    miApi
      .post('/settings/limites', {min: minValue, max: maxValue})
      .then(res => {
        alert(res.data.message)
        navigate('/', {replace: true})
      })
      .catch(err => alert(err.response?.data?.message))
  };

  return (
    <div className='bodySettings'>
      <form onSubmit={handleSubmit}>
      <h1>Configuración de límites de retiro</h1>
        <label className='labelSettings'>
          Mínimo
          <input className='inputSettings'
            type="number"
            value={minValue}
            required
            onChange={(e) => setMinValue(parseInt(e.target.value))}
          />
        </label>
        {minError && <span className='spanSettings'>{minError}</span>}
        <br />
        <label className='labelSettings'>
          Máximo
          <input className='inputSettings'
            type="number"
            value={maxValue}
            required
            onChange={(e) => setMaxValue(parseInt(e.target.value))}
          />
        </label>
        {maxError && <span className='spanSettings'>{maxError}</span>}
        <br />
        <button className="submit-button" type="submit">Actualizar</button>
      </form>
    </div>
  );
}

export default Settings;
