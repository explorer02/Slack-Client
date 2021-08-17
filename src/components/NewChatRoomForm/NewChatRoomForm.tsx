import React, {
  MouseEvent,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { ajaxClient } from "ajaxClient";
import { Button } from "components/Button/Button";
import { CurrentUserContext } from "contexts/CurrentUserContext";
import { useMutation } from "hooks/useMutation";
import { Input } from "components/Input/Input";
import { GrChatOption } from "react-icons/gr";
import { delayTask } from "utils";
import "./new-chatroom-form.css";
import { Select, SelectType } from "./Select/Select";
import { useNewChatRoom } from "./useNewChatRoom";
import { useQuery } from "hooks/useQuery";
import { User, USER_ATTRIBUTES } from "types/User";

import { ROOM_CHANNEL, ROOM_DM, VALIDATION_UNKNOWN_ERROR } from "constant";
import {
  VALIDATION_NO_MEMBER,
  VALIDATION_NO_ROOM_NAME,
  VALIDATION_SELECT_CHANNEL,
  VALIDATION_SELECT_SOMEONE_ELSE,
  VALIDATION_SUCCESS,
} from "./constant";

type NewChatRoomFormProps = {
  onSuccess: () => void;
  onCancel: () => void;
};

const NewChatRoomForm = (props: NewChatRoomFormProps): JSX.Element => {
  const usersQuery = useQuery<User[]>(
    `/users?fields=${USER_ATTRIBUTES.join(",")}`
  );
  const users: SelectType = useMemo(() => {
    const users: SelectType = { "": "Select" };
    (usersQuery.data || []).forEach((user) => {
      users[user.id] = user.name;
    });
    return users;
  }, [usersQuery.data]);

  const chatRoomState = useNewChatRoom(users);
  const currentUser = useContext(CurrentUserContext);

  const handleMemberRemove = (ev: MouseEvent<HTMLSpanElement>): void => {
    const id = (ev.target as HTMLSpanElement).dataset.id;
    chatRoomState.removeMember(id || "");
  };

  const [validationMessage, setValidationMessage] = useState<string>("");

  const createChatRoom = useCallback(
    (id: string, members: string[], type: string): Promise<any> =>
      ajaxClient.post("/chats", {
        chatRoom: {
          id,
          members,
          type,
        },
      }),
    []
  );

  const successHandler = useCallback(() => {
    delayTask(props.onSuccess, 0.3);
  }, [props.onSuccess]);

  const {
    status: mutationStatus,
    reset: mutationReset,
    mutate,
    error: mutationError,
  } = useMutation(createChatRoom, { onSuccess: successHandler });

  const handleOk = useCallback(() => {
    mutationReset();
    if (
      chatRoomState.currentRoom === ROOM_CHANNEL.id &&
      chatRoomState.roomName.trim().length === 0
    )
      return setValidationMessage(VALIDATION_NO_ROOM_NAME);
    if (chatRoomState.members.length === 0)
      return setValidationMessage(VALIDATION_NO_MEMBER);
    if (
      chatRoomState.members.length > 1 &&
      chatRoomState.currentRoom === ROOM_DM.id
    )
      return setValidationMessage(VALIDATION_SELECT_CHANNEL);
    if (currentUser !== undefined) {
      let members = chatRoomState.members.filter((m) => m !== currentUser.id);

      if (members.length === 0) {
        return setValidationMessage(VALIDATION_SELECT_SOMEONE_ELSE);
      }
      members = members.concat(currentUser.id).sort();
      const type = chatRoomState.currentRoom;
      const id =
        type === ROOM_DM.id ? members.join("_") : chatRoomState.roomName;
      mutate(id, members, type);
      setValidationMessage("");
    }
  }, [
    chatRoomState.currentRoom,
    chatRoomState.roomName,
    chatRoomState.members,
    currentUser,
    mutate,
    mutationReset,
  ]);

  let status = "";
  if (mutationStatus === "loading") status = "Loading...";
  else if (mutationStatus === "error")
    status = mutationError?.message || VALIDATION_UNKNOWN_ERROR;
  else if (mutationStatus === "success") {
    status = VALIDATION_SUCCESS;
  }

  return (
    <div className="new-chatroom-form-container">
      <div className="new-chatroom-form-title">
        <GrChatOption className="new-chatroom-form-title-icon" />
        New Chat Room
      </div>
      <Select
        values={users}
        selected={chatRoomState.currentMember}
        onChange={chatRoomState.handleMemberChange}
      />
      <Select
        values={chatRoomState.rooms}
        selected={chatRoomState.currentRoom}
        onChange={chatRoomState.handleRoomChange}
      />
      {chatRoomState.currentRoom === ROOM_CHANNEL.id && (
        <Input
          type="text"
          value={chatRoomState.roomName}
          onChange={chatRoomState.handleRoomNameChange}
          placeholder="Channel Name"
          style={{ maxWidth: "50%", padding: "5px 10px", fontSize: "large" }}
        />
      )}
      <div className="new-chatroom-form-participants">
        Members:
        {chatRoomState.memberNames.map((m, i) => (
          <span
            className="new-chatroom-form"
            key={chatRoomState.members[i]}
            data-id={chatRoomState.members[i]}
            onClick={handleMemberRemove}
          >
            {m}
          </span>
        ))}
      </div>
      <div className="new-chatroom-form-controls">
        <Button text="Cancel" type="button" onClick={props.onCancel} />
        <Button text="OK" type="button" onClick={handleOk} />
      </div>
      {validationMessage && (
        <p className="new-chatroom-form-status">{validationMessage}</p>
      )}
      {status && <p className="new-chatroom-form-status">{status}</p>}
    </div>
  );
};

export default NewChatRoomForm;
