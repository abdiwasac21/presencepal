import React, { useState } from 'react';
import { Home, Settings, LogOut, ChevronDown, ChevronUp, CheckSquare, Users } from 'lucide-react';
import Link from 'next/link';

const handleLogout = () => {
    localStorage.removeItem("isTeacherLoggedIn");
    localStorage.removeItem("authToken");
    window.location.href = "/teacher/login";
}

const Sidebar = () => {
    const [attendanceOpen, setAttendanceOpen] = useState(false);

    return (
        <div className="h-screen w-64 bg-gray-800 text-white flex flex-col p-4">
            <h1 className="text-2xl font-bold mb-6">PresencePal</h1>
            <nav className="flex flex-col gap-4 flex-1">
                <Link href="/teacher/dashboard" className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-700">
                    <Home className="w-5 h-5" /> Dashboard
                </Link>
                <Link href="/teacher/course" className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-700">
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
                            <Link href="/teacher/attendance/classrooms" className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-700 text-sm">
                                <Users className="w-4 h-4" /> See All Classrooms
                            </Link>
                        </div>
                    )}
                </div>
                <Link href="/teacher/logout" className="flex items-center gap-2 p-2 mt-auto text-red-400 hover:bg-gray-700">
                    <LogOut className="w-5 h-5" onClick={handleLogout}/> Logout
                </Link>
            </nav>
        </div>
    );
};

export default Sidebar;