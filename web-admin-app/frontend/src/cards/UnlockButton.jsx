import React from "react";
import lock_open from "./lock_open.svg";

const UnlockButton = (props) => {
  return (
    <button className="big-btn" id="unban-btn" onClick={props.fn}>
      <img src={lock_open} alt="Desbloquear" />
      <span>Activar</span>
    </button>
  );
};

export default UnlockButton;
