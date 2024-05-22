import { connectToDB } from "@db/connect";
import { pusherServer } from "@lib/pusher";
import Chat from "@models/ChatModel";
import Message from "@models/MessageModel";
import User from "@models/UserModel";

export const POST = async (req) => {
  try {
    await connectToDB();

    const body = await req.json();

    const { chatID, currentUserID, text, photo } = body;

    const currentUser = await User.findById(currentUserID);

    // console.log(body);
    // console.log(chatID, currentUserID, text, photo);

    const newMessage = await Message.create({
      chat: chatID,
      sender: currentUser,
      text,
      photos: photo,
      seenBy: [currentUserID],
    });

    // console.log(newMessage);

    const updatedChat = await Chat.findByIdAndUpdate(
      chatID,
      {
        $push: { messages: newMessage._id },
        $set: {
          lastMessage: newMessage.createdAt,
        },
      },
      { new: true }
    )
      .populate({
        path: "messages",
        model: Message,
        populate: [
          {
            path: "sender",
            model: "User",
          },
          {
            path: "seenBy",
            model: "User",
          },
        ],
      })
      .populate({
        path: "members",
        model: "User",
      })
      .exec();

    // console.log(updatedChat);

    await pusherServer.trigger(chatID, "new-message", newMessage);

    return new Response(JSON.stringify(newMessage), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to create new message", { status: 500 });
  }
};
