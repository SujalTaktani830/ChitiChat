"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Loader from "./Loader";
import { toast } from "react-hot-toast";
import { AddPhotoAlternate, Send } from "@mui/icons-material";
import Link from "next/link";
import { CldUploadButton } from "next-cloudinary";

const ChatDetails = ({ chatID }) => {
  const [loading, setLoading] = useState(true);
  const [chat, setChat] = useState({});
  const [otherMembers, setOtherMembers] = useState([]);

  /// HANDLE SENDING MESSAGE INPUT -
  const [text, setText] = useState("");

  const { data: session } = useSession();
  const currentUser = session?.user;

  // GET THE CHAT DETAILS
  const getChatDetails = async () => {
    try {
      const res = await fetch(`/api/chats/${chatID}`);

      if (!res.ok) {
        toast.error("Error occured while fetching details");
        console.log(error);
      }

      const data = await res.json();

      setChat(data);

      setLoading(false);
      setOtherMembers(
        data?.members.filter((member) => member._id !== currentUser.id)
      );
    } catch (error) {
      toast.error("Error occured while fetching details");
      console.log(error);
    }
  };

  // POST THE MESSAGE
  const sendText = async () => {
    try {
      console.log(chatID, text, currentUser.id);
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatID,
          currentUserID: currentUser.id,
          text: text,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setText("");
      }

      console.log(data);
    } catch (error) {
      console.log("SENDTEXT - ", error);
    }
  };

  const sendPhoto = async (result) => {
    try {
      console.log(chatID, text, currentUser.id);
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatID,
          currentUserID: currentUser.id,
          photo: result?.info?.secure_url,
        }),
      });

      if (res.ok) {
        setText("");
      }

      const data = await res.json();

      console.log(data);
    } catch (error) {
      console.log("SEND PHOTO -", error);
    }
  };

  useEffect(() => {
    if (currentUser && chatID) getChatDetails();
  }, [currentUser, chatID]);

  return loading ? (
    <Loader />
  ) : (
    <div className="chat-details">
      {/* CHAT HEADER */}
      <div className="chat-header">
        {chat?.isGroup ? (
          <>
            <Link
              href={`/chats/${chatID}/group-info`}
              className="flex items-center gap-4"
            >
              <img
                src={chat?.groupPhoto || "/group.png"}
                alt="GROUP PHOTO"
                className="profilePhoto"
              />
            </Link>
            <div className="text">
              <p>
                {chat?.groupName}
                <span className="text-base-medium ml-2">
                  | {chat?.members?.length - 1} members
                </span>
              </p>
            </div>
          </>
        ) : (
          <>
            <img
              src={otherMembers[0]?.profileImage || "/user.jpeg"}
              alt="PROFILE IMAGE"
              className="profilePhoto"
            />
            <div className="text">
              <p>{otherMembers[0]?.username}</p>
            </div>
          </>
        )}
      </div>

      {/* CHAT BODY */}
      <div className="chat-body"></div>

      {/* SEND MESSAGE INPUT TILE */}
      <div className="send-message">
        <div className="prepare-message">
          <CldUploadButton
            options={{ maxFiles: 1 }}
            onSuccess={sendPhoto}
            uploadPreset="qafrvyyl"
          >
            <AddPhotoAlternate
              sx={{ fontSise: "25px", color: "#737373", cursor: "pointer" }}
            />
          </CldUploadButton>
          <input
            className="message-input-field"
            type="text"
            placeholder="Enter your message"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
        </div>
        <div className="send-icon" onClick={sendText}>
          <Send />
        </div>
      </div>
    </div>
  );
};

export default ChatDetails;
