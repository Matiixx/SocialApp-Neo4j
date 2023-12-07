"use client";

import React from "react";
import { type Session } from "next-auth";

function SessionButtons({ session }: { session: Session | null }) {
  return (
    <>
      {session?.user ? (
        <button className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20">
          <a href="/api/auth/signout">Logout</a>
        </button>
      ) : (
        <>
          <button className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20">
            <a href="/api/auth/signin">Login</a>
          </button>
          <button className="rounded-full bg-white/20 px-10 py-3 font-semibold transition hover:bg-white/30">
            <a href="/register">Sign up</a>
          </button>
        </>
      )}
    </>
  );
}

export default SessionButtons;
