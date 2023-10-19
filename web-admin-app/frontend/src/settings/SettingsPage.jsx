import React, { useState } from 'react';

//assets
import "./SettingsPage.css";

//valores por defecto
const minP = 1000;
const maxP = 50000;
 
function Settings() {
  const [minValue, setMinValue] = useState(minP);
  const [maxValue, setMaxValue] = useState(maxP);
  const [minError, setMinError] = useState();
  const [maxError, setMaxError] = useState();

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
    // Realiza la acción solo si paso las validaciones
    console.log(`Mínimo: ${minValue}, Máximo: ${maxValue}`);//Persistir datos en algun lado
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
