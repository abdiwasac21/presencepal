"use client";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/sideBar';
import Header from '@/components/Header';

const TeacherDashboard = () => {
    const router = useRouter();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loggedIn = localStorage.getItem('loggedIn');
        const email = localStorage.getItem('email');
        if (loggedIn && email) {
            setUser({ email });
        } else {
            router.push('/teacher/login');
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('email');
        router.push('/teacher/login');
    };

    return (
        <div className="flex">
            {/* Sidebar on the left */}
            <Sidebar />
            {/* Main dashboard content */}
            <div className="flex-1">
                <Header title="Teacher Dashboard" />
                <div className="p-8 bg-gray-50 min-h-screen">
                    <h1 className="text-3xl font-bold mb-4">Teacher Dashboard</h1>
                    {user ? (
                        <>
                            <p className="mb-4">Welcome, {user.email}!</p>
                            <p>Name: {user.username}</p>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <p>Please log in first.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
