import React, { useMemo } from "react";

import { RoomSubList } from "./RoomSubList/RoomSubList";

import "./room-list.css";

import { Button } from "components/Button/Button";
import { ROOM_CHANNEL, ROOM_DM } from "constant";
import { ChatRoomSidebar } from "../ChatRoomType";

type RoomListProps = {
  onClickListItem: (id: string) => void;
  onClickNewChatRoom: () => void;
  rooms: ChatRoomSidebar[];
  selectedRoomId: string;
};

export const RoomList = (props: RoomListProps): JSX.Element => {
  const dms = useMemo(
    () => props.rooms.filter((room) => room.type === ROOM_DM.id),
    [props.rooms]
  );
  const channels = useMemo(
    () => props.rooms.filter((room) => room.type === ROOM_CHANNEL.id),
    [props.rooms]
  );

  return (
    <div className="room-list">
      <Button
        onClick={props.onClickNewChatRoom}
        type="button"
        text="New Chat"
      />

      <RoomSubList
        roomEntries={channels}
        title="Channels"
        onClickListItem={props.onClickListItem}
        selectedRoomId={props.selectedRoomId}
      />
      <RoomSubList
        roomEntries={dms}
        title="Direct Messages"
        onClickListItem={props.onClickListItem}
        selectedRoomId={props.selectedRoomId}
      />
    </div>
  );
};

RoomList.defaultProps = {
  rooms: [],
  onClickListItem: (id: string) => {},
  onClickNewChatRoom: () => {},
  selectedRoomId: "",
};
