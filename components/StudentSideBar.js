"use client";
import React, { useState } from "react";
import {
  Home,
  Users,
  LogOut,
  Menu,
  X,
  Key,
  CalendarCheck,
  ScanLine,
} from "lucide-react";
import Link from "next/link";

const StudentSideBar = () => {
  const [attendanceOpen, setAttendanceOpen] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("isStudentLoggedIn");
    localStorage.removeItem("studentAuthToken");
    window.location.href = "/student/login";
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className={`md:hidden fixed top-4 left-4 z-50 bg-green-800 hover:bg-green-700 p-2 rounded-lg shadow-lg transition-all duration-300 ${
          sidebarOpen ? "rotate-90" : ""
        }`}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Menu className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-green-900 to-green-800 text-white flex flex-col
          transform transition-all duration-300 ease-in-out z-40
          ${sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
          md:translate-x-0 md:static md:h-screen
          border-r border-green-700
        `}
      >
        {/* Sidebar Header */}
        <div className="p-6 pb-4 flex items-center justify-between border-b border-green-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-6 h-6 text-green-900"
              >
                <path
                  fill="currentColor"
                  d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold">PresencePal</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-green-200 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 p-4 flex-1">
          {/* Dashboard */}
          <Link
            href="/student/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-green-700 hover:bg-opacity-50 transition-all group"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="p-2 bg-green-700 rounded-lg group-hover:bg-yellow-500 group-hover:text-green-900 transition">
              <Home className="w-5 h-5" />
            </div>
            <span className="font-medium">Dashboard</span>
          </Link>

          {/* Change Password */}
          <Link
            href="/student/change-password"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-green-700 hover:bg-opacity-50 transition-all group"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="p-2 bg-green-700 rounded-lg group-hover:bg-yellow-500 group-hover:text-green-900 transition">
              <Key className="w-5 h-5" />
            </div>
            <span className="font-medium">Change Password</span>
          </Link>

          {/* Attendance Section */}
          <div className="mt-2">
            <div
              onClick={() => setAttendanceOpen(!attendanceOpen)}
              className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg hover:bg-green-700 hover:bg-opacity-50 cursor-pointer transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-700 rounded-lg">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <span className="font-medium">Attendance</span>
              </div>
              <svg
                className={`w-5 h-5 transform transition-transform duration-200 ${
                  attendanceOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            {attendanceOpen && (
              <div className="ml-4 pl-8 mt-1 space-y-1 border-l-2 border-green-700">
                <Link
                  href="/student/scan"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-green-700 hover:bg-opacity-30 transition-all group"
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className="p-1">
                    <ScanLine className="w-4 h-4 text-green-300 group-hover:text-yellow-400" />
                  </div>
                  <span>Mark Attendance</span>
                </Link>
                <Link
                  href="/student/view-attendance"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-green-700 hover:bg-opacity-30 transition-all group"
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className="p-1">
                    <Users className="w-4 h-4 text-green-300 group-hover:text-yellow-400" />
                  </div>
                  <span>View Attendance</span>
                </Link>
              </div>
            )}
          </div>

          {/* Spacer */}
          <div className="flex-1"></div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 mt-4 rounded-lg hover:bg-red-900 hover:bg-opacity-50 transition-all group"
          >
            <div className="p-2 bg-red-900 rounded-lg group-hover:bg-red-700 transition">
              <LogOut className="w-5 h-5" />
            </div>
            <span className="font-medium">Logout</span>
          </button>
        </nav>

        {/* Footer */}
        <div className="p-4 pt-3 border-t border-green-700 text-xs text-green-300 text-center">
          <p>
            Powered by{" "}
            <span className="font-bold text-yellow-400">Amoud University</span>
          </p>
          <p className="mt-1">
            © {new Date().getFullYear()} All Rights Reserved
          </p>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default StudentSideBar;
