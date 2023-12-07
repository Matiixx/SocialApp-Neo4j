"use client";

import React from "react";
import { useRouter } from "next/navigation";

function Logo() {
  const router = useRouter();
  return (
    <h1
      className="my-2 cursor-pointer text-5xl font-extrabold tracking-tight sm:text-[5rem]"
      onClick={() => {
        router.push("/");
      }}
    >
      Social Media App
    </h1>
  );
}

export default Logo;
