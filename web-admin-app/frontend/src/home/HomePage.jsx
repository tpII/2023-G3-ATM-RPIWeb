import DashboardCard from "./DashboardCard";
import "./HomePage.css";

// assets
import face from "./face.svg";
import credit_card from "./credit_card.svg";
import swap_horiz from "./swap_horiz.svg";
import { useEffect, useState } from "react";

function HomePage() {
  const [userCount, setUserCount] = useState(0)

  useEffect(() => {
    // Obtener cantidades desde la database
    fetch("http://127.0.0.1:2000/api/users/count")
      .then(res => res.json())
      .then((data) => setUserCount(data.count))
      .catch((err) => console.error("Error: ", err));
  }, []);

  return (
    <main className="home">
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
          count={0}
        />

        <DashboardCard
          url="/moves"
          name="Transacciones"
          icon={swap_horiz}
          color="#ccffcc"
          count={0}
        />

      </div>
    </main>
  );
}

export default HomePage;
