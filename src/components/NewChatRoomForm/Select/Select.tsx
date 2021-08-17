import React, { ChangeEvent } from "react";
import "./select.css";

export type SelectType = { [key: string]: string };

type SelectProps = {
  values: SelectType;
  selected: string;
  onChange?: (ev: ChangeEvent<HTMLSelectElement>) => void;
};
export const Select = (props: SelectProps): JSX.Element => {
  return (
    <select
      className="styled-select"
      onChange={props.onChange}
      value={props.selected}
    >
      {Object.keys(props.values).map((key) => (
        <option value={key} key={key}>
          {props.values[key]}
        </option>
      ))}
    </select>
  );
};
