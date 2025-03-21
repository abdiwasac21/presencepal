import React from 'react';
import { FaHome, FaUser, FaSignOutAlt } from 'react-icons/fa';

const SideBar = () => {
    return (
        <div className="h-screen w-64 bg-gray-800 text-white flex flex-col">
            <div className="p-4 text-2xl font-bold border-b border-gray-700">
                PresencePal
            </div>
            <nav className="flex-1 p-4">
                <ul className="space-y-4">
                    <li className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded">
                        <FaHome />
                        <span>Dashboard</span>
                    </li>
                    <li className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded">
                        <FaUser />
                        <span>Profile</span>
                    </li>
                </ul>
            </nav>
            <div className="p-4 border-t border-gray-700">
                <button className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded w-full">
                    <FaSignOutAlt />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default SideBar;