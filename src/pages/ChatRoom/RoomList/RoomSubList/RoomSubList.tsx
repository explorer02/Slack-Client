import { Button } from "components/Button/Button";
import { ChatRoomSidebar } from "pages/ChatRoom/ChatRoomType";
import React, { MouseEvent, useCallback, useState } from "react";

import "./room-sub-list.css";

type RoomSubListProps = {
  title: string;
  roomEntries: ChatRoomSidebar[];
  onClickListItem: (id: string) => void;
  selectedRoomId: string;
};

const downArrow = "▼";
const rightArrow = "►";

export const RoomSubList = (props: RoomSubListProps): JSX.Element => {
  const [showList, setShowList] = useState(true);

  const handleToggleList = useCallback(() => setShowList((c) => !c), []);

  const handleClick = (ev: MouseEvent<HTMLLIElement>): void => {
    if (ev?.currentTarget?.dataset?.id !== undefined)
      props.onClickListItem(ev.currentTarget.dataset.id);
  };
  return (
    <div className="room-sub-list-container">
      <p className="room-sub-list-title" onClick={handleToggleList}>
        <button className="room-sub-list-expand">
          {showList ? downArrow : rightArrow}
        </button>
        {props.title}
      </p>
      {showList && (
        <ul>
          {props.roomEntries.map((entry) => (
            <li onClick={handleClick} data-id={entry.id} key={entry.id}>
              <Button
                text={entry.name}
                type="button"
                style={{
                  border: "none",
                }}
                selected={props.selectedRoomId === entry.id}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
