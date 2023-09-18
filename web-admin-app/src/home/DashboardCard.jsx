import React from "react";
import { Link } from "react-router-dom";

const DashboardCard = (props) => {
  return (
    <Link to={props.url}>
      <img src={props.icon} alt="Icono" width="60px" />
      <div className="card-info">
        <span className="card-quantity">0</span>
        <span className="card-name">{props.name}</span>
      </div>
    </Link>
  );
};

export default DashboardCard;
