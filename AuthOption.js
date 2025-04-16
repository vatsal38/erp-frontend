import DataServices from "@/services/requestApi";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (credentials) {
          try {
            const response = await DataServices.Login(credentials);
            return {
              ...response.data,
            };
          } catch (error) {
            if (!error.response) {
              throw new Error("No internet connection....");
            } else {
              throw new Error(error.response?.data.message);
            }
          }
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, trigger, session, account, user }) {
      if (trigger === "update") {
        if (session) {
          token.user = session;
          return token;
        }
      }
      if (account?.provider === "credentials" && user) {
        return { ...token, ...user };
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token;
      return session;
    },
    async redirect({ baseUrl }) {
      return baseUrl;
    },
  },
  debug: false,
  session: {
    strategy: "jwt",
    maxAge: 86400,
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/login",
  },
};
