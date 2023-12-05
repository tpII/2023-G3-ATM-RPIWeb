import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import miApi from "..";

// assets
import "./styles.css";
import icon from "./../assets/face.svg";

// otros componentes
import PageHeader from "../common/PageHeader";
import AddButton from "../common/AddButton";
import DeleteButton from "../common/DeleteButton";
import Loading from "../common/Loading";

function UserListPage(props) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllFn = () => {
    miApi
      .get("/users/all")
      .then((res) => {
        setUsers(res.data.Usuarios);
        setTimeout(() => setLoading(false), 200);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    getAllFn();
  }, []);

  const deleteFn = (userId) => {
    miApi
      .delete(`/users/delete/${userId}`)
      .then(res => {
        alert("Usuario eliminado con éxito");
        getAllFn();
      })
      .catch((err) => alert(err.response?.data?.message));
  };

  return (
    <main className="main-content">
      <div className="main-header">
        <PageHeader color="#ccccff" name="Usuarios" icon={icon} />

        <Link className="add-btn" to="/users/add">
          <AddButton darkMode={props.darkMode} />
        </Link>
      </div>

      {loading ? (
        <Loading color="blue" />
      ) : users?.length ? (
        printTable(users, deleteFn)
      ) : (
        <h1>Sin datos</h1>
      )}
    </main>
  );
}

function printTable(data, deleteFn) {
  return (
    <div className="table-container">
      <table className="users-table">
        <thead>
          <tr>
            <th>Nombre y Apellido</th>
            <th>Tarjetas</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((u, index) => (
            <tr className={index % 2 ? "style1" : "style2"} key={index}>
              <td>{u.nombre}</td>
              {/* Recordatorio: en JS, length ES UN ATRIBUTO, como en Java */}
              <td>{u.tarjetas?.length}</td>
              <td>
                <div className="td-options">
                  <DeleteButton fn={() => deleteFn(u._id)} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserListPage;
