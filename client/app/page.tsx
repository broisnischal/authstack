import { UserProvider, useUser } from "@/context/authcontext";
import { environment } from "@/lib/env";
import { poster } from "@/lib/fetcher";
import { fetcherSSR } from "@/lib/fetcherSSR";
import Image from "next/image";
import Link from "next/link";

const githubUrl = `https://github.com/login/oauth/authorize?client_id=${environment.githubClientId}&redirect_uri=${environment.githubRedirectUrl}?scope=user:email`;

export default async function Home(req: Request, res: Response) {
  const [error, user] = await fetcherSSR<User>(
    req,
    res,
    `${environment.apiURL}/me`
  );

  return (
    <div>
      {user ? (
        <div>
          <h1>Hello, {user.name}</h1>
          {/* <button onClick={onLogout}>Logout</button> */}
        </div>
      ) : (
        <Link href={githubUrl}>Sign IN With Github</Link>
      )}
    </div>
  );
}
