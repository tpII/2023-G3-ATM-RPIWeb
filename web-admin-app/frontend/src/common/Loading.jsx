import React from "react";

const Loading = (props) => {
  return (
    <div className="loader-container">
      <div
        className="spinner"
        style={{
          borderColor: props.color + " transparent " + props.color + " transparent",
        }}
      ></div>
    </div>
  );
};

export default Loading;
