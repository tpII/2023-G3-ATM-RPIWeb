import DashboardCard from "./DashboardCard";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import io from 'socket.io-client'
import miApi from "..";

// assets
import face from "./../assets/face.svg";
import credit_card from "./../assets/credit_card.svg";
import swap_horiz from "./../assets/swap_horiz.svg";
import edit from "./edit.svg";
import settings from "./settings.svg";
import "./HomePage.css";

const socket = io.connect('http://localhost:2000');

function HomePage() {
  const [cash, setCash] = useState(0.00);
  const [userCount, setUserCount] = useState(0);
  const [cardCount, setCardCount] = useState(0);
  const [moveCount, setMoveCount] = useState(0);

  useEffect(() => {
    // Obtener cantidades desde la database
    miApi.get("users/count")
      .then(res => setUserCount(res.data.count))
      .catch(err => console.error("No se puede consultar clientes", err));

    miApi.get("cards/count")
      .then(res => setCardCount(res.data.count))
      .catch(err => console.error("No se puede consultar tarjetas", err));

    miApi.get("moves/count")
      .then(res => setMoveCount(res.data.count))
      .catch(err => console.error("No se puede consultar movimientos", err));

    // Obtener efectivo desde suscripción mqtt
    miApi.get("cash")
      .then(res => setCash(res.data.value))
      .catch(err => console.error("No se puede consultar el efectivo", err))
      
    socket.on('cash', data => {
      console.log('Efectivo recibido')
      setCash(data.value)
    })

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
