import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import miApi from "..";

// assets
import "./cards.css";
import icon from "./../assets/credit_card.svg";

// otros componentes
import PageHeader from "../common/PageHeader";
import AddButton from "../common/AddButton";
import BlockButton from "./BlockButton";
import UnlockButton from "./UnlockButton";
import DeleteButton from "../common/DeleteButton";

function CardListPage(props) {
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
      .patch(`cards/ban/${id}`)
      .then((_) => getAll())
      .catch(err => alert(err.response?.data?.message));
  };

  const desbanear = (id) => {
    miApi
      .patch(`cards/unban/${id}`)
      .then((_) => getAll())
      .catch((err) => alert(err.response?.data?.message));
  };

  const borrar = (id) => {
    miApi
      .delete(`cards/borrar/${id}`)
      .then( _ => {
        alert("Tarjeta eliminada con éxito")
        getAll()
      }).catch(err => alert(err.response?.data?.message))
  }

  const addCardSpaces = (nro) => {
    return (
      nro.slice(0, 4) +
      " " +
      nro.slice(4, 8) +
      " " +
      nro.slice(8, 12) +
      " " +
      nro.slice(12)
    );
  };

  return (
    <main className="main-content">
      <div className="main-header">
        <PageHeader color="#ffcccc" icon={icon} name="Tarjetas" />

        <Link className="add-btn" to="/cards/add">
          <AddButton darkMode={props.darkMode} />
        </Link>
      </div>

      <div className="table-container">
        <table className="cards-table">
          <thead>
            <tr>
              <th>Número</th>
              <th>Estado</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            {cards.map((card, index) => (
              <tr className={index % 2 ? "style1" : "style2"} key={index}>
                <td>{addCardSpaces(card.nro) || " "}</td>

                {card.ban ? (
                  <td className="blocked">Bloqueado</td>
                ) : (
                  <td className="active">Habiltado</td>
                )}

                <td>
                  <div className="td-options">
                    {card.ban ? (
                      <UnlockButton fn={() => desbanear(card._id)} />
                    ) : (
                      <BlockButton fn={() => banear(card._id)} />
                    )}
                    <DeleteButton fn={() => borrar(card._id)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default CardListPage;
