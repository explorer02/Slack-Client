import React, { useCallback, useContext, useState } from "react";

import { ChatCompose } from "./ChatCompose/ChatCompose";
import { ChatDisplay } from "./ChatDisplay/ChatDisplay";
import { RoomTitle } from "./RoomTitle/RoomTitle";

import "./chat-area.css";
import { CurrentUserContext } from "contexts/CurrentUserContext";
import { useQuery } from "hooks/useQuery";
import { User, USER_ATTRIBUTES } from "types/User";
import { Message as MessageType } from "types/Message";
import { ajaxClient } from "ajaxClient";
import { useMutation } from "hooks/useMutation";
import { DEFAULT_AVATAR, ROOM_DM } from "constant";
import { ChatRoomMain, CHATROOM_MAIN_ATTRIBUTES } from "../ChatRoomType";

type ChatAreaProps = {
  chatRoomID: string | undefined;
};

const MESSAGE_COUNT = 15;

export const ChatArea = (props: ChatAreaProps): JSX.Element => {
  const currentUser = useContext(CurrentUserContext);

  const [allMessages, setAllMessages] = useState<MessageType[]>([]);

  const successhandlerLatestMessages = useCallback(
    (data: ChatRoomMain) => {
      if (data.messages.length === 0) return;
      if (allMessages.length === 0) {
        return setAllMessages(data.messages.slice());
      }
      const id = allMessages[allMessages.length - 1].id;
      const index = data.messages.findIndex((message) => message.id === id);
      if (index === data.messages.length - 1) return;
      setAllMessages(allMessages.concat(data.messages.slice(index + 1)));
    },
    [allMessages]
  );

  const { data: chatRoom } = useQuery<ChatRoomMain>(
    `/chats/${props.chatRoomID}?fields=${CHATROOM_MAIN_ATTRIBUTES.join(
      ","
    )}&count=${MESSAGE_COUNT}`,
    {
      enabled: props.chatRoomID !== undefined,
      refetchInterval: 2,
      onSuccess: successhandlerLatestMessages,
    }
  );

  const [isAtTop, setIsAtTop] = useState<boolean>(false);

  const handleReachingTop = useCallback(() => {
    setIsAtTop(true);
  }, []);

  const successHandlerPreviousMessages = useCallback((data: ChatRoomMain) => {
    setIsAtTop(false);
    setAllMessages((m) => data.messages.concat(m));
  }, []);

  useQuery<ChatRoomMain>(
    `/chats/${props.chatRoomID}?fields=${CHATROOM_MAIN_ATTRIBUTES.join(
      ","
    )}&count=${MESSAGE_COUNT}&lastId=${allMessages[0]?.id || ""}`,
    {
      enabled: props.chatRoomID !== undefined && isAtTop,
      onSuccess: successHandlerPreviousMessages,
    }
  );

  const { data: members } = useQuery<User[]>(
    `/chats/${props.chatRoomID}/users?fields=${USER_ATTRIBUTES.join(",")}`,
    {
      enabled: chatRoom !== undefined,
    }
  );

  const sendMessage = useCallback(
    (message: MessageType) =>
      ajaxClient.post(`/chats/${props.chatRoomID}/message`, { message }),
    [props.chatRoomID]
  );

  const messageMutation = useMutation(sendMessage);
  const { mutate: messageMutate } = messageMutation;

  const handleMessageSend = useCallback(
    (text: string) => {
      if (currentUser !== undefined) {
        const newMsg: MessageType = {
          id: "",
          timestamp: Date.now(),
          text,
          senderId: currentUser.id,
        };
        messageMutate(newMsg);
      }
    },
    [currentUser, messageMutate]
  );

  let roomName: string = "Please Select a ChatRoom",
    roomImage: string = DEFAULT_AVATAR,
    memberList: User[] = [],
    messageList: MessageType[] = [];
  if (chatRoom !== undefined) {
    roomName = chatRoom.id;
    roomImage = chatRoom.roomImage;
    if (members !== undefined) {
      messageList = allMessages;
      memberList = members;
      if (chatRoom.type === ROOM_DM.id) {
        const otherMember =
          members[0].id !== currentUser?.id ? members[0] : members[1];
        roomName = otherMember.name;
      }
    }
  }

  return (
    <div className="chat-area">
      <RoomTitle roomName={roomName} roomImage={roomImage} />
      <ChatDisplay
        messages={messageList}
        members={memberList}
        onReachingTop={handleReachingTop}
      />
      <ChatCompose
        onMessageSend={handleMessageSend}
        disabled={
          chatRoom === undefined || messageMutation.status === "loading"
        }
      />
    </div>
  );
};
