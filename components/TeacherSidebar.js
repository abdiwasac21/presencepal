import React from 'react';
import { Home, Users, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';

const handleLogout = () => {
    localStorage.removeItem("isTeacherLoggedIn");
    localStorage.removeItem("authToken");
    window.location.href = "/teacher/login";
}

const Sidebar = () => {
    return (
        <div className="h-screen w-64 bg-gray-800 text-white flex flex-col p-4">
            <h1 className="text-2xl font-bold mb-6">PresencePal</h1>
            <nav className="flex flex-col gap-4">
                <Link href="/teacher/dashboard" className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-700">
                    <Home className="w-5 h-5" /> Dashboard
                </Link>
                <Link href="/teacher/course" className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-700">
                    <Settings className="w-5 h-5" /> Course
                </Link>
                <Link href="/teacher/class" className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-700">
                    <Settings className="w-5 h-5" /> Class
                </Link>
                <Link href="/teacher/logout" className="flex items-center gap-2 p-2 mt-auto text-red-400 hover:bg-gray-700">
                    <LogOut className="w-5 h-5" onClick={handleLogout}/> Logout
                </Link>
            </nav>
        </div>
    );
};



export default Sidebar;
