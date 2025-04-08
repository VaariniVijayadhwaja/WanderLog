import Image from "next/image";
import { auth } from "@/auth";
import Link from "next/link";
import AuthButtons from "./AuthButtons"

const Navbar = async () => {
  const session = await auth();  
  
  return (
    <header className="px-1 py-0 bg-sky-500/30 shadow-sm font-dynapuff">
      <nav className="flex justify-between items-center">
        <Link href="/">
          <Image src="/logo.png" alt="Logo" width={144} height={5} priority />
        </Link>
        <div className="flex items-center gap-5">
          {session && session.user ? (
            <>
              <Link href="/start/create">
                <span>Create</span>
              </Link>
              <Link href={`/user/${session.user.id}`}>
                <span>{session.user.name}</span>
              </Link>
              <AuthButtons isAuthenticated={true} />
            </>
          ) : (
            <AuthButtons isAuthenticated={false} />
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
