"use client";

import { Logout } from "@mui/icons-material";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const { data: session } = useSession();
  const pathName = usePathname();
  console.log(session)

  const handleLogout = async () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <div className="topbar">
      <Link href={`{${session ? "/" : "/chats"}`}>
        <h2>ChitChat</h2>
      </Link>

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
      </div>
    </div>
  );
};

export default Navbar;
