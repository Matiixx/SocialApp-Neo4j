import { randomUUID } from "crypto";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import driver from "../db";

let post = {
  id: 1,
  name: "Hello World",
};

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      post = { id: post.id + 1, name: input.name };
      return post;
    }),

  getLatest: protectedProcedure.query(() => {
    return post;
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  createPost: protectedProcedure
    .input(
      z.object({
        content: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { content } = input;
      const userId = ctx.session?.user.id;
      const res = await driver.executeQuery(
        "CREATE (p:Post {content: $content, id: $id, date: $date})-[:POSTED_BY]->(u:User {id: $userId}) RETURN p",
        { content, userId, id: randomUUID(), date: Date.now() },
      );
      return res;
    }),
});
