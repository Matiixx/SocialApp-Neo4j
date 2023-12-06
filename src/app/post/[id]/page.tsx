import React from "react";
import { getServerAuthSession } from "~/server/auth";

import { api } from "~/trpc/server";

export default async function Post({ params }: { params: { id: string } }) {
  const session = await getServerAuthSession();
  const post = await api.get.getPost.query({
    id: params.id,
  });

  if (!post) {
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="flex min-h-screen max-w-2xl flex-col items-center justify-center">
        <h1 className="my-2 text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Social Media App
        </h1>
        <div className="my-3 flex gap-4">
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
                <a href="/api/auth/new-user">Sign up</a>
              </button>
            </>
          )}
        </div>

        <div className="my-2 flex w-full cursor-pointer flex-row items-center gap-4 rounded-xl bg-white/10 p-4 transition hover:bg-white/20">
          <div className="rounded p-1 transition hover:bg-white/20">
            @{post.user.username ?? "user"}
          </div>
          <div>{post.post.content}</div>
        </div>
      </div>
    </main>
  );
}
