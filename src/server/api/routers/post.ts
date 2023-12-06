import { randomUUID } from "crypto";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import driver from "../db";

export const postRouter = createTRPCRouter({
  createUser: publicProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { username, password } = input;
      const maybeExists = await driver.executeQuery(
        "MATCH (u:User {name: $name}) RETURN u",
        { name: username },
      );

      if (maybeExists.records[0]) {
        return new Error("User already exists");
      }

      const res = await driver.executeQuery(
        "CREATE (u:User {userId: $userId, name: $name, password: $password}) RETURN u",
        { name: username, password, userId: randomUUID() },
      );
      return res.records[0];
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
        `MATCH (u:User {userId: $userId})
          CREATE (p:Post {postId: $postId, content: $content, date: $date})-[:POSTED_BY]->(u) RETURN p, u`,
        { content, userId, postId: randomUUID(), date: Date.now() },
      );
      return res;
    }),
});
