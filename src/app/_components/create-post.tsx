"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "~/trpc/react";

export function CreatePost() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [error, setError] = useState<string>();

  const createPost = api.post.createPost.useMutation({
    onSuccess: () => {
      router.refresh();
      setContent("");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!content) {
          setError("Please write something!");
          return;
        }
        createPost.mutate({ content });
      }}
      className="m-5 flex flex-col gap-2"
    >
      <input
        type="text"
        placeholder="Write something..."
        value={content}
        onChange={(e) => {
          setError(undefined);
          setContent(e.currentTarget.value);
        }}
        className={`w-full rounded-full px-4 py-2 text-black ${
          error ? "border-2 border-red-500" : ""
        }`}
      />
      <button
        type="submit"
        className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20 disabled:opacity-50"
        disabled={createPost.isLoading || !content}
      >
        {createPost.isLoading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
