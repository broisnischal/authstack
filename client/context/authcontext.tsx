"use client";
import { createContext, FC, useContext, useState } from "react";

export interface UserContext {
  user?: User;
  setUser: (user?: User) => void;
}

export const UserContextImpl = createContext<UserContext>(null!);

export function useUser() {
  return useContext(UserContextImpl);
}

interface Props {
  initialUser?: User;
  children: React.ReactNode;
}

export const UserProvider: FC<Props> = ({
  initialUser,
  children,
}): JSX.Element => {
  const [user, setUser] = useState(initialUser);

  return (
    <UserContextImpl.Provider value={{ user, setUser }}>
      {children}
    </UserContextImpl.Provider>
  );
};
