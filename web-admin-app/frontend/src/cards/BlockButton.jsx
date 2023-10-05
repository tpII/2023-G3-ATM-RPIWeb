import React from "react";
import block from "./block.svg";

const BlockButton = (props) => {
  return (
    <button className="big-btn" id="ban-btn" onClick={props.fn}>
      <img src={block} alt="Banear" />
      <span>Banear</span>
    </button>
  );
};

export default BlockButton;
