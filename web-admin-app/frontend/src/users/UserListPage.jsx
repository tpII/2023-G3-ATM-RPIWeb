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
      <div className="main-header">
        <PageHeader color="#ccccff" name="Usuarios" icon={icon} />

        <Link className="add-btn" to="/users/add">
          <div className="main-buttons">
            <button className="big-btn">Agregar</button>
          </div>
        </Link>
      </div>
    </main>
  );
}

export default UserListPage;
