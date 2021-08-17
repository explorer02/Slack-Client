import { Button } from "components/Button/Button";
import React, { FormEvent, KeyboardEvent, useRef } from "react";

import "./chat-compose.css";

type ChatComposeProps = {
  onMessageSend: (text: string) => void;
  disabled: boolean;
};

export const ChatCompose = (props: ChatComposeProps): JSX.Element => {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const sendMessage = (): void => {
    const msg = inputRef.current?.value.trim() || "";
    if (msg.length > 0) {
      props.onMessageSend(msg);
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.value = "";
      }
    }
  };

  const handleSubmit = (ev: FormEvent):void => {
    ev.preventDefault();
    sendMessage();
  };
  const onKeyDown = (ev: KeyboardEvent<HTMLTextAreaElement>):void => {
    if (ev.shiftKey && ev.key === "Enter") {
      ev.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-compose">
      <form className="chat-compose-form" onSubmit={handleSubmit}>
        <textarea
          className="chat-compose-form-input"
          rows={3}
          placeholder="Message..."
          onKeyDown={onKeyDown}
          ref={inputRef}
        ></textarea>
        <Button type="submit" text="Send" disabled={props.disabled} />
      </form>
    </div>
  );
};
