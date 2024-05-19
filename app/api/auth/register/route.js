import { connectToDB } from "@db/connect";
import User from "@models/UserModel";
import { hash } from "bcryptjs";

export const POST = async (req, res) => {
  try {
    await connectToDB();

    const { username, email, password } = await req.json();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return new Response(JSON.stringify({ message: "User already exists" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const hashedPass = await hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPass,
    });

    await newUser.save();

    return new Response(JSON.stringify(newUser), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (e) {
    console.log(e);
    return new Response(
      JSON.stringify({ message: "Failed to create the new user" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
