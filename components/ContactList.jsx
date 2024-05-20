"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Loader from "./Loader";
import { RadioButtonUnchecked } from "@mui/icons-material";
import toast from "react-hot-toast";

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

  useEffect(() => {
    if (currentUser) getContacts();
  }, [currentUser, searchContact]);

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
              ContactList.map((user, index) => (
                <div className="contact" key={user?._id}>
                  <RadioButtonUnchecked />
                  <img
                    src={user?.profileImage || "/user.jpeg"}
                    alt="USER PROFILE"
                    className="profilePhoto"
                  />
                  <p className="text-base-bold">{user?.username}</p>
                </div>
              ))}
          </div>
          <div className="create-chat -mt-20 mb-10">
            <button className="btn">START A NEW CHAT</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactList;
