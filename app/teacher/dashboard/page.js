"use client";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/TeacherSidebar';
import Header from '@/components/Header';

const baseUrl = 'http://localhost:80';

const TeacherDashboard = () => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [courses, setCourses] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [today, setToday] = useState(""); // For client-only date

    useEffect(() => {
        setToday(new Date().toLocaleDateString());
    }, []);

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
            fetchStudents(token);
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

    const fetchStudents = async (token) => {
        try {
            const response = await fetch(`${baseUrl}/api/teacher/all-my-students`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setStudents(data.data || []);
            } else {
                setStudents([]);
            }
        } catch (error) {
            setStudents([]);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('email');
        localStorage.removeItem('authToken');
        router.push('/teacher/login');
    };

    // Dashboard summary logic
    const totalCourses = courses.length;
    const totalStudents = students.length;

    // Recent courses (last 3)
    const recentCourses = [...courses].reverse().slice(0, 3);

    // Filter courses based on search input
    const filteredCourses = courses.filter(course =>
        course.name?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header 
                    title="Teacher Dashboard"
                    searchValue={search}
                    onSearchChange={e => setSearch(e.target.value)}
                />
                <main className="flex-1 p-8">
                    <div className="max-w-5xl mx-auto">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                            <div>
                                <h1 className="text-3xl font-extrabold text-blue-800 mb-2">
                                    Welcome{user ? `, ${user.email}` : ""}!
                                </h1>
                                <p className="text-gray-500">Manage your courses and sessions easily.</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="mt-4 md:mt-0 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold shadow transition"
                            >
                                Logout
                            </button>
                        </div>

                        {/* Dashboard summary */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center border border-blue-100">
                                <span className="text-3xl text-blue-600 mb-2">📚</span>
                                <span className="text-2xl font-bold text-blue-800">{totalCourses}</span>
                                <span className="text-gray-500 text-sm">Courses</span>
                            </div>
                            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center border border-blue-100">
                                <span className="text-3xl text-green-600 mb-2">👨‍🎓</span>
                                <span className="text-2xl font-bold text-green-700">{totalStudents}</span>
                                <span className="text-gray-500 text-sm">Total Students</span>
                            </div>
                            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center border border-blue-100">
                                <span className="text-3xl text-indigo-600 mb-2">🕒</span>
                                <span className="text-2xl font-bold text-indigo-700">{today}</span>
                                <span className="text-gray-500 text-sm">Today</span>
                            </div>
                        </div>

                        {/* Recent courses */}
                        <div className="mb-10">
                            <h2 className="text-xl font-bold text-blue-700 mb-4">Recent Courses</h2>
                            {recentCourses.length === 0 ? (
                                <div className="text-gray-400 italic">No recent courses.</div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                    {recentCourses.map((course, idx) => (
                                        <div
                                            key={course._id || idx}
                                            className="bg-white shadow rounded-lg p-4 flex flex-col border border-blue-50"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-xs font-bold shadow">
                                                    {course.code || "No Code"}
                                                </span>
                                                <span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full font-semibold">
                                                    {course.studentsCount || course.students?.length || 0} Students
                                                </span>
                                            </div>
                                            <h3 className="text-base font-bold text-blue-700 mb-1">{course.name}</h3>
                                            <p className="text-gray-600 text-xs flex-1">{course.description || "No description available."}</p>
                                            <button
                                                className="mt-3 bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-1.5 rounded-full font-semibold shadow transition"
                                                onClick={() => router.push(`/teacher/courses/${course._id || course.id}`)}
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* All courses with search */}
                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold text-blue-700">All Courses</h2>
                                <input
                                    type="text"
                                    placeholder="Search courses..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="border border-blue-200 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                                />
                            </div>
                            {loading ? (
                                <div className="flex justify-center items-center h-32">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                                    <span className="ml-4 text-blue-700 font-semibold">Loading courses...</span>
                                </div>
                            ) : filteredCourses.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                                    {filteredCourses.map((course, idx) => (
                                        <div
                                            key={course._id || course.id || idx}
                                            className="bg-white shadow-lg rounded-xl p-6 flex flex-col hover:shadow-2xl transition-shadow border border-blue-100 relative"
                                        >
                                            <div className="absolute -top-4 -right-4 bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-xs font-bold shadow">
                                                {course.code || "No Code"}
                                            </div>
                                            <h3 className="text-lg font-bold mb-2 text-blue-700">{course.name}</h3>
                                            <p className="text-gray-600 mb-4 flex-1">{course.description || "No description available."}</p>
                                            <div className="flex items-center justify-between mt-4">
                                                <span className="inline-block bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full font-semibold">
                                                    {course.studentsCount ? `${course.studentsCount} Students` : 
                                                     course.students?.length ? `${course.students.length} Students` : "No Students"}
                                                </span>
                                                <button
                                                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-1.5 rounded-full font-semibold shadow transition"
                                                    onClick={() => router.push(`/teacher/courses/${course._id || course.id}`)}
                                                >
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                                    <span className="text-5xl mb-2">📚</span>
                                    <p className="text-lg">No courses found.</p>
                                </div>
                            )}
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default TeacherDashboard;