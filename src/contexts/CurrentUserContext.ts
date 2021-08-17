import React from "react";
import { User } from "types/User";

export const CurrentUserContext = React.createContext<User | undefined>(
  undefined
);
