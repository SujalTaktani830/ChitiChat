"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Loader from "./Loader";
import { CheckCircle, RadioButtonUnchecked } from "@mui/icons-material";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const ContactList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [ContactList, setContactList] = useState([]);
  const [searchContact, setSearchContact] = useState("");

  const { data: session } = useSession();
  const currentUser = session?.user;

  // GET CONTACTS & SEARCHCONTACT API-
  const getContacts = async () => {
    try {
      // console.log(searchContact);
      const res = await fetch(
        searchContact !== ""
          ? `/api/users/searchContact/${searchContact}`
          : "/api/users"
      );
      // const res = await fetch("/api/users");

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to fetch contacts");
      }

      const data = await res.json();
      // console.log(data);

      if (res.error) {
        toast.error(error.message || "Something went wrong");
      }

      setContactList(
        data.length > 0 &&
          data?.filter((contact) => {
            return contact._id !== currentUser.id;
          })
      );
      setIsLoading(false);
      // console.log(ContactList);
    } catch (err) {
      toast.error("Something went wrong");
      console.log("Error occured - ", err);
    }
  };

  // USEEFFECT RELATED TO GETCONTACTS -
  useEffect(() => {
    if (currentUser) getContacts();
  }, [currentUser, searchContact]);

  // SELECT CONTACTS TO START CHAT/GROUP -
  const [selectedContacts, setSelectedContacts] = useState([]);

  const isGroup = selectedContacts.length > 1;

  const handleSelect = (contact) => {
    if (selectedContacts.includes(contact)) {
      setSelectedContacts((prevSelectedContact) =>
        prevSelectedContact.filter((c) => c !== contact)
      );
    } else {
      setSelectedContacts((prevSelectedContact) => [
        ...prevSelectedContact,
        contact,
      ]);
    }
  };

  const router = useRouter();

  // CREATE CHAT ROOM VIA API CALL
  const createChat = async () => {
    try {
      // console.log(currentUser.id, selectedContacts, isGroup, groupName);
      // console.log("CURRENT USER ", currentUser);
      const res = await fetch("/api/chats", {
        method: "POST",
        body: JSON.stringify({
          currentUserID: currentUser.id,
          members: selectedContacts.map((contact) => contact._id),
          isGroup,
          groupName,
        }),
      });

      const chat = await res.json();
      console.log(res.ok);
      console.log(chat);

      if (res.ok) {
        // Check if the chat already exists and display the custom message
        if (chat.message === "Chat already exists") {
          toast.error(chat.message);
        } else {
          router.push(`/chats/${chat._id}`);
          toast.success("Chat created successfully");
        }
      } else {
        toast.error(chat.message || "Something went wrong");
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };

  // ADD GROUP CHAT DETAILS -
  const [groupName, setGroupName] = useState("");

  return (
    <div className="create-chat-container">
      <input
        type="search"
        placeholder="Search contact(s)"
        className="input-search"
        value={searchContact}
        onChange={(e) => setSearchContact(e.target.value)}
      />

      {isLoading ? (
        <Loader />
      ) : (
        <div className="contact-bar">
          <div className="contact-list">
            <p className="text-body-bold">Select or Deselect</p>
            {ContactList.length > 0 &&
              ContactList.map((user) => (
                <div
                  className="contact"
                  key={user?._id}
                  onClick={() => handleSelect(user)}
                >
                  {selectedContacts.find((item) => item === user) ? (
                    <CheckCircle sx={{ color: "green" }} />
                  ) : (
                    <RadioButtonUnchecked />
                  )}
                  <img
                    src={user?.profileImage || "/user.jpeg"}
                    alt="USER PROFILE"
                    className="profilePhoto"
                  />
                  <p className="text-base-bold">{user?.username}</p>
                </div>
              ))}
          </div>
          <div className="create-chat">
            {isGroup && (
              <>
                <div className="flex flex-col gap-3">
                  <p className="text-body-bold">Group Chat Name</p>
                  <input
                    required
                    type="text"
                    placeholder="Group Name"
                    className="input-group-name"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <p className="text-body-bold">Members</p>
                  <div className="flex flex-wrap gap-3">
                    {selectedContacts.map((contact) => (
                      <p className="selected-contact" key={contact?.username}>
                        {contact?.username}
                      </p>
                    ))}
                  </div>
                </div>
              </>
            )}
            <button className="btn" onClick={createChat}>
              START A NEW CHAT
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactList;
