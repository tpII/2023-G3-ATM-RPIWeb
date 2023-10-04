import React from "react";
import icon from "./../assets/delete.svg";

const DeleteButton = (props) => {
  return (
    <button className="big-btn" id="delete-btn" onClick={props.fn}>
      <img src={icon} alt="Borrar" />
      <span>Borrar</span>
    </button>
  );
};

export default DeleteButton;
