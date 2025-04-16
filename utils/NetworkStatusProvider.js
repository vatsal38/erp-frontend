"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const NetworkStatusProvider = ({ children }) => {
  const [isOnline, setNetwork] = useState(
    typeof window !== "undefined" ? window.navigator.onLine : true
  );

  useEffect(() => {
    const updateNetwork = () => {
      setNetwork(window.navigator.onLine);
    };

    window.addEventListener("offline", updateNetwork);
    window.addEventListener("online", updateNetwork);

    return () => {
      window.removeEventListener("offline", updateNetwork);
      window.removeEventListener("online", updateNetwork);
    };
  }, []);

  useEffect(() => {
    if (!isOnline) {
      console.log("Offline now");
      toast.error("Internet connection is not available....");
    } else {
      console.log("Online now");
    }
  }, [isOnline]);

  return (
    <div className={`bg-blue-100 text-gray-800 dark:text-white`}>
      <main>{children}</main>
    </div>
  );
};

export default NetworkStatusProvider;
