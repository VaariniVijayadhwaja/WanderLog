"use client"; 

import { signIn, signOut } from "next-auth/react";

export default function AuthButtons({ isAuthenticated }: { isAuthenticated: boolean }) {
  return isAuthenticated ? (
    <button onClick={() => signOut()} className="px-4 py-2 bg-red-500 text-white rounded">
      Sign out
    </button>
  ) : (
    <button onClick={() => signIn("github")} className="px-4 py-2 bg-green-500 text-white rounded">
      Login with GitHub
    </button>
  );
}
