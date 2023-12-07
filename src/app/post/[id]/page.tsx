import React from "react";

import { AddComment } from "~/app/_components/add-comment";
import { getServerAuthSession } from "~/server/auth";
import Logo from "~/app/_components/logo";
import OtherComments from "~/app/_components/comments";

import { api } from "~/trpc/server";
import SessionButtons from "~/app/_components/session-buttons";

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
        <Logo />
        <div className="my-3 flex gap-4">
          <SessionButtons session={session} />
        </div>
        <div className="w-full flex-1">
          <div className="my-2 flex w-full cursor-pointer flex-row items-center gap-4 rounded-xl bg-white/10 p-4 transition hover:bg-white/20">
            <div className="rounded p-1 transition hover:bg-white/20">
              @{post.user.name ?? "user"}
            </div>
            <div>{post.post.content}</div>
          </div>

          <div className="w-full">
            <OtherComments postId={params.id} />
          </div>
          {session?.user && (
            <div className="my-8 w-full">
              <AddComment postId={params.id} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
