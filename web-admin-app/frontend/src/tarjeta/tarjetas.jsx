import React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"
function Tarjetas() {
  const [cards, setCards] = useState([{}]);
  const navigate=useNavigate();
  useEffect(() => {
    fetch("http://127.0.0.1:2000/api/cards/all")
      .then((res) => res.json())
      .then((data) => setCards(data.tarjetas))
      .catch((err) => console.error("Error: ", err));
  }, [])

  const banear = (id) => {
    axios.patch(`http://127.0.0.1:2000/api/cards/banear/${id}`)
    .then(window.location.replace("/cards"))
  };

  const desbanear = (id) => {
    axios.patch(`http://127.0.0.1:2000/api/cards/desbanear/${id}`)
    .then(window.location.replace("/cards"))
  };

  return (
    <main className="tarjetas">
      
        <Link to="/agregartarjeta">
            <div className="main-buttons">
                <button>Agregar Tarjeta</button>
            </div>
        </Link>
        <div>
            <ul>
            {cards.map((card, index) => (
                <li key={index}>
                    {card.nro}
                    {card.ban}
                    {card.ban ?<button onClick={()=> desbanear(card._id) }> Desbanear</button> : <button onClick={()=> banear(card._id) }> Banear</button> }
                </li>
            ))}
                
            </ul>
        </div>
    </main>
  );
}

export default Tarjetas;
