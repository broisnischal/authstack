import { environment } from "@/lib/env";
import { fetcherSSR } from "@/lib/fetcherSSR";
import { redirect } from "next/navigation";

export default async function Page(req: Request, res: Response) {
  const [error, user] = await fetcherSSR<User>(
    req,
    res,
    `${environment.apiURL}/me`
  );

  if (!user) {
    return redirect("/");
  }

  return (
    <div>
      SSR
      <h1>{user?.name}</h1>
      <h2>{user.tokenVersion}</h2>
    </div>
  );
}
