import { useEffect, useState } from 'react';
import './App.css';
import Banner from './banner/Banner';

// rutas
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import HomePage from './home/HomePage';
import Tarjetas from './tarjeta/tarjetas';
import Agregartarjetas from './tarjeta/agregartarjeta';

function App() {

  // Estados
  const [darkMode, setDarkMode] = useState(true)

  // Función para alternancia de tema
  const switchMode = () => setDarkMode(!darkMode);

  // Modificación de estilo al cambiar estado
  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? '#282c34' : '#FFFFFF';

    if (darkMode){
      document.documentElement.style.setProperty('--dark', '#282c34');
      document.documentElement.style.setProperty('--light', '#FFFFFF');
      document.documentElement.style.setProperty('--gray', 'gray');
    } else {
      document.documentElement.style.setProperty('--light', '#282c34');
      document.documentElement.style.setProperty('--dark', '#FFFFFF');
      document.documentElement.style.setProperty('--gray', '#d9d4d4');
    }
  }, [darkMode])

  return (
    <div className="App">

      {/* Todos los componentes que usen Link deben
      estar contenidos en BrowserRouter */}
      <BrowserRouter>
        <Banner darkMode={darkMode} switchModeFn={switchMode} />

        <Routes>
          <Route path='/' element={<HomePage/>} />
          <Route path='/cards' element={<Tarjetas/>} />
          <Route path='/agregartarjeta' element={<Agregartarjetas/>} />
        </Routes>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
