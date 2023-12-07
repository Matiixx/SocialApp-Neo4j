import { createTRPCRouter } from "~/server/api/trpc";
import { getRouter } from "~/server/api/routers/get";
import { postRouter } from "~/server/api/routers/post";
import { putRouter } from "./routers/put";

export const appRouter = createTRPCRouter({
  post: postRouter,
  get: getRouter,
  put: putRouter,
});

export type AppRouter = typeof appRouter;
