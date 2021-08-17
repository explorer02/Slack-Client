import { User } from "types/User";

export const DEFAULT_AVATAR =
  "https://static.vecteezy.com/system/resources/previews/000/439/863/non_2x/vector-users-icon.jpg";

export const DEFAULT_USER: User = {
  id: "12345",
  name: "UNKNOWN_USER",
  profilePicture: DEFAULT_AVATAR,
};

export const ROOM_DM: { id: "dm"; name: string } = {
  id: "dm",
  name: "Direct Message",
};
export const ROOM_CHANNEL: { id: "channel"; name: string } = {
  id: "channel",
  name: "Channel",
};

export const VALIDATION_UNKNOWN_ERROR = "Unknown Error occured...";
