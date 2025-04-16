"use client";

import { HeroUIProvider } from "@heroui/react";
import { SessionProvider } from "next-auth/react";
import NextTopLoader from "nextjs-toploader";
import React from "react";

const Layout = ({ children }) => {
  return (
    <SessionProvider>
      <HeroUIProvider>
        {" "}
        <NextTopLoader showSpinner={false} />
        {children}
      </HeroUIProvider>
    </SessionProvider>
  );
};

export default Layout;
