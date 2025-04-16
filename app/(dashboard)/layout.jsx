import SidebarComponent from "@/components/layout/Sidebar";
import NavbarComponent from "@/components/Navbar/Index";
import React from "react";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex">
      <SidebarComponent />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <NavbarComponent />
        <main className="p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
