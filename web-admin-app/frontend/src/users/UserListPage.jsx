import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import miApi from ".."

// assets
import "./styles.css";
import icon from "./../assets/face.svg";

// otros componentes
import PageHeader from "../common/PageHeader";
import AddButton from "../common/AddButton";
import DeleteButton from "../common/DeleteButton";

function UserListPage(props) {
  const [users, setUsers] = useState([])

  const getAllFn = () => {
    miApi.get("/users/all")
      .then(res => setUsers(res.data.Usuarios))
      .catch(err => console.error(err))
  }

  useEffect(() => { getAllFn() }, [])

  const deleteFn = (userId) => {
    miApi.delete(`/users/delete/${userId}`)
      .then( _ => {
        alert("Usuario eliminado con éxito")
        getAllFn()
      }).catch(err => alert(err.response?.data?.message))
  }

  return (
    <main className="main-content">
      <div className="main-header">
        <PageHeader color="#ccccff" name="Usuarios" icon={icon} />

        <Link className="add-btn" to="/users/add">
          <AddButton darkMode={props.darkMode} />
        </Link>
      </div>

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
            {users.map((u, index) => (
              <tr className={index % 2 ? "style1" : "style2"} key={index}>
                <td>{u.nombre}</td>
                {/* Recordatorio: en JS, length ES UN ATRIBUTO, como en Java */}
                <td>{u.tarjetas?.length}</td>
                <td>
                  <div className="td-options">
                    <DeleteButton fn={() => deleteFn(u._id)}/>
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

export default UserListPage;
