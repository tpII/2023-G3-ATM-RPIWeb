import React from "react";
import { Link } from "react-router-dom";

// assets
import "./styles.css";
import icon from "./../assets/face.svg";

// otros componentes
import PageHeader from "../common/PageHeader";
import AddButton from "../common/AddButton";

function UserListPage(props) {
  return (
    <main className="main-content">
      <div className="main-header">
        <PageHeader color="#ccccff" name="Usuarios" icon={icon} />

        <Link className="add-btn" to="/users/add">
          <AddButton darkMode={props.darkMode} />
        </Link>
      </div>
    </main>
  );
}

export default UserListPage;
