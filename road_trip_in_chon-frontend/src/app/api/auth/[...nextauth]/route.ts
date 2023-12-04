import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import nextAuth from "next-auth";
import axios from "axios";

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    CredentialsProvider({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try{
          const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND}/auth/login-email`,{
            email : credentials?.username,
            password : credentials?.password
          }, {
            headers: { "Content-Type": "application/json" },
          });
          const user = res.data
          return user
        }catch(err : any){
          throw new Error(err.response.data.message)
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account,user }) {
      if (account?.provider === "google") {
        const res = await axios
          .post(`${process.env.NEXT_PUBLIC_BACKEND}/auth/login-google`, {
            credential: account.id_token,
          })
          .catch((err) => {
            console.log(err);
          });
        token.accessToken = res?.data.accessToken
      } else if (account?.provider === "credentials"){
        token.accessToken = user?.accessToken
      }
      return token
    },
    async session({ session, token}) {
      session.accessToken = token.accessToken as string
      return session
    }
  },
  pages: {
    signIn: "/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = nextAuth(authOptions);

export { handler as GET, handler as POST };
