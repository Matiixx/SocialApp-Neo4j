"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "~/trpc/react";

export function AddComment({ postId }: { postId: string }) {
  const router = useRouter();
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string>();
  const utils = api.useUtils();

  const addComment = api.post.addComment.useMutation({
    onSuccess: () => {
      router.refresh();
      utils.invalidate().catch(console.error);
      setComment("");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!comment) {
          setError("Please write something!");
          return;
        }
        addComment.mutate({ comment, postId });
      }}
      className="m-5 flex flex-col gap-2"
    >
      <input
        type="text"
        placeholder="Reply something..."
        value={comment}
        onChange={(e) => {
          setError(undefined);
          setComment(e.currentTarget.value);
        }}
        className={`w-full rounded-full px-4 py-2 text-black ${
          error ? "border-2 border-red-500" : ""
        }`}
      />
      <button
        type="submit"
        className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20 disabled:opacity-50"
        disabled={addComment.isLoading || !comment}
      >
        {addComment.isLoading ? "Adding..." : "Add comment"}
      </button>
    </form>
  );
}
