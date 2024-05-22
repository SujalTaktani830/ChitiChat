// "use client";

// import { format } from "date-fns";
// import { useRouter } from "next/navigation";

// const ChatBox = ({ chat, currentUser, currentChatID }) => {
//   // console.log(currentUser);

//   const otherMember = chat?.members?.filter(
//     (member) => member._id !== currentUser.id
//   );

//   // console.log(otherMember);
//   console.log(chat);

//   const lastMessage =
//     chat?.messages?.length > 0 && chat?.messages[chat?.messages?.length - 1];

//   console.log(lastMessage?.text);

//   const seen = lastMessage?.seenBy?.find((member) => {
//     console.log(member);
//     return member._id === currentUser.id;
//   });

//   console.log(seen);

//   const router = useRouter();

//   return (
//     <div
//       className={`${chat._id === currentChatID ? "bg-blue-2" : ""}  chat-box`}
//       onClick={() => router.push(`/chats/${chat._id}`)}
//     >
//       <div className="chat-info">
//         {chat?.isGroup ? (
//           <img
//             src={chat?.groupPhoto || "/group.png"}
//             alt="GROUP PHOTO"
//             className="profilePhoto"
//           />
//         ) : (
//           <img
//             src={otherMember[0]?.profileImage || "user.jpeg"}
//             alt="PROFILE PHOTO"
//             className="profilePhoto"
//           />
//         )}

//         {/* // NAME OF GROUP - */}
//         <div className="flex flex-col gap-1">
//           {chat?.isGroup ? (
//             <h3 className="text-base-bold">{chat?.groupName}</h3>
//           ) : (
//             <h3 className="text-base-bold">{otherMember[0]?.username}</h3>
//           )}

//           {!lastMessage && <p className="text-small-bold">Started a Chat</p>}

//           {lastMessage && lastMessage?.photo ? (
//             lastMessage?.sender?.id === currentUser.id ? (
//               <p className="text-small-medium text-gray-3">
//                 You have sent a photo
//               </p>
//             ) : (
//               <p className="text-small-medium text-gray-3">Recieved a photo</p>
//             )
//           ) : (
//             <p className="text-small-medium">
//               {lastMessage?.sender?.id === currentUser.id
//                 ? "You: "
//                 : `${lastMessage?.sender}: `}
//               {lastMessage?.text}
//             </p>
//           )}
//         </div>
//       </div>

//       <div>
//         <p className="text-base-light text-grey-3">
//           {!lastMessage && format(new Date(chat?.createdAt), "p")}
//           {/* DATE */}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default ChatBox;

"use client";

import { format } from "date-fns";
import { useRouter } from "next/navigation";

const ChatBox = ({ chat, currentUser, currentChatID }) => {
  console.log(chat?.messages[0]);
  console.log(chat?.messages);


  const router = useRouter();

  if (!chat || !currentUser) return null; // Handle undefined chat or currentUser

  const otherMember = chat.members.filter(
    (member) => member._id !== currentUser.id
  )[0]; // Get the first other member

  const lastMessage =
    chat.messages.length > 0 ? chat.messages[chat.messages.length - 1] : null;

  // const seen = lastMessage?.seenBy.find(
  //   (member) => member._id === currentUser.id
  // );

  return (
    <div
      className={`${chat._id === currentChatID ? "bg-blue-2" : ""} chat-box`}
      onClick={() => router.push(`/chats/${chat._id}`)}
    >
      <div className="chat-info">
        {chat.isGroup ? (
          <img
            src={chat.groupPhoto || "/group.png"}
            alt="GROUP PHOTO"
            className="profilePhoto"
          />
        ) : (
          <img
            src={otherMember?.profileImage || "user.jpeg"}
            alt="PROFILE PHOTO"
            className="profilePhoto"
          />
        )}

        <div className="flex flex-col gap-1">
          {chat.isGroup ? (
            <h3 className="text-base-bold">{chat.groupName}</h3>
          ) : (
            <h3 className="text-base-bold">{otherMember?.username}</h3>
          )}

          {!lastMessage && <p className="text-small-bold">Started a Chat</p>}

          {lastMessage && lastMessage.photos ? (
            lastMessage.sender._id === currentUser.id ? (
              <p className="text-small-medium text-gray-3">
                You have sent a photo
              </p>
            ) : (
              <p className="text-small-medium text-gray-3">Received a photo</p>
            )
          ) : (
            <p className="text-small-medium">
              {lastMessage?.sender?._id === currentUser.id
                ? "You: "
                : `${lastMessage?.sender?.username}: `}
              {lastMessage?.text}
            </p>
          )}
        </div>
      </div>

      <div>
        <p className="text-base-light text-grey-3">
          {!lastMessage && format(new Date(chat?.createdAt), "p")}
          {/* {lastMessage && format(new Date(Date.now), "p")} */}
        </p>
      </div>
    </div>
  );
};

export default ChatBox;
