import { ROOM_CHANNEL, ROOM_DM } from "constant";
import { Message } from "types/Message";
import { User } from "types/User";

export type ChatRoomSidebar = {
  id: string;
  name: string;
  type: typeof ROOM_DM.id | typeof ROOM_CHANNEL.id;
};

export const CHATROOM_SIDEBAR_ATTRIBUTES = ["id", "type", "name"];

export type ChatRoomMain = {
  id: string;
  name: string;
  type: typeof ROOM_DM.id | typeof ROOM_CHANNEL.id;
  roomImage: string;
  members: User[];
  messages: Message[];
};

export const CHATROOM_MAIN_ATTRIBUTES = [
  "id",
  "type",
  "name",
  "roomImage",
  "members",
  "messages",
];
