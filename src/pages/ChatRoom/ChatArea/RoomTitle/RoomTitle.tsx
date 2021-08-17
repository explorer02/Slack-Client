import React from "react";

import "./room-title.css";

type RoomTitleProps = {
  roomName: string;
  roomImage: string;
};

export const RoomTitle = (props: RoomTitleProps): JSX.Element => {
  return (
    <div className="room-title">
      <img
        src={props.roomImage}
        alt={props.roomName}
        className="room-title-room-image"
      />
      {props.roomName}
    </div>
  );
};
