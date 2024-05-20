import { connectToDB } from "@db/connect";
import Chat from "@models/ChatModel";
import User from "@models/UserModel";

export const POST = async (req) => {
  try {
    await connectToDB();

    const body = await req.json();

    // console.log(body);

    const { currentUserID, isGroup, members, groupPhoto, groupName } = body;

    const query = isGroup
      ? { isGroup, groupPhoto, groupName, members: [currentUserID, ...members] }
      : { members: { $all: [currentUserID, ...members] }, $size: 2 };
    console.log(query);

    let chat = await Chat.findOne(query);
    console.log("CHAT - ", chat);

    if (!chat) {
      chat = await Chat.create(
        isGroup ? query : { members: [currentUserID, ...members] }
      );

      // PUSH THE CHAT TO THE USER MODEL "CHAT" ARRAY -

      const updateAllMembers = chat.members.map(
        async (memberID) =>
          await User.findByIdAndUpdate(
            memberID,
            {
              $addToSet: { chats: chat._id },
            },
            { new: true }
          )
      );
      await Promise.all(updateAllMembers);
    }

    return new Response(JSON.stringify(chat), { status: 200 });

    // if (!chat) {
    //   // THIS IS NOT CORRECT IG, WILL FIX IT LATER
    //   return new Response(JSON.stringify({ message: "Chat already exists" }));
    // } else {
    //   chat = await Chat.create(
    //     isGroup ? query : { members: [currentUserID, ...members] }
    //   );

    //   // PUSH THE CHAT TO THE USER MODEL "CHAT" ARRAY -
    //   await User.findByIdAndUpdate(currentUserID, {
    //     $addToSet: { chats: chat._id },
    //   });

    //   return new Response(JSON.stringify(chat), { status: 200 });
    // }
  } catch (err) {
    console.log(err);
    return new Response(
      JSON.stringify({ message: "Failed to create new chat" }),
      { status: 500 }
    );
  }
};
