"use client";

import React from "react";
import Link from "next/link";
import { FiHome } from "react-icons/fi";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { PiUsersThree } from "react-icons/pi";
import { GrShop } from "react-icons/gr";
import { TbShoppingCart } from "react-icons/tb";
import { useSession } from "next-auth/react";

const SidebarItem = ({ icon, children, href }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={clsx(
        "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200",
        isActive
          ? "bg-primary text-white"
          : "text-foreground hover:bg-primary/10"
      )}
    >
      {icon}
      <span className="text-sm font-medium">{children}</span>
    </Link>
  );
};

const SidebarComponent = () => {
  const session = useSession();
  const isAdmin = session?.data?.user?.data?.role === "admin";
  return (
    <aside className="h-screen w-64 bg-default-100 p-6 shadow-md border-r">
      <h1 className="text-xl font-bold mb-6">Dashboard</h1>
      <nav className="flex flex-col gap-2">
        <SidebarItem icon={<FiHome size={18} />} href="/">
          Dashboard
        </SidebarItem>
        {isAdmin && (
          <SidebarItem
            icon={<MdOutlineProductionQuantityLimits size={18} />}
            href="/product"
          >
            Product
          </SidebarItem>
        )}
        <SidebarItem icon={<PiUsersThree size={18} />} href="/customer">
          Customer
        </SidebarItem>
        <SidebarItem icon={<GrShop size={18} />} href="/sales">
          Sales
        </SidebarItem>
        {isAdmin && (
          <SidebarItem icon={<TbShoppingCart size={18} />} href="/purchase">
            Purchase
          </SidebarItem>
        )}
      </nav>
    </aside>
  );
};

export default SidebarComponent;
