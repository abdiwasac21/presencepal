"use client";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const Dashboard = () => {
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="p-8 bg-white rounded-lg shadow-md">
                <h1 className="text-3xl font-bold mb-4">Teacher Dashboard</h1>
                {user ? (
                    <>
                        <p className="mb-4">Welcome, {user.email}!</p>
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
    );
};

export default Dashboard;

