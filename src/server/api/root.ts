import { createTRPCRouter } from "~/server/api/trpc";
import { getRouter } from "~/server/api/routers/get";
import { postRouter } from "~/server/api/routers/post";

export const appRouter = createTRPCRouter({
  post: postRouter,
  get: getRouter,
});

export type AppRouter = typeof appRouter;
