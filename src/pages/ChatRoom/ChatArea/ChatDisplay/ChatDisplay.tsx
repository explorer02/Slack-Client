import React, { useEffect, useRef } from "react";

import { Message } from "./Message/Message";

import { Message as MessageType } from "types/Message";
import { User } from "types/User";

import "./chat-display.css";
import { DEFAULT_USER } from "constant";

type ChatDisplayProps = {
  messages: MessageType[];
  members: User[];
  onReachingTop: () => void;
};
const findUser = (userList: User[], id: String): User => {
  return userList.find((user) => user && user.id === id) || DEFAULT_USER;
};
export const ChatDisplay = (props: ChatDisplayProps): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null);

  const { onReachingTop, messages } = props;
  useEffect(() => {
    const div = ref.current;
    if (!div) return;
    let signalled = false;
    const scrollEvent = (): void => {
      const pixelFromTop = div.clientHeight - div.scrollHeight - div.scrollTop;
      if (pixelFromTop > -20 && !signalled) {
        onReachingTop();
        signalled = true;
      }
    };
    div.addEventListener("scroll", scrollEvent);
    return () => {
      div.removeEventListener("scroll", scrollEvent);
    };
  }, [onReachingTop, messages.length]);
  return (
    <div className="chat-display" ref={ref}>
      {props.messages
        .slice()
        .reverse()
        .map((message) => (
          <Message
            key={message.id}
            message={message}
            user={findUser(props.members, message.senderId)}
          />
        ))}
    </div>
  );
};
