"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { type Session } from "node_modules/next-auth/core/types";

import CircularProgress from "@mui/material/CircularProgress";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import IconButton from "@mui/material/IconButton";

import { api } from "~/trpc/react";

export default function OtherPosts({ session }: { session: Session | null }) {
  const router = useRouter();
  const utils = api.useUtils();
  const { data: posts, isLoading } = api.get.getPosts.useQuery();
  const like = api.post.like.useMutation();
  const unlike = api.post.unlike.useMutation();

  if (!posts || isLoading) {
    return (
      <div className="flex w-full flex-1 justify-center p-4">
        <CircularProgress size={75} />
      </div>
    );
  }

  return (
    <div className="w-full flex-1 p-4">
      {posts.map((post, index) => {
        return (
          <div
            key={index}
            className="my-2 flex w-full cursor-pointer flex-col items-center gap-4 rounded-xl bg-white/10 p-4 transition hover:bg-white/20"
            onClick={() => {
              router.push(`/post/${post.post.postId}`);
            }}
          >
            <div className="flex w-full flex-row items-center gap-2">
              <div
                className="rounded p-1 text-xl transition hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("clicked");
                }}
              >
                @{post.user.name ?? "user"}
              </div>
              <div>{post.post.content}</div>
              <div className="flex-1 text-right text-white/75">
                {new Date(post.post.date ?? Date.now()).toLocaleString()}
              </div>
            </div>
            <div className="flex w-full justify-end">
              {post.liked ? (
                <IconButton
                  sx={{ color: "red" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    unlike.mutate(
                      { postId: post.post.postId },
                      {
                        onSuccess: () => {
                          utils.invalidate().catch(console.error);
                        },
                      },
                    );
                  }}
                >
                  <FavoriteIcon />
                </IconButton>
              ) : (
                <IconButton
                  sx={{ color: "white" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (post.user.userId === session?.user.id) return;

                    like.mutate(
                      { postId: post.post.postId },
                      {
                        onSuccess: () => {
                          utils.invalidate().catch(console.error);
                        },
                      },
                    );
                  }}
                >
                  <FavoriteBorderIcon />
                </IconButton>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
