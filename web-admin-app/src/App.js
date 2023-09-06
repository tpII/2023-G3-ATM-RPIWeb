import { useEffect, useState } from 'react';
import './App.css';
import Banner from './banner/Banner';

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
      <Banner darkMode={darkMode} switchModeFn={switchMode} />
    </div>
  );
}

export default App;
