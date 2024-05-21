import { connectToDB } from "@db/connect";
import Chat from "@models/ChatModel";
import User from "@models/UserModel";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    const { chatID } = params;

    const chat = await Chat.findById(chatID)
      .populate({
        path: "members",
        model: User,
      })
      .exec();

    return new Response(JSON.stringify(chat), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to fetch message", { status: 500 });
  }
};