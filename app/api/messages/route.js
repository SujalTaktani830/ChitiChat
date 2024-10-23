import { connectToDB } from "@db/connect";
import { pusherServer } from "@lib/pusher";
import Chat from "@models/ChatModel";
import Message from "@models/MessageModel";
import User from "@models/UserModel";

export const POST = async (req) => {
  try {
    await connectToDB();

    const { chatID, currentUserID, text, photo } = await req.json();

    const currentUser = await User.findById(currentUserID);
    if (!currentUser) {
      return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
    }

    const newMessage = await Message.create({
      chat: chatID,
      sender: currentUser._id,
      text,
      photos: photo,
      seenBy: [currentUserID],
    });

    const updatedChat = await Chat.findByIdAndUpdate(
      chatID,
      {
        $push: { messages: newMessage._id },
        $set: { lastMessage: newMessage.createdAt },
      },
      { new: true }
    )
      .populate({
        path: "messages",
        model: Message,
        populate: [
          { path: "sender", model: "User" },
          { path: "seenBy", model: "User" },
        ],
      })
      .populate({
        path: "members",
        model: "User",
      })
      .exec();

    await pusherServer.trigger(chatID, "new-message", newMessage);

    return new Response(JSON.stringify(newMessage), { status: 200 });
  } catch (error) {
    console.error("Error creating message:", error);
    return new Response(
      JSON.stringify({ message: "Failed to create new message" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
