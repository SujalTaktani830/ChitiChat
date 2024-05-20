import { connectToDB } from "@db/connect";
import Chat from "@models/ChatModel";
import User from "@models/UserModel";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    const { userID } = params;

    const allChats = await Chat.find({ members: userID })
      .sort({
        lastMessage: -1,
      })
      .populate({
        path: "members",
        model: User,
      })
      .exec();

    return new Response(JSON.stringify(allChats), { status: 200 });
  } catch (err) {
    console.log("userID r - ", err);
    return new Response("Failed to get all the chats", { status: 500 });
  }
};
