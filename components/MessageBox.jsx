import { format } from "date-fns";

const MessageBox = ({ message, currentUser }) => {
  // console.log("MESSAGE -", message);
  // console.log("currentUser -", currentUser);

  return message?.sender?._id !== currentUser?.id ? (
    <div className="message-box">
      {/* HANDLE THE HEADER */}
      <img
        src={message?.sender?.profileImage || "user.jpeg"}
        alt="PROFILE PHOTO"
        className="profilePhoto"
      />
      <div className="message-info">
        <p className="text-small-bold">
          {message?.sender?.username} &#160; &#183; &#160;
          {/* {new Date(message?.createdAt).toLocaleString()} */}
          {format(new Date(message?.createdAt), "p")}
        </p>

        {/* HANDLE THE TEXT OR PHOTO */}
        {message?.text ? (
          <p className="message-text">{message?.text}</p>
        ) : (
          <img
            src={message?.photos}
            alt="MESSAGE IMAGE"
            className="message-photo"
          />
        )}
      </div>
    </div>
  ) : (
    <div className="message-box justify-end">
      <div className="message-info items-end">
        <p className="text-small-bold">
          {format(new Date(message?.createdAt), "p")}
        </p>

        {/* HANDLE THE TEXT OR PHOTO */}
        {message?.text ? (
          <p className="message-text-sender">{message?.text}</p>
        ) : (
          <img
            src={message?.photos}
            alt="MESSAGE IMAGE"
            className="message-photo"
          />
        )}
      </div>
    </div>
  );
};

export default MessageBox;
