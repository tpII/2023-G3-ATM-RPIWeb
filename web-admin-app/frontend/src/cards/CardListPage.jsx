import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import miApi from "..";

// assets
import "./cards.css";
import icon from "./../assets/credit_card.svg";

// otros componentes
import PageHeader from "../common/PageHeader";

function CardListPage() {
  const [cards, setCards] = useState([]);

  const getAll = () => {
    miApi
      .get("cards/all")
      .then((res) => setCards(res.data.tarjetas))
      .catch((err) => console.error("Error: ", err));
  };

  useEffect(() => {
    getAll();
  }, []);

  const banear = (id) => {
    miApi
      .patch(`cards/banear/${id}`)
      .then((_) => getAll())
      .catch((err) => console.error(err));
  };

  const desbanear = (id) => {
    miApi
      .patch(`cards/desbanear/${id}`)
      .then((_) => getAll())
      .catch((err) => console.error(err));
  };

  return (
    <main className="main-content">
      <div className="main-header">
        <PageHeader color="#ffcccc" icon={icon} name="Tarjetas" />

        <Link className="add-btn" to="/cards/add">
          <div className="main-buttons">
            <button className="big-btn">Agregar</button>
          </div>
        </Link>
      </div>

      <div>
        <ul>
          {cards.map((card, index) => (
            <li key={index}>
              {card.nro}
              {card.ban ? (
                <button onClick={() => desbanear(card._id)}>Desbanear</button>
              ) : (
                <button onClick={() => banear(card._id)}>Banear</button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

export default CardListPage;
