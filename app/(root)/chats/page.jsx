"use client";

import { useSession } from "next-auth/react";

const Chats = () => {
  const { data: session } = useSession();
  console.log(session);
  return <div>CHATS IS MY LIFE</div>;
};

export default Chats;
