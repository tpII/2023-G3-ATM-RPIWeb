import DashboardCard from "./DashboardCard";
import "./HomePage.css";

// assets
import face from "./face.svg";
import credit_card from "./credit_card.svg";
import swap_horiz from "./swap_horiz.svg";

function HomePage() {
  return (
    <main className="home">
      <h1>Dashboard</h1>
      <div className="main-buttons">
        <DashboardCard url="/users" name="Usuarios" icon={face} color="#ccccff" />
        <DashboardCard url="/cards" name="Tarjetas" icon={credit_card} color="#ffcccc" />
        <DashboardCard url="/moves" name="Transacciones" icon={swap_horiz} color="#ccffcc" />
      </div>
    </main>
  );
}

export default HomePage;
