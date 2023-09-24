import React from "react";
import { Link } from "react-router-dom";
function Tarjetas() {

  return (
    <main className="tarjetas">
      
        <Link to="/agregartarjeta">
            <div className="main-buttons">
                <button>Agregar Tarjeta</button>
            </div>
        </Link>
      
    </main>
  );
}

export default Tarjetas;
