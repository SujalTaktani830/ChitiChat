import { connectToDB } from "@db/connect";
import Chat from "@models/ChatModel";
import Message from "@models/MessageModel";

export const POST = async (req) => {
  try {
    await connectToDB();

    const body = await req.json();

    const { chatID, currentUserID, text, photo } = body;

  //   console.log(body);
  // console.log(chatID, currentUserID, text, photo);

    const newMessage = await Message.create({
      chat: chatID,
      sender: currentUserID,
      text,
      photos : photo,
      seenBy: currentUserID,
    });

    console.log(newMessage);

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
        populate: {
          path: "sender seenBy",
          model: "User",
        },
      })
      .populate({
        path: "members",
        model: "User",
      })
      .exec();

    return new Response(JSON.stringify(newMessage), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to create new message", { status: 500 });
  }
};
