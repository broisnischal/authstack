import { IUser } from "@shared";
// import { useRouter } from "next/router";
import Link from "next/link";

type User = Prettify<IUser>;

export default function Navigation() {
  // const router = useRouter();

  return (
    <nav className="min-h-[10vh] flex flex-col items-center justify-center">
      <ul className="flex gap-7">
        <Link href={"/"}>Home</Link>
        <Link href={"/me"}>CSR</Link>
        <Link href={"/me-ssr"}>SSR</Link>
      </ul>
    </nav>
  );
}
