'use client';
import React from 'react';

const Header = ({ title }) => {
    return (
        <header className="bg-white shadow-md p-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">{title}</h1>
                <div className="flex gap-4">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        Notifications
                    </button>
                    <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
                        Profile
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
