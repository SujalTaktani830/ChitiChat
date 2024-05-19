import { connectToDB } from "@db/connect";
import User from "@models/UserModel";
import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials, req) {
        if (!credentials.email || !credentials.password) {
          throw new Error("Invalid email or password");
        }

        await connectToDB();

        // console.log(credentials.email);
        // console.log(credentials.password);

        const user = await User.findOne({ email: credentials.email });

        // console.log(user.email);
        // console.log(user.password);

        if (!user || !user.password) {
          throw new Error("User not found");
        }

        const isMatch = await compare(credentials.password, user.password);

        if (!isMatch) {
          throw new Error("Invalid email or password");
        }

        return user;
      },
    }),
  ],
});

export { handler as GET, handler as POST };
