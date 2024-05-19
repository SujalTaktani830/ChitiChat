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

  secret : process.env.NEXTAUTH_SECRET,

  callbacks: {
    async session({ session }) {
      const mongoDbUser = await User.findOne(
        { email: session.user.email },
        { username: 1, profileImage: 1, _id: 1 }
      );
      session.user.id = mongoDbUser._id.toString();

      if (mongoDbUser) {
        session.user = {
          email: session.user.email,
          username: mongoDbUser.username,
          profileImage: mongoDbUser.profileImage,
          id: mongoDbUser._id,
        };
      }

      return session;
    },
  },
});

export { handler as GET, handler as POST };

// OLD CALLBACK LOGIC -
{
  /*
  callbacks: {
    async session({ session }) {
      const mongoDbUser = await User.findOne({ email: session.user.email });
      session.user.id = mongoDbUser._id.toString();

      session.user = { ...session.user, ...mongoDbUser._doc() };

      return session;
    },
  },
  */
}
