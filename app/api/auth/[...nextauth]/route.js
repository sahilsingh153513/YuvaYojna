import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

import YuserRegister from "@/model/yuserRegister";
import connectdb from "@/config/ConnectDb";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs"; // Add this if you're using bcrypt for passwords

export const authOptions = {
  providers: [
    // 🔹 Normal Login (credentials)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          await connectdb();

          const user = await YuserRegister.findOne({
            email: credentials.email.toLowerCase()
          });
          
          if (!user) {
            return null; // User not found
          }
          
          // Check if user is verified
          if (!user.isVerified) {
            return null; // User not verified
          }
          
          // For Google users, they don't have passwords
          if (user.provider === "google") {
            return null; // Google users should use Google sign-in
          }
          
          // Verify password (assuming you're using bcrypt)
          const isValidPassword = await bcrypt.compare(credentials.password, user.password);
          
          if (!isValidPassword) {
            return null; // Invalid password
          }
          
          // Return user data
          return {
            id: user.userToken,
            userToken: user.userToken,
            email: user.email,
            name: user.fullName,
            mongoId: user._id.toString(),
          };
          
        } catch (error) {
          console.error("Credentials auth error:", error);
          return null;
        }
      },
    }),

    // 🔹 Google Login
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    // Called when user signs in
    async signIn({ user, account }) {
      try {
        await connectdb();

        if (account.provider === "google") {
          let existingUser = await YuserRegister.findOne({ email: user.email });

          if (!existingUser) {
            // Generate userToken just like in regular signup
            const usertokenuuid = uuidv4();

            existingUser = new YuserRegister({
              fullName: user.name || "Unnamed",
              email: user.email,
              isVerified: true, // google already verifies email
              provider: "google",
              userToken: usertokenuuid,
              password: "",
              age: null,
            });
            await existingUser.save();
          }

          // Store the userToken in the user object for session
          user.id = existingUser.userToken;
          user.userToken = existingUser.userToken;
          user.mongoId = existingUser._id.toString();
        }

        return true;
      } catch (error) {
        console.error("Google auth database error:", error);
        return "/login?error=database";
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.userToken || user.id;
        token.userToken = user.userToken;
        token.mongoId = user.mongoId;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.userToken || token.id;
        session.user.userToken = token.userToken;
        session.user.mongoId = token.mongoId;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    error: "/login",
  },

  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
