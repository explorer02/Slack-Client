import { ROOM_CHANNEL, ROOM_DM } from "constant";
import { useInput } from "hooks/useInput";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { SelectType } from "./Select/Select";

const rooms: SelectType = {
  [ROOM_DM.id]: ROOM_DM.name,
  [ROOM_CHANNEL.id]: ROOM_CHANNEL.name,
};

type UseMembersReturnType = {
  currentMember: string;
  members: string[];
  currentRoom: string;
  rooms: SelectType;
  roomName: string;
  handleRoomNameChange: (ev: ChangeEvent<HTMLInputElement>) => void;
  removeMember: (id: string) => void;
  memberNames: string[];
  handleMemberChange: (ev: ChangeEvent<HTMLSelectElement>) => void;
  handleRoomChange: (ev: ChangeEvent<HTMLSelectElement>) => void;
};

export const useNewChatRoom = (users: SelectType): UseMembersReturnType => {
  const [members, setMembers] = useState<string[]>([]);

  const [currentMember, handleMemberChange] = useInput("");
  const [currentRoom, handleRoomChange] = useInput(ROOM_DM.id);
  const [roomName, handleRoomNameChange] = useInput("");

  useEffect(() => {
    setMembers((members) => {
      const isMemberThere =
        currentMember === "" || members.includes(currentMember);
      return isMemberThere ? members : [...members, currentMember];
    });
  }, [currentMember]);

  const removeMember = useCallback((id: string) => {
    setMembers((m) => m.filter((el) => el !== id));
  }, []);

  const memberNames = useMemo<string[]>(
    () => members.map((id) => users[id]),
    [members, users]
  );

  return {
    currentMember,
    members,
    currentRoom,
    rooms,
    roomName,
    handleRoomNameChange,
    removeMember,
    memberNames,
    handleMemberChange,
    handleRoomChange,
  };
};
