import { connectToDB } from "@db/connect";
import User from "@models/UserModel";

export const GET = async (req, res) => {
  try {
    await connectToDB();

    const allUsers = await User.find({});

    return new Response(JSON.stringify(allUsers), { status: 200 });
  } catch (e) {
    console.log(e);
    return new Response(
      JSON.stringify({ message: "Cannot fetch your chats" }),
      { status: 500 }
    );
  }
};
