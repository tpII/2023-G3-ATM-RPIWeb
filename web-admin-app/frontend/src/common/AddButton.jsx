import React from "react";

// assets
import {ReactComponent as AddIcon} from "./../assets/add.svg"

const AddButton = (props) => {
  return (
    <div className="main-buttons">
      <button className="big-btn">
        <AddIcon fill={props.darkMode ? "white" : "black"} />
        <span>Agregar</span>
      </button>
    </div>
  );
};

export default AddButton;
