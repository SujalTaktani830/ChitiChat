"use client";

import ChatDetails from "@components/ChatDetails";
import ChatList from "@components/ChatList";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";

const ChatPage = () => {
  const { chatID } = useParams();

  const { data: session } = useSession();

  return (
    <div className="main-container">
      <div className="w-1/3 max-lg:hidden">
        <ChatList currentChatID={chatID} />{" "}
      </div>
      <div className="w-2/3 max-lg:w-full">
        <ChatDetails chatID={chatID} />
      </div>
    </div>
  );
};

export default ChatPage;
