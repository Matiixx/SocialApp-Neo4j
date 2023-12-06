"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { api } from "~/trpc/react";

function Register() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { mutateAsync: createUser } = api.post.createUser.useMutation();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-5xl font-extrabold tracking-tight">Register</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!username || !password) {
              // setError("Please write something!");
              return;
            }
            createUser(
              { username, password },
              {
                onSuccess: () => {
                  router.push(`/api/auth/signin`);
                },
              },
            ).catch(console.error);
          }}
          className="m-5 flex flex-col gap-2"
        >
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => {
              // setError(undefined);
              setUsername(e.currentTarget.value);
            }}
            className={`w-full rounded-full px-4 py-2 text-black`}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              // setError(undefined);
              setPassword(e.currentTarget.value);
            }}
            className={`w-full rounded-full px-4 py-2 text-black ${1}`}
          />
          <button
            type="submit"
            className="w-full rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20 disabled:opacity-50"
            // disabled={createPost.isLoading || !content}
          >
            {/* {createPost.isLoading ? "Submitting..." : "Submit"} */}
            Register
          </button>
        </form>
      </div>
    </main>
  );
}

export default Register;
