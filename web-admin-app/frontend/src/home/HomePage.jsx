import DashboardCard from "./DashboardCard";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// assets
import face from "./face.svg";
import credit_card from "./credit_card.svg";
import swap_horiz from "./swap_horiz.svg";
import edit from "./edit.svg";
import settings from "./settings.svg";
import "./HomePage.css";

function HomePage() {
  const [cash, setCash] = useState(0.00);
  const [userCount, setUserCount] = useState(0);
  const [cardCount, setCardCount] = useState(0);
  const [moveCount, setMoveCount] = useState(0);

  useEffect(() => {
    // Obtener cantidades desde la database
    fetch("http://127.0.0.1:2000/api/users/count")
      .then(res => res.json())
      .then(data => setUserCount(data.count))
      .catch(err => console.error("No se puede consultar clientes", err));

    fetch("http://127.0.0.1:2000/api/cards/count")
      .then(res => res.json())
      .then(data => setCardCount(data.count))
      .catch(err => console.error("No se puede consultar tarjetas", err));

    fetch("http://127.0.0.1:2000/api/moves/count")
      .then(res => res.json())
      .then(data => setMoveCount(data.count))
      .catch(err => console.error("No se puede consultar movimientos", err));

    fetch("http://127.0.0.1:2000/api/cash")
      .then(res => res.json())
      .then(data => setCash(data.value))
      .catch(err => console.error("No se puede consultar el efectivo", err))
  }, []);

  return (
    <main className="home">
      <h1 id="titulo-cajero">Efectivo en cajero</h1>
      <div className="cash">
        <div className="circular-btn edit">
          <img src={edit} alt="Editar" />
        </div>

        {/* El método toFixed(n) permite mostrar n decimales */}
        <h1>{"$".concat(cash ? cash.toFixed(2) : "0.00")}</h1>

        <Link to="/settings" className="circular-btn settings">
          <img src={settings} alt="Opciones" />
        </Link>
      </div>

      <h1>Dashboard</h1>
      <div className="main-buttons">
        <DashboardCard
          url="/users"
          name="Usuarios"
          icon={face}
          color="#ccccff"
          count={userCount}
        />

        <DashboardCard
          url="/cards"
          name="Tarjetas"
          icon={credit_card}
          color="#ffcccc"
          count={cardCount}
        />

        <DashboardCard
          url="/moves"
          name="Transacciones"
          icon={swap_horiz}
          color="#ccffcc"
          count={moveCount}
        />
      </div>
    </main>
  );
}

export default HomePage;
