import React, { useState } from 'react';
import { Home, Settings, LogOut, ChevronDown, ChevronUp, CheckSquare, Users, Menu } from 'lucide-react';
import Link from 'next/link';

const handleLogout = () => {
    localStorage.removeItem("isTeacherLoggedIn");
    localStorage.removeItem("authToken");
    window.location.href = "/teacher/login";
}

const Sidebar = () => {
    const [attendanceOpen, setAttendanceOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <>
            {/* Mobile Hamburger */}
            <button
                className="md:hidden fixed top-4 left-4 z-50 bg-gray-800 p-2 rounded-md"
                onClick={() => setSidebarOpen((prev) => !prev)}
                aria-label="Toggle sidebar"
            >
                <Menu className="w-6 h-6 text-white" />
            </button>
            {/* Sidebar */}
            <div
                className={`
                    fixed top-0 left-0 h-screen w-64 bg-gray-800 text-white flex flex-col p-4 z-40
                    transition-transform duration-300
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    md:translate-x-0 md:static md:h-screen
                `}
            >
                <h1 className="text-2xl font-bold mb-6">PresencePal</h1>
                <nav className="flex flex-col gap-4 flex-1">
                    <Link href="/teacher/dashboard" className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-700">
                        <Home className="w-5 h-5" /> Dashboard
                    </Link>
                    <Link href="/teacher/courses" className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-700">
                        <Settings className="w-5 h-5" /> Course
                    </Link>
                    <Link href="/teacher/class" className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-700">
                        <Settings className="w-5 h-5" /> Class
                    </Link>
                    {/* Attendance Dropdown */}
                    <div>
                        <button
                            className="flex items-center gap-2 p-2 rounded-md w-full hover:bg-gray-700 focus:outline-none"
                            onClick={() => setAttendanceOpen((prev) => !prev)}
                        >
                            <CheckSquare className="w-5 h-5" />
                            Attendance
                            {attendanceOpen ? <ChevronUp className="w-4 h-4 ml-auto" /> : <ChevronDown className="w-4 h-4 ml-auto" />}
                        </button>
                        {attendanceOpen && (
                            <div className="ml-6 flex flex-col gap-2 mt-1">
                                <Link href="/teacher/start-session" className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-700 text-sm">
                                    <CheckSquare className="w-4 h-4" /> Start Session
                                </Link>
                                <Link href="/teacher/view-sessions" className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-700 text-sm">
                                    <Users className="w-4 h-4" /> See All Classrooms
                                </Link>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 p-2 mt-auto text-red-400 hover:bg-gray-700 rounded-md"
                    >
                        <LogOut className="w-5 h-5" /> Logout
                    </button>
                </nav>
            </div>
            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </>
    );
};

export default Sidebar;