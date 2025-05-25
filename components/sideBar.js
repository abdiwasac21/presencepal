import React, { useState } from "react";
import { Home, Users, Settings, LogOut, Menu, X } from "lucide-react";
import Link from "next/link";

const handleLogout = () => {
  localStorage.removeItem("isAdminLoggedIn");
  localStorage.removeItem("authToken");
  window.location.href = "/teacher/login";
};

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger for small screens */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-green-800 text-white p-2 rounded-md shadow"
        onClick={() => setOpen(true)}
        aria-label="Open sidebar"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-green bg-opacity-40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
                    fixed top-0 left-0 h-full w-64 bg-green-800 text-white flex flex-col p-4 z-50
                    transition-transform duration-300
                    ${open ? "translate-x-0" : "-translate-x-full"}
                    md:static md:translate-x-0 md:h-screen
                `}
      >
        {/* Close button for mobile */}
        <div className="flex items-center justify-between mb-6 md:hidden">
          <h1 className="text-2xl font-bold">PresencePal</h1>
          <button
            className="text-white"
            onClick={() => setOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        {/* Title for desktop */}
        <h1 className="text-2xl font-bold mb-6 hidden md:block">PresencePal</h1>
        <nav className="flex flex-col gap-4">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 p-2 rounded-md hover:bg-green-700"
          >
            <Home className="w-5 h-5" /> Dashboard
          </Link>
          <Link
            href="/admin/register"
            className="flex items-center gap-2 p-2 rounded-md hover:bg-green-700"
          >
            <Users className="w-5 h-5" /> Register
          </Link>
          <Link
            href="/admin/course"
            className="flex items-center gap-2 p-2 rounded-md hover:bg-green-700"
          >
            <Settings className="w-5 h-5" /> Course
          </Link>
          <Link
            href="/admin/class"
            className="flex items-center gap-2 p-2 rounded-md hover:bg-green-700"
          >
            <Settings className="w-5 h-5" /> Class
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 p-2 mt-auto text-red-400 hover:bg-green-700"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
