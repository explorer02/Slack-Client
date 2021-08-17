import React from "react";
import ReactDOM from "react-dom";

import "./modal.css";

type ModalProps = {
  children: JSX.Element;
  isVisible: boolean;
};

export const Modal = (props: ModalProps): JSX.Element => {
  let portalRoot = document.querySelector("#portal-root");
  if (portalRoot === null) {
    portalRoot = document.createElement("div");
    portalRoot.setAttribute("id", "portal-root");
    document.body.append(portalRoot);
  }

  return ReactDOM.createPortal(
    <div className={`backdrop ` + (props.isVisible ? "" : "backdrop-hide")}>
      {props.isVisible && <div className="modal">{props.children}</div>}
    </div>,
    portalRoot
  );
};
