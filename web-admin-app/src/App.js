import { useEffect, useState } from 'react';
import './App.css';
import Banner from './banner/Banner';

// rutas
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import HomePage from './home/HomePage';

function App() {

  // Estados
  const [darkMode, setDarkMode] = useState(true)

  // Función para alternancia de tema
  const switchMode = () => setDarkMode(!darkMode);

  // Modificación de estilo al cambiar estado
  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? '#282c34' : '#FFFFFF';
  }, [darkMode])

  return (
    <div className="App">

      {/* Todos los componentes que usen Link deben
      estar contenidos en BrowserRouter */}
      <BrowserRouter>
        <Banner darkMode={darkMode} switchModeFn={switchMode} />

        <Routes>
          <Route path='/' element={<HomePage/>} />
        </Routes>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
