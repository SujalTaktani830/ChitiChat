"use client";

import { Logout } from "@mui/icons-material";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const { data: session } = useSession();
  console.log(session);
  const pathName = usePathname();

  const handleLogout = async () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <div className="topbar">
      <Link href={session ? "/chats" : "/"}>
        <h2>ChitChat</h2>
      </Link>

      {!session?.user?.username ? (
        <div className="menu">
          <Link
            href={"/login"}
            className="hover:cursor-pointer hover:text-blue-3"
          >
            Login
          </Link>
          <Link
            className="text-purple-2 px-3 py-2 shadow-md rounded-md hover:cursor-pointer bg-blue-3"
            href={"/register"}
          >
            SignUp
          </Link>
        </div>
      ) : (
        <div className="menu">
          <Link
            href="/chats"
            className={`${pathName === "/chats" ? "text-red-1" : ""}`}
          >
            Chats
          </Link>
          <Link
            href="/contacts"
            className={`${pathName === "/contacts" ? "text-red-1" : ""}`}
          >
            Contacts
          </Link>

          <Logout
            sx={{ color: "#737373", cursor: "pointer" }}
            onClick={handleLogout}
          />

          {/* <Link href={`profile`}> */}
          <Link href={`profile/${session?.user.username}`}>
            <img
              src={session?.user.profileImage || "/user.jpeg"}
              alt="USER PROFILE"
              className="profilePhoto"
            />
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
