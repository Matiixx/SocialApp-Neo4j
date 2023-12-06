import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import driver from "../db";

export const getRouter = createTRPCRouter({
  getPosts: publicProcedure.query(async () => {
    const res = await driver.executeQuery(
      "MATCH (p:Post)-[:POSTED_BY]->(u:User) RETURN p, u",
    );

    return res.records.map((record) => {
      const post = (
        record.get("p") as {
          properties: unknown;
        }
      ).properties as {
        id: string;
        content: string;
        date: string;
      };
      const user = (
        record.get("u") as {
          properties: unknown;
        }
      ).properties as {
        id: string;
        username: string;
      };

      return {
        post,
        user,
      };
    });
  }),

  getPost: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const res = await driver.executeQuery(
        "MATCH (p:Post {id: $id})-[:POSTED_BY]->(u:User) RETURN p, u",
        { id: input.id },
      );
      if (!res.records[0]) return null;

      return {
        post: (
          res.records[0].get("p") as {
            properties: unknown;
          }
        ).properties as {
          id: string;
          content: string;
        },
        user: (
          res.records[0].get("u") as {
            properties: unknown;
          }
        ).properties as {
          id: string;
          username: string;
        },
      };
    }),
});
