import React from "react";
import icon from "./../common/edit_white.svg";

const EditButton = (props) => {
  return (
    <button className="big-btn" id="edit-btn" onClick={props.fn}>
      <img src={icon} alt="Editar" />
      <span>Editar</span>
    </button>
  );
};

export default EditButton;
