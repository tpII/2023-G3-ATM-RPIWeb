import React, { useEffect, useState } from "react";
import miApi from "..";

// assets
import icon from "./../assets/swap_horiz.svg";
import "./styles.css";

// otros componentes
import PageHeader from "../common/PageHeader";
import Loading from "../common/Loading";

const MoveListPage = () => {
  const [loading, setLoading] = useState(true);
  const [moves, setMoves] = useState([]);

  useEffect(() => {
    miApi.get("moves/all")
      .then((res) => {
        setMoves(res.data.movimientos);
        setTimeout(() => setLoading(false), 200);
      })
      .catch((err) => setLoading(false));
  }, []);

  const printTable = (data) => {
    return (
      <div className="table-container">
        <table className="moves-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Origen</th>
              <th>Destino</th>
              <th>Monto</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr className={index % 2 ? "style1" : "style2"} key={index}>
                <td>{ getDate(item._id) }</td>
                <td>{item.emisorId.nombre}</td>
                <td>{item.receptorId.nombre}</td>
                <td>{"$" + item.monto?.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <main className="main-content">
      <div className="main-header">
        <PageHeader color="#ccffcc" icon={icon} name="Transferencias" />
      </div>

      {loading ? <Loading color="lime" /> : moves?.length ? printTable(moves) : <h1>Sin datos</h1> }
    </main>
  );
};

function getDate(id) {
  return new Date(parseInt(id.substring(0,8), 16) * 1000).toString().substring(3,21)
}

export default MoveListPage;
