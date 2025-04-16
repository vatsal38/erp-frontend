"use client";

import { signOut } from "next-auth/react";
import toast from "react-hot-toast";

export const handleCommonErrors = (error) => {
  if (typeof error === "string") {
    if (error === "Unauthorized" || error === "Token has expired") {
      toast.error(error);
      signOut();
    } else if (error.includes("farmer-api-9a00.onrender.com")) {
      toast.error("No internet connection....");
    } else {
      toast.error(error);
    }
    return;
  }
};
