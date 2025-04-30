import React from 'react';
import { Home, Users, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const StudentSideBar = () => {
    const [attendanceOpen, setAttendanceOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("isStudentLoggedIn");
        localStorage.removeItem("studentAuthToken");
        window.location.href = "/student/login";
    };

    return (
        <div className="h-screen w-64 bg-gray-800 text-white flex flex-col p-4">
            <h1 className="text-2xl font-bold mb-6">PresencePal</h1>
            <nav className="flex flex-col gap-4">
                <Link href="/student/dashboard" className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-700">
                    <Home className="w-5 h-5" /> Dashboard
                </Link>
                <div className="flex flex-col">
                    <div 
                        onClick={() => setAttendanceOpen(!attendanceOpen)}
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-700 cursor-pointer"
                    >
                        <Users className="w-5 h-5" /> Attendance
                    </div>
                    {attendanceOpen && (
                        <div className="flex flex-col ml-6">
                            <Link
                                href="/student/scan"
                                className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-700"
                            >
                                Mark Attendance
                            </Link>
                            <Link
                                href="/app/student/attendance/view"
                                className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-700"
                            >
                                View Attendance
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
    )
};

export default StudentSideBar;