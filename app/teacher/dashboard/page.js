"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Sidebar from "@/components/TeacherSidebar";
import Header from "@/components/Header";

// const baseUrl = 'http://localhost:80';
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const TeacherDashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [today, setToday] = useState("");
  const [activeTab, setActiveTab] = useState("courses");
  const [stats, setStats] = useState({
    attendanceRate: 0,
    upcomingSessions: 0,
    pendingTasks: 0,
  });
  const [recentSessions, setRecentSessions] = useState([]);

  useEffect(() => {
    setToday(
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );
  }, []);

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");
    const email = localStorage.getItem("email");
    const token = localStorage.getItem("authToken");

    if (!loggedIn || !token) {
      router.push("/teacher/login");
      return;
    }

    if (loggedIn && email) {
      setUser({ email });
      fetchTeacherData(email, token);
      fetchRecentSessions(token);
    } else {
      router.push("/teacher/login");
    }
  }, [router]);

  const fetchTeacherData = async (email, token) => {
    try {
      setLoading(true);
      const [coursesRes, studentsRes, statsRes] = await Promise.all([
        fetch(`${baseUrl}/api/teacher/courses/by-email/${email}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${baseUrl}/api/teacher/all-my-students`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${baseUrl}/api/teacher/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      // Handle unauthorized responses
      if (
        [coursesRes, studentsRes, statsRes].some((res) => res.status === 401)
      ) {
        handleLogout();
        return;
      }

      // Process responses
      const coursesData = await coursesRes.json();
      const studentsData = await studentsRes.json();
      const statsData = statsRes.ok ? await statsRes.json() : {};

      setCourses(coursesData.data || []);
      setStudents(studentsData.data || []);
      setStats({
        attendanceRate: statsData.attendanceRate || 0,
        upcomingSessions: statsData.upcomingSessions || 0,
        pendingTasks: statsData.pendingTasks || 0,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch recent sessions from /api/teacher/session-started
  const fetchRecentSessions = async (token) => {
    try {
      const res = await fetch(`${baseUrl}/api/teacher/session-started`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        handleLogout();
        return;
      }
      const data = await res.json();
      // Flatten all sessions from all courses, add course info, and sort by date desc
      const allSessions = (data.courses || []).flatMap((course) =>
        (course.sessions || []).map((session) => ({
          ...session,
          courseName: course.courseName,
          courseCode: course.courseCode,
        }))
      );
      allSessions.sort((a, b) => new Date(b.date) - new Date(a.date));
      setRecentSessions(allSessions.slice(0, 5));
    } catch (error) {
      setRecentSessions([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("email");
    localStorage.removeItem("authToken");
    router.push("/teacher/login");
  };

  // Dashboard data
  const totalCourses = courses.length;
  const totalStudents = students.length;
  const recentCourses = [...courses].slice(-3).reverse();
  const filteredCourses = courses.filter(
    (course) =>
      course.name?.toLowerCase().includes(search.toLowerCase()) ||
      course.code?.toLowerCase().includes(search.toLowerCase())
  );
  const recentStudents = [...students].slice(-5).reverse();

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <Header
          title="Teacher Dashboard"
          searchValue={search}
          onSearchChange={(e) => setSearch(e.target.value)}
          showSearch={activeTab === "courses"}
        />

        <main className="p-6">
          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Welcome back, {user?.email?.split("@")[0] || "Professor"}!
              </h1>
              <p className="text-gray-600">{today}</p>
            </div>
            <button
              onClick={handleLogout}
              className="mt-4 md:mt-0 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Courses
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalCourses}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Students
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalStudents}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Attendance Rate
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.attendanceRate}%
                  </p>
                </div>
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Upcoming Sessions
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.upcomingSessions}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Sessions Section */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Recent Sessions
            </h2>
            {recentSessions.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                No recent sessions found
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentSessions.map((session) => (
                  <div
                    key={session.sessionId}
                    className="bg-white rounded-lg shadow p-5 border-l-4 border-blue-400 hover:shadow-lg transition"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {session.courseCode}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(session.date).toLocaleDateString(undefined, {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        {new Date(session.date).toLocaleTimeString(undefined, {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="font-semibold text-blue-900 mb-1">
                      {session.courseName}
                    </div>
                    <div className="flex gap-2 text-xs mt-2">
                      <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded font-semibold">
                        Attended: {session.attendedStudents?.length || 0}
                      </span>
                      <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded font-semibold">
                        Missed: {session.notAttendedStudents?.length || 0}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tab Content */}
          {activeTab === "courses" && (
            <div className="space-y-8">
              {/* Recent Courses */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Recent Courses
                </h2>
                {recentCourses.length === 0 ? (
                  <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                    No recent courses found
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {recentCourses.map((course) => (
                      <div
                        key={course._id}
                        className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {course.code || "N/A"}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {course.students?.length || 0} students
                            </span>
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {course.name}
                          </h3>
                          <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                            {course.description || "No description available"}
                          </p>
                          <button
                            onClick={() =>
                              router.push(`/teacher/courses/${course._id}`)
                            }
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
                          >
                            View Course
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "students" && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Recent Students
              </h2>
              {recentStudents.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                  No students found
                </div>
              ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <ul className="divide-y divide-gray-200">
                    {recentStudents.map((student) => (
                      <li key={student._id} className="hover:bg-gray-50">
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                {student.name?.charAt(0) || "S"}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {student.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {student.email}
                                </div>
                              </div>
                            </div>
                            <div className="ml-2 flex-shrink-0 flex">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Active
                              </span>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === "analytics" && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Attendance Analytics
              </h2>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1"
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      Analytics coming soon
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      We're working on detailed analytics for your courses and
                      students.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboard;
