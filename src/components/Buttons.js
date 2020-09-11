import React from "react";

const Buttons = ({ data }) => {
  const buttonRender = data.map((el) => (
    <button
      key={el.class + el.id}
      className={el.class}
      id={el.id}
      onClick={el.onClick}
    >
      {el.text}
    </button>
  ));

  return <div className="button-container">{buttonRender}</div>;
};

export default Buttons;
