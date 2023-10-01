"use client";

import { useUser } from "@/context/authcontext";
import { environment } from "@/lib/env";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetcher, poster } from "@/lib/fetcher";

export default function Page() {
  const { setUser, user } = useUser();
  const router = useRouter();

  const getMe = async () => {
    const [error, user] = await fetcher<User>(`${environment.apiURL}/me`);
    if (!error && user) setUser(user);
    else router.push("/");
  };

  useEffect(() => {
    if (!user) getMe();
  });

  const onLogout = async () => {
    await poster(`${environment.apiURL}/logout`);
    router.push("/");
  };

  return (
    <div>
      <h1>Client side</h1>

      {user ? <h1>{user.name}</h1> : <h1>Not logged in</h1>}
      <button onClick={onLogout}>Logout</button>
    </div>
  );
}
