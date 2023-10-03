import React from "react";

const PageHeader = (props) => {
  return (
    <div className="page-header">
      <div className="card-icon" style={{ backgroundColor: props.color }}>
        <img src={props.icon} alt="Icono" />
      </div>
      <h1 className="card-name">{props.name}</h1>
    </div>
  );
};

export default PageHeader;
