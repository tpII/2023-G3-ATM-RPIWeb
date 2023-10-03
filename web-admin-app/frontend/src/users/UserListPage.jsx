import React from "react";
import { Link } from "react-router-dom";

// assets
import "./styles.css";
import icon from "./../assets/face.svg";

// otros componentes
import PageHeader from "../common/PageHeader";

function UserListPage() {
  return (
    <main className="main-content">
      <PageHeader color="#ccccff" name="Usuarios" icon={icon} />

      <Link to="/users/add">
        <div className="main-buttons">
          <button className="big-btn">Agregar Usuario</button>
        </div>
      </Link>
    </main>
  );
}

export default UserListPage;
