"use client";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/sideBar';
import Header from '@/components/Header';

const baseUrl = 'https://presencepalbackend-1.onrender.com';

const TeacherDashboard = () => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loggedIn = localStorage.getItem('loggedIn');
        const email = localStorage.getItem('email');
        if (loggedIn && email) {
            setUser({ email });
            // Fetch courses for this teacher
            fetchCourses(email);
        } else {
            router.push('/teacher/login');
        }
    }, [router]);

    const fetchCourses = async (email) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${baseUrl}/api/teacher/courses?email=${email}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setCourses(data.data || []);
            } else {
                setCourses([]);
            }
        } catch (error) {
            setCourses([]);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('email');
        router.push('/teacher/login');
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1">
                <Header title="Teacher Dashboard" />
                <div className="p-8 bg-gray-50 min-h-screen">
                    <h1 className="text-3xl font-bold mb-4">Teacher Dashboard</h1>
                    {user ? (
                        <>
                            <p className="mb-4">Welcome, {user.email}!</p>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 mb-6"
                            >
                                Logout
                            </button>
                            <div>
                                <h2 className="text-xl font-semibold mb-2">Your Courses</h2>
                                {loading ? (
                                    <p>Loading courses...</p>
                                ) : courses.length > 0 ? (
                                    <ul className="list-disc pl-5">
                                        {courses.map((course) => (
                                            <li key={course.id || course._id} className="mb-1">
                                                {course.name}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No courses found.</p>
                                )}
                            </div>
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