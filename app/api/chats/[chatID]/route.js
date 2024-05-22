import { connectToDB } from "@db/connect";
import Chat from "@models/ChatModel";
import User from "@models/UserModel";
import Message from "@models/MessageModel";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    const { chatID } = params;

    // Find the chat and populate members
    const chat = await Chat.findById(chatID).populate({
      path: "members",
      model: User,
    });

    // If chat is not found, return a 404 response
    if (!chat) {
      return new Response("Chat not found", { status: 404 });
    }

    await Chat.populate(chat, {
      path: "messages",
      model: Message,
      populate: [{ path: "sender", model: User }],
    });

    // Populate messages and their related data
    // await Chat.populate(chat, {
    //   path: "messages",
    //   model: Message,
    //   populate: [
    //     {
    //       path: "sender",
    //       model: User,
    //     },
    //     {
    //       path: "seenBy",
    //       model: User,
    //     },
    //   ],
    // });

    // const chat = await Chat.findById(chatID).populate("members messages");

    // console.log("ChatWithMessages - ", chat);

    return new Response(JSON.stringify(chat), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to fetch message", { status: 500 });
  }
};
