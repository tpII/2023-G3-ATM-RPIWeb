import React from "react";

// assets
import { ReactComponent as Chip } from "./chip.svg";
import { ReactComponent as Contactless } from "./contactless.svg";
import { ReactComponent as MastercardLogo } from "./logo_mastercard.svg";
import "./credit_card.css";

const CreditCard = (props) => {
  const cardNumber = props.numero || "X".repeat(16);

  const part1 = cardNumber.slice(0,4)
  const part2 = cardNumber.slice(4,8)
  const part3 = cardNumber.slice(8,12)
  const part4 = cardNumber.slice(12)
  
  const expireMonth = props.fechavto.slice(5,7) || "--"
  const expireYear = props.fechavto.slice(2,4) || "--"

  return (
    <div className="credit-card">
      <div className="inner">
        <div className="front">
          <MastercardLogo className="logo" />
          <Chip className="chip" />
          <Contactless className="contactless" />
          <p className="number">{part1 + " " + part2 + " " + part3 + " " + part4}</p>
          <p className="valid_thru">VALIDO HASTA</p>
          <p className="date_8264">{expireMonth + " / " + expireYear}</p>
          <p className="name">{props.nombre?.toUpperCase() || "--"}</p>
        </div>
      </div>
    </div>
  );
};

export default CreditCard;
