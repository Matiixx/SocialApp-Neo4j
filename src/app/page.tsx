import { type Session } from "next-auth";

import { CreatePost } from "~/app/_components/create-post";
import { getServerAuthSession } from "~/server/auth";
import Logo from "./_components/logo";
import OtherPosts from "./_components/other-posts";
import SessionButtons from "./_components/session-buttons";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="flex min-h-screen max-w-2xl flex-col items-center justify-center">
        <Logo />
        <div className="my-3 flex gap-4">
          <SessionButtons session={session} />
        </div>
        <CreatePostWrapper session={session} />

        <OtherPosts session={session} />
      </div>
    </main>
  );
}

async function CreatePostWrapper({ session }: { session: Session | null }) {
  if (!session?.user) return null;

  return (
    <div className="w-full">
      <CreatePost />
    </div>
  );
}
