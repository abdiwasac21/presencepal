import React, { useState } from 'react';
import { Home, Users, LogOut, Menu } from 'lucide-react';
import Link from 'next/link';

const StudentSideBar = () => {
    const [attendanceOpen, setAttendanceOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("isStudentLoggedIn");
        localStorage.removeItem("studentAuthToken");
        window.location.href = "/student/login";
    };

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
                                    href="/student/view-attendance"
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
            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </>
    )
};

export default StudentSideBar;