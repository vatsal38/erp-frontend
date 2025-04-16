"use client";

import React from "react";
import { Navbar, NavbarContent, User } from "@heroui/react";
import Link from "next/link";
import { IoMdLogOut } from "react-icons/io";
import { signOut } from "next-auth/react";

const NavbarComponent = () => {
  return (
    <Navbar isBordered>
      <NavbarContent justify="end">
        <User
          avatarProps={{
            src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
          }}
        />
        <Link
          href={"/"}
          onClick={() => signOut()}
          className="flex items-center gap-2"
        >
          <IoMdLogOut size={28} />
        </Link>
      </NavbarContent>
    </Navbar>
  );
};

export default NavbarComponent;
