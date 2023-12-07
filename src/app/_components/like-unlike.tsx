"use client";

import React from "react";
import { type Session } from "node_modules/next-auth/core/types";
import { useRouter } from "next/navigation";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import IconButton from "@mui/material/IconButton";

import { api } from "~/trpc/react";

function LikeUnlike({
  liked,
  postId,
  session,
  postUserId,
}: {
  liked: boolean;
  postId: string;
  session: Session | null;
  postUserId: string;
}) {
  const router = useRouter();
  const like = api.post.like.useMutation();
  const unlike = api.post.unlike.useMutation();

  return (
    <>
      {liked ? (
        <IconButton
          sx={{ color: "red" }}
          onClick={(e) => {
            e.stopPropagation();
            unlike.mutate(
              { postId },
              {
                onSuccess: () => {
                  router.refresh();
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
            if (postUserId === session?.user.id) return;

            like.mutate(
              { postId },
              {
                onSuccess: () => {
                  router.refresh();
                },
              },
            );
          }}
        >
          <FavoriteBorderIcon />
        </IconButton>
      )}
    </>
  );
}

export default LikeUnlike;
