import React from "react";
import { Link } from "react-router-dom";

const DashboardCard = (props) => {
  return (
    <Link to={props.url}>
      <div className="card-icon" style={{backgroundColor: props.color}}>
        <img src={props.icon} alt="Icono" />
      </div>
      <div className="card-info">
        <span className="card-quantity">0</span>
        <span className="card-name">{props.name}</span>
      </div>
    </Link>
  );
};

export default DashboardCard;
