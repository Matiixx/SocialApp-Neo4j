"use client";

import React from "react";
import { useRouter } from "next/navigation";

import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";

import { api } from "~/trpc/react";

function DeletePostIcon({ postId }: { postId: string }) {
  const router = useRouter();
  const deletePost = api.put.deletePost.useMutation();

  return (
    <IconButton
      sx={{ color: "red" }}
      onClick={(e) => {
        e.preventDefault();
        deletePost.mutate(
          { postId },
          {
            onSuccess: () => {
              router.replace("/");
            },
          },
        );
      }}
    >
      <DeleteIcon />
    </IconButton>
  );
}

export default DeletePostIcon;
