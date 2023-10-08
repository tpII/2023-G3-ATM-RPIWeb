import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// componentes
import Banner from "./banner/Banner";
import HomePage from "./home/HomePage";
import CardListPage from "./cards/CardListPage";
import AddCardPage from "./cards/AddCardPage";
import UserListPage from "./users/UserListPage";
import AddUserPage from "./users/AddUserPage";
import MoveListPage from "./moves/MoveListPage";

// estilos
import "./App.css";
import Page404 from "./error/Page404";
import SettingsPage from "./settings/SettingsPage";

function App() {
  // Estados
  const [darkMode, setDarkMode] = useState(true);

  // Función para alternancia de tema
  const switchMode = () => setDarkMode(!darkMode);

  // Modificación de estilo al cambiar estado
  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? "#282c34" : "#FFFFFF";

    if (darkMode) {
      document.documentElement.style.setProperty("--dark", "#282c34");
      document.documentElement.style.setProperty("--light", "#FFFFFF");
      document.documentElement.style.setProperty("--gray", "gray");
    } else {
      document.documentElement.style.setProperty("--light", "#282c34");
      document.documentElement.style.setProperty("--dark", "#FFFFFF");
      document.documentElement.style.setProperty("--gray", "#d9d4d4");
    }
  }, [darkMode]);

  return (
    <div className="App">
      {/* Todos los componentes que usen Link deben
      estar contenidos en BrowserRouter */}
      <BrowserRouter>
        <Banner darkMode={darkMode} switchModeFn={switchMode} />

        <Routes>
          {/* Secciones principales */}
          <Route path="/" element={<HomePage />} />
          <Route path="/users" element={<UserListPage darkMode={darkMode} />} />
          <Route path="/cards" element={<CardListPage darkMode={darkMode} />} />
          <Route path="/moves" element={<MoveListPage darkMode={darkMode} />} />

          {/* Formularios */}
          <Route path="/users/add" element={<AddUserPage />} />
          <Route path="/cards/add" element={<AddCardPage />} />

          {/* Otros */}
          <Route path="/settings" element={<SettingsPage/>} />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
