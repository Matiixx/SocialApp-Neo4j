import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { env } from "~/env";
import driver from "./api/db";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub,
      },
    }),
  },
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: env.NEXTAUTH_SECRET,
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credetials) {
        if (!credetials) {
          return null;
        }

        const { username, password } = credetials;

        const res = await driver.executeQuery(
          "MATCH (u:User {name: $name, password: $password}) RETURN u",
          { name: username, password },
        );

        const user = res.records[0];

        if (user) {
          return {
            id: (
              user.get("u") as {
                properties: { userId: string };
              }
            ).properties.userId,
            name: (
              user.get("u") as {
                properties: { name: string };
              }
            ).properties.name,
            email: "",
          };
        } else {
          return null;
        }
      },
    }),
  ],
};

export const getServerAuthSession = () => getServerSession(authOptions);
