import NextAuth from "next-auth"

declare module "next-auth" {
  interface JWT {
    accessToken : string
  }
  interface User {
    accessToken : string
  }
  interface Session extends DefaultSession {
    accessToken : string
    user?: User;
  }
}