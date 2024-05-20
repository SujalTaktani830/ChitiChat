import { connectToDB } from "@db/connect";
import User from "@models/UserModel";
import { Chat } from "@mui/icons-material";

export const POST = async (req, res) => {
  try {
    await connectToDB();

    const { body } = await req.json();

    const { currentUserID, isGroup, members, groupPhoto, groupName } = body;

    const query = isGroup
      ? { isGroup, groupPhoto, groupName, members: [currentUserID, ...members] }
      : { members: { $all: [currentUserID, ...members] }, $size: 2 };

    let chat = await Chat.findOne(query);

    if (chat) {
      return new Response(JSON.stringify({ message: "Chat already exists" }), {
        status: 304,
      });
    } else {
      const chat = await Chat.create(
        isGroup ? query : { members: [currentUserID, ...members] }
      );

      // PUSH THE CHAT TO THE USER MODEL "CHAT" ARRAY -
      await User.findByIdAndUpdate(currentUserID, {
        $addToSet: { chats: chat._id },
      });

      return new Response(JSON.stringify("Chat created successfully"), {
        status: 200,
      });
    }
  } catch (err) {
    console.log(err);
    return new Response(
      JSON.stringify({ message: "Failed to create new chat" }),
      { status: 500 }
    );
  }
};
