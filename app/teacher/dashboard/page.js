"use client";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/TeacherSidebar';
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
        const token = localStorage.getItem('authToken');
        if (!loggedIn || !token) {
            router.push('/teacher/login');
            return;
        }

        if (loggedIn && email) {
            setUser({ email });
            fetchCourses(email, token);
        } else {
            router.push('/teacher/login');
        }
    }, [router]);

    const fetchCourses = async (email, token) => {
        try {
            const response = await fetch(`${baseUrl}/api/teacher/courses/by-email/${email}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 401) {
                localStorage.removeItem('loggedIn');
                localStorage.removeItem('email');
                localStorage.removeItem('authToken');
                router.push('/teacher/login');
                return;
            }
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
                                <h2 className="text-xl font-semibold mb-4">Your Courses</h2>
                                {loading ? (
                                    <p>Loading courses...</p>
                                ) : courses.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                        {courses.map((course) => (
                                            <div
                                                key={course.id || course._id}
                                                className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between hover:shadow-xl transition-shadow"
                                            >
                                                <h3 className="text-lg font-bold mb-2 text-blue-700">{course.name}</h3>
                                                <p className="text-gray-600 mb-4">{course.description || "No description available."}</p>
                                                <div className="mt-auto">
                                                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                                        {course.code || "No Code"}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
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