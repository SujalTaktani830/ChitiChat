import { connectToDB } from "@db/connect";
import User from "@models/UserModel";

export const POST = async (req, { params }) => {
  try {
    await connectToDB();

    const { userID } = params;

    const { username, profileImage } = await req.json();

    const updatedUser = await User.findByIdAndUpdate(
      userID,
      {
        username,
        profileImage,
      },
      { new: true }
    );

    return new Response(JSON.stringify(updatedUser), { status: 200 });
  } catch (e) {
    console.log(e);
    return new Response(JSON.stringify({ message: "Failed to update user" }), {
      status: 500,
    });
  }
};
