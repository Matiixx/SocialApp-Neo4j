import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import driver from "../db";

export const getRouter = createTRPCRouter({
  getPosts: publicProcedure.query(async ({ ctx }) => {
    if (ctx.session?.user.id) {
      const res = await driver.executeQuery(
        `
        MATCH (currentUser:User {userId: $userId})
        MATCH (post:Post)-[:POSTED_BY]-(author:User)
        WHERE NOT (currentUser)-[:POSTED_BY]->(post)  // Exclude posts created by the current user
        OPTIONAL MATCH (currentUser)-[l:LIKED]->(post) 
        RETURN post, author, l AS liked
        ORDER BY post.date DESC
        `,
        {
          userId: ctx.session.user.id,
        },
      );

      return res.records.map((record) => {
        const post = (
          record.get("post") as {
            properties: unknown;
          }
        ).properties as {
          postId: string;
          content: string;
          date: string;
        };
        const user = (
          record.get("author") as {
            properties: unknown;
          }
        ).properties as {
          userId: string;
          name: string;
        };
        const liked = !!record.get("liked");

        return {
          post,
          user,
          liked,
        };
      });
    }

    const res = await driver.executeQuery(
      "MATCH (p:Post)-[:POSTED_BY]->(u:User) RETURN p, u",
    );

    return res.records.map((record) => {
      const post = (
        record.get("p") as {
          properties: unknown;
        }
      ).properties as {
        postId: string;
        content: string;
        date: string;
      };
      const user = (
        record.get("u") as {
          properties: unknown;
        }
      ).properties as {
        userId: string;
        name: string;
      };

      return {
        post,
        user,
        liked: false,
      };
    });
  }),

  getPost: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const res = await driver.executeQuery(
        "MATCH (p:Post {postId: $postId})-[:POSTED_BY]->(u:User) RETURN p, u",
        { postId: input.id },
      );
      if (!res.records[0]) return null;

      return {
        post: (
          res.records[0].get("p") as {
            properties: unknown;
          }
        ).properties as {
          postId: string;
          content: string;
        },
        user: (
          res.records[0].get("u") as {
            properties: unknown;
          }
        ).properties as {
          userId: string;
          name: string;
        },
      };
    }),

  getComments: publicProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ input }) => {
      const { postId } = input;
      const res = await driver.executeQuery(
        `MATCH (c:Comment)-[:COMMENTED_BY]->(u:User), (c)-[:COMMENTED_ON]->(p:Post {postId: $postId}) RETURN c, u`,
        { postId },
      );
      const comments = res.records.map((record) => {
        const comment = (
          record.get("c") as {
            properties: unknown;
          }
        ).properties as {
          commentId: string;
          content: string;
          date: string;
        };
        const user = (
          record.get("u") as {
            properties: unknown;
          }
        ).properties as {
          userId: string;
          name: string;
        };

        return {
          comment,
          user,
        };
      });
      return comments;
    }),
});
