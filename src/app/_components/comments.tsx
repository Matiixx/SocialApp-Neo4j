"use client";

import React from "react";

import CircularProgress from "@mui/material/CircularProgress";

import { api } from "~/trpc/react";

export default function OtherComments({ postId }: { postId: string }) {
  const { data: comments, isLoading } = api.get.getComments.useQuery(
    { postId },
    { enabled: !!postId },
  );

  if (!comments || isLoading) {
    return (
      <div className="flex w-full flex-1 justify-center p-4">
        <CircularProgress size={75} />
      </div>
    );
  }

  return (
    <div className="w-full flex-1 py-2 pl-4">
      {comments.map((comment, index) => {
        return (
          <div
            key={index}
            className="my-2 flex w-full flex-row items-center gap-4 rounded-xl bg-purple-900 p-4 transition hover:bg-white/20"
          >
            <div
              className="cursor-pointer rounded p-1 transition hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                console.log("clicked");
              }}
            >
              @{comment.user.name ?? "Unknown user"}
            </div>
            <div>{comment.comment.content}</div>
            <div className="flex-1 text-right text-white/75">
              {new Date(
                comment.comment.date ?? Date.now(),
              ).toLocaleTimeString()}
            </div>
          </div>
        );
      })}
    </div>
  );
}
