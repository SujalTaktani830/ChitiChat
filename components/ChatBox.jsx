"use client";

import { format } from "date-fns";
import { useRouter } from "next/navigation";

const ChatBox = ({ chat, currentUser, currentChatID }) => {
  // console.log(currentUser);

  const otherMember = chat?.members?.filter(
    (member) => member._id !== currentUser.id
  );

  // console.log(otherMember);
  // console.log(chat);

  const lastMessage =
    chat?.messages?.length > 0 && chat?.messages[chat?.messages?.length - 1];

  const router = useRouter();

  return (
    <div
      className={`${chat._id === currentChatID ? "bg-blue-2" : ""}  chat-box`}
      onClick={() => router.push(`/chats/${chat._id}`)}
    >
      <div className="chat-info">
        {chat?.isGroup ? (
          <img
            src={chat?.groupPhoto || "/group.png"}
            alt="GROUP PHOTO"
            className="profilePhoto"
          />
        ) : (
          <img
            src={otherMember[0]?.profileImage || "user.jpeg"}
            alt="PROFILE PHOTO"
            className="profilePhoto"
          />
        )}

        {/* // NAME OF GROUP - */}
        <div className="flex flex-col gap-1">
          {chat?.isGroup ? (
            <h3 className="text-base-bold">{chat?.groupName}</h3>
          ) : (
            <h3 className="text-base-bold">{otherMember[0]?.username}</h3>
          )}

          {!lastMessage && <p className="text-small-bold">Started a Chat</p>}
        </div>
      </div>

      <div>
        <p className="text-base-light text-grey-3">
          {!lastMessage && format(new Date(chat?.createdAt), "p")}
          {/* DATE */}
        </p>
      </div>
    </div>
  );
};

export default ChatBox;
