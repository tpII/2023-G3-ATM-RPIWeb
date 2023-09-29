import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Axios from "axios"

// estilos
import "./cards.css"

function CardListPage() {
  const [cards, setCards] = useState([]);

  const getAll = () => {
    Axios.get("http://127.0.0.1:2000/api/cards/all")
      .then(res => setCards(res.data.tarjetas))
      .catch(err => console.error("Error: ", err));
  }

  useEffect(() => { getAll() }, [])

  const banear = (id) => {
    Axios.patch(`http://127.0.0.1:2000/api/cards/banear/${id}`)
      .then(_ => getAll())
      .catch(err => console.error(err))
  };

  const desbanear = (id) => {
    Axios.patch(`http://127.0.0.1:2000/api/cards/desbanear/${id}`)
      .then(_ => getAll())
      .catch(err => console.error(err))
  };

  return (
    <main className="main-content">

        <Link to="/cards/add">
            <div className="main-buttons">
                <button className="big-btn">Agregar Tarjeta</button>
            </div>
        </Link>

        <div>
            <ul>
            {cards.map((card, index) => (
                <li key={index}>
                    {card.nro}
                    {card.ban ? 
                      <button onClick={ ()=> desbanear(card._id) }>Desbanear</button> : 
                      <button onClick={ ()=> banear(card._id) }>Banear</button> 
                    }
                </li>
            ))}         
            </ul>
        </div>

    </main>
  );
}

export default CardListPage;
