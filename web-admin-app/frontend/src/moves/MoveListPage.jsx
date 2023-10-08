import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import miApi from "..";

// assets
import icon from "./../assets/swap_horiz.svg";
import "./styles.css";

// otros componentes
import PageHeader from "../common/PageHeader";
import AddButton from "../common/AddButton";
import Loading from "../common/Loading";

const MoveListPage = (props) => {
  const [loading, setLoading] = useState(true);
  const [moves, setMoves] = useState([]);

  const getAll = () => {
    miApi
      .get("moves/all")
      .then((res) => {
        setMoves(res.data.movimientos);
        setTimeout(() => setLoading(false), 200);
      })
      .catch((err) => {
        console.error("Error: ", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    getAll();
  }, []);

  return (
    <main className="main-content">
      <div className="main-header">
        <PageHeader color="#ccffcc" icon={icon} name="Transacciones" />

        <Link className="add-btn" to="/moves/add">
          <AddButton darkMode={props.darkMode} />
        </Link>
      </div>

      {loading ? <Loading color="lime" /> : moves?.length ? printTable(moves) : <h1>Sin datos</h1> }
    </main>
  );
};

function printTable(data) {
  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Origen</th>
            <th>Destino</th>
            <th>Monto</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr className={index % 2 ? "style1" : "style2"} key={index}>
              <td>{item.origen}</td>
              <td>{item.destino}</td>
              <td>{item.monto}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MoveListPage;
