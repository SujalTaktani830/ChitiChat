import User from "@models/UserModel";
import { connectToDB } from "@db/connect";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    const { searchContact } = params;

    const contact = await User.find({
      $or: [
        { username: { $regex: searchContact, $options: "i" } },
        { email: { $regex: searchContact, $options: "i" } },
      ],
    });

    return new Response(JSON.stringify(contact), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "User does not exits" }),
      { status: 500 }
    );
  }
};
