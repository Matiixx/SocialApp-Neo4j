"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { api } from "~/trpc/react";

export default function OtherPosts() {
  const router = useRouter();
  const { data: posts, isLoading } = api.get.getPosts.useQuery();

  if (!posts || isLoading) {
    return null;
  }

  return (
    <div className="w-full flex-1 p-4">
      {posts.map((post, index) => {
        return (
          <div
            key={index}
            className="my-2 flex w-full cursor-pointer flex-row items-center gap-4 rounded-xl bg-white/10 p-4 transition hover:bg-white/20"
            onClick={() => {
              router.push(`/post/${post.post.postId}`);
            }}
          >
            <div
              className="rounded p-1 transition hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                console.log("clicked");
              }}
            >
              @{post.user.username ?? "user"}
            </div>
            <div>{post.post.content}</div>
            <div className="flex-1 text-right text-white/75">
              {new Date(post.post.date ?? Date.now()).toLocaleTimeString()}
            </div>
          </div>
        );
      })}
    </div>
  );
}
