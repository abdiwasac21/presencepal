"use client";
import React from "react";

const Header = ({ title, searchValue, onSearchChange, user }) => {
  return (
    <header className="bg-gradient-to-r from-blue-900 to-blue-800 shadow-lg p-4 text-white">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Logo and Title */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-blue-900 font-bold text-lg shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-6 h-6"
              fill="currentColor"
            >
              <path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>

        {/* Search Bar */}
        {typeof searchValue !== "undefined" &&
          typeof onSearchChange === "function" && (
            <div className="flex-1 w-full md:max-w-xl mx-0 md:mx-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchValue}
                  onChange={onSearchChange}
                  className="w-full px-4 pl-10 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-blue-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white placeholder-blue-200"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-blue-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          )}

        {/* User Controls */}
        <div className="flex gap-4 items-center w-full md:w-auto justify-end">
          {/* Notification Icon */}
          <button className="relative p-2 rounded-full hover:bg-blue-700 transition-all">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-yellow-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-blue-900"></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
