import { connectToDB } from "@db/connect";
import Chat from "@models/ChatModel";

export const POST = async (req, { params }) => {
  try {
    await connectToDB();

    const { chatID } = params;

    const body = await req.json();

    console.log(body);

    const { groupName, groupPhoto } = body;

    console.log(groupName, groupPhoto);

    const updatedGroup = await Chat.findByIdAndUpdate(
      chatID,
      {
        groupName,
        groupPhoto,
      },
      {
        new: true,
      }
    );

    console.log(updatedGroup);

    return new Response(JSON.stringify(updatedGroup), { status: 200 });
  } catch (error) {
    console.log("Failed to update group ", error);
    return new Response("Failed to update group", { status: 500 });
  }
};
