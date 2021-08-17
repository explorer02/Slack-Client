import { MouseEvent } from "react";

import "./button.css";

type ButtonProps = {
  text: string;
  onClick?: (ev: MouseEvent<HTMLButtonElement>) => void;
  type: "button" | "submit" | "reset";
  disabled?: boolean;
  style?: { [k: string]: string };
  selected?: boolean;
};

export const Button = (props: ButtonProps):JSX.Element => {
  return (
    <button
      onClick={props.onClick}
      type={props.type}
      className={`styled-button ${
        props.selected ? "styled-button-selected" : ""
      }`}
      disabled={props.disabled || false}
      style={props.style}
    >
      {props.text}
    </button>
  );
};

Button.defaultProps = {
  onClick: () => {},
  disabled: false,
};
