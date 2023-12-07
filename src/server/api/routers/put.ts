import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import driver from "../db";

export const putRouter = createTRPCRouter({
  deletePost: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { postId } = input;
      const userId = ctx.session?.user.id;

      const res = await driver.executeQuery(
        `
        MATCH (p:Post {postId: $postId})-[r:POSTED_BY]->(u:User {userId: $userId})
        OPTIONAL MATCH (u)-[l:LIKED]->(p)
        OPTIONAL MATCH (c:Comment)-[COMMENTED_ON]->(p)
        DETACH DELETE r, l, c, p
        RETURN p, r
        `,
        { userId, postId },
      );

      return res;
    }),
});
