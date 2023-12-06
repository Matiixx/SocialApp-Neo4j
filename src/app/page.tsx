import { type Session } from "next-auth";

import { CreatePost } from "~/app/_components/create-post";
import { getServerAuthSession } from "~/server/auth";
import OtherPosts from "./_components/other-posts";

export default async function Home() {
  const session = await getServerAuthSession();

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
        <CreatePostWrapper session={session} />

        <OtherPosts />
      </div>
    </main>
  );
}

async function CreatePostWrapper({ session }: { session: Session | null }) {
  if (!session?.user) return null;

  return (
    <div className="w-full max-w-lg">
      <CreatePost />
    </div>
  );
}
