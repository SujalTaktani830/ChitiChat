import { connectToDB } from "@db/connect";
import Chat from "@models/ChatModel";
import User from "@models/UserModel";

export const POST = async (req) => {
  try {
    await connectToDB();

    const {
      currentUserID,
      isGroup,
      members,
      groupPhoto,
      groupName,
    } = await req.json();

    const query = isGroup
      ? { isGroup, groupPhoto, groupName, members: [currentUserID, ...members] }
      : { members: { $all: [currentUserID, ...members] }, $size: 2 };

    let chat = await Chat.findOne(query);

    if (!chat) {
      chat = await Chat.create(
        isGroup ? query : { members: [currentUserID, ...members] }
      );

      // Update all members' chat arrays
      await Promise.all(
        chat.members.map((memberID) =>
          User.findByIdAndUpdate(
            memberID,
            { $addToSet: { chats: chat._id } },
            { new: true }
          )
        )
      );
    }

    return new Response(JSON.stringify(chat), { status: 200 });
  } catch (err) {
    console.error("Error creating chat:", err);
    return new Response(
      JSON.stringify({ message: "Failed to create new chat" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
