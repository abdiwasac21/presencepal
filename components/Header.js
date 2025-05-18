'use client';
import React from 'react';

const Header = ({ title, searchValue, onSearchChange }) => {
    return (
        <header className="bg-white shadow-md p-4">
            <div className="flex justify-between items-center">
                {/* Logo and Title */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        PP
                    </div>
                    <h1 className="text-2xl font-bold">{title}</h1>
                </div>
                {/* Search Bar */}
                <div className="flex-1 mx-8 max-w-md">
                    {(typeof searchValue !== "undefined" && typeof onSearchChange === "function") && (
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchValue}
                            onChange={onSearchChange}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    )}
                </div>
                {/* Icons */}
                <div className="flex gap-4 items-center">
                    {/* Notification Icon */}
                    <button className="relative p-2 rounded-full hover:bg-blue-100 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                    {/* Profile Icon */}
                    <button className="p-2 rounded-full hover:bg-gray-100 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A9 9 0 1112 21a9 9 0 01-6.879-3.196z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;