import { settings } from "@/config/settings";
import axios from "axios";
import { type DefaultSession, type DefaultUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    role?: string;
    token?: string;
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      role?: string;
      token?: string;
    } & DefaultSession["user"];
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "email@example.com",
        },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        if (
          credentials.email === settings.auth.demoAccount.email &&
          credentials.password === settings.auth.demoAccount.password
        ) {
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                id: "1",
                email: settings.auth.demoAccount.email,
                name: settings.auth.demoAccount.name,
                role: settings.auth.demoAccount.role,
              });
            }, 1000);
          });
        }

        // try {
        //   const response = await axios.post('/auth/login', {
        //     email: credentials.email,
        //     password: credentials.password
        //   }, {
        //     withCredentials: true
        //   });

        //   if (response.data.status === 'success') {
        //     const userData = response.data.result;
        //     return {
        //       id: userData.id,
        //       email: userData.email,
        //       firstName: userData.firstName,
        //       lastName: userData.lastName,
        //       name: `${userData.firstName} ${userData.lastName}`,
        //       role: userData.role,
        //       token: userData.token
        //     };
        //   }
        //   return null;
        // } catch (error) {
        //   console.error('Authentication error:', error);
        //   return null;
        // }
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.token;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.token = token.accessToken as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt" as const,
  },
};
