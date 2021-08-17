import { ChangeEvent } from "react";

import "./input.css";

type InputProps = {
  Icon?: JSX.Element;
  type: string;
  placeholder?: string;
  value: string;
  onChange: (ev: ChangeEvent<HTMLInputElement>) => void;
  minLength?: number;
  style?: { [key: string]: string };
};

export const Input = (props: InputProps): JSX.Element => {
  return (
    <div className="styled-input-container" style={props.style}>
      {props.Icon}
      <input
        className="styled-input"
        type={props.type}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
        minLength={props.minLength}
        required
      ></input>
    </div>
  );
};
