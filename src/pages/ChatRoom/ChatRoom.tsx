import React, { useState, useCallback, useContext } from "react";
import "./chat-room.css";

import { CurrentUserContext } from "contexts/CurrentUserContext";
import { useQuery } from "hooks/useQuery";
import { Modal } from "components/Modal/Modal";
import NewChatRoomForm from "components/NewChatRoomForm/NewChatRoomForm";
import { RoomList } from "./RoomList/RoomList";
import { ChatArea } from "./ChatArea/ChatArea";
import { ChatRoomSidebar, CHATROOM_SIDEBAR_ATTRIBUTES } from "./ChatRoomType";

export const ChatRoom = (): JSX.Element => {
  const [chatRoomID, setChatRoomID] = useState<string | undefined>();

  const currentUser = useContext(CurrentUserContext);
  const [showNewChatRoomDialog, setShowNewChatRoomDialog] =
    useState<boolean>(false);

  const handleNewChatRoomDialogToggle = useCallback(
    () => setShowNewChatRoomDialog((c) => !c),
    []
  );
  const handleNewChatRoomCreate = useCallback(() => {
    setShowNewChatRoomDialog(false);
  }, []);

  const chatRoomListMinQuery = useQuery<ChatRoomSidebar[]>(
    `/users/${currentUser?.id}/chats?fields=${CHATROOM_SIDEBAR_ATTRIBUTES.join(
      ","
    )}`,
    {
      enabled: true,
      refetchInterval: 2,
    }
  );

  const chatRoomListMin = chatRoomListMinQuery.data;

  if (chatRoomListMinQuery.status === "error")
    return (
      <p>{chatRoomListMinQuery.error?.message || "Some Error Occured...."}</p>
    );
  return (
    <div className="chat-room">
      <Modal isVisible={showNewChatRoomDialog}>
        <NewChatRoomForm
          onCancel={handleNewChatRoomDialogToggle}
          onSuccess={handleNewChatRoomCreate}
        />
      </Modal>

      <RoomList
        onClickListItem={setChatRoomID}
        onClickNewChatRoom={handleNewChatRoomDialogToggle}
        rooms={chatRoomListMin}
        selectedRoomId={chatRoomID}
      />
      <ChatArea chatRoomID={chatRoomID} key={chatRoomID} />
    </div>
  );
};
