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
import DeleteButton from "../common/DeleteButton";

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

  const borrar = (id) => {
    miApi
      .delete(`moves/delete/${id}`)
      .then((_) => {
        alert("Transacción eliminada con éxito");
        getAll();
      })
      .catch((err) => alert(err.response?.data?.message));
  };

  const printTable = (data) => {
    return (
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Origen</th>
              <th>Destino</th>
              <th>Monto</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr className={index % 2 ? "style1" : "style2"} key={index}>
                <td>{ getDate(item._id) }</td>
                <td>{item.emisorId.nombre}</td>
                <td>{item.receptorId.nombre}</td>
                <td>{"$" + item.monto?.toFixed(2)}</td>
                <td>
                  <div className="td-options">
                    <DeleteButton fn={() => borrar(item._id)} />
                  </div>
                </td>
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
        <PageHeader color="#ccffcc" icon={icon} name="Transacciones" />

        <Link className="add-btn" to="/moves/add">
          <AddButton darkMode={props.darkMode} />
        </Link>
      </div>

      {loading ? <Loading color="lime" /> : moves?.length ? printTable(moves) : <h1>Sin datos</h1> }
    </main>
  );
};

function getDate(id) {
  return new Date(parseInt(id.substring(0,8), 16) * 1000).toString().substring(3,21)

  /*
  return str.replace("Mon","Lunes").replace("Tue","Martes").replace("Wed","Miércoles")
    .replace("Thu","Jueves").replace("Fri","Viernes")
    .replace("Sat","Sábado").replace("Sun", "Domingo") */
}

export default MoveListPage;
