import ChatList from "@components/ChatList";
import ContactList from "@components/ContactList";

const Chats = () => {
  return (
    <div className="main-container">
      <div className="w-full md:w-[50%] lg:w-[35%]">
        <ChatList />
      </div>
      <div className="hidden md:block lg:block md:w-[50%] lg:w-[65%]">
        <ContactList />
      </div>
    </div>
  );
};

export default Chats;
