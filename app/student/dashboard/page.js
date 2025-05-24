"use client";
import { useEffect, useState } from "react";
import StudentSideBar from "@/components/StudentSideBar";
import Header from "@/components/Header";

const baseUrl = "https://presencepalbackend-1.onrender.com";

const AttendedCoursesDashboard = () => {
  const [attendedCourses, setAttendedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "attendanceCount",
    direction: "desc",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isStudentLoggedIn");
    if (!isLoggedIn) {
      window.location.href = "/student/login";
      return;
    }

    const fetchAttendedCourses = async () => {
      try {
        setLoading(true);
        const authToken = localStorage.getItem("studentAuthToken");
        if (!authToken) {
          throw new Error("No authToken found in localStorage");
        }

        const response = await fetch(`${baseUrl}/student/attended-courses`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch attended courses: ${errorText}`);
        }

        const data = await response.json();
        setAttendedCourses(data.courses || []);
      } catch (error) {
        console.error("Error fetching attended courses:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendedCourses();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isStudentLoggedIn");
    localStorage.removeItem("studentAuthToken");
    window.location.href = "/student/login";
  };

  const handleSort = (key) => {
    let direction = "desc";
    if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = "asc";
    }
    setSortConfig({ key, direction });
  };

  const sortedCourses = [...attendedCourses].sort((a, b) => {
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];

    if (aVal === undefined || aVal === null) return 1;
    if (bVal === undefined || bVal === null) return -1;

    if (aVal < bVal) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (aVal > bVal) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const filteredCourses = sortedCourses
    .filter(
      (course) =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((course) => {
      if (activeTab === "all") return true;
      if (activeTab === "high") return (course.attendanceCount || 0) >= 75;
      if (activeTab === "medium")
        return (
          (course.attendanceCount || 0) >= 50 &&
          (course.attendanceCount || 0) < 75
        );
      return (course.attendanceCount || 0) < 50;
    });

  const getTotalAttendance = () => {
    return attendedCourses.reduce(
      (sum, course) => sum + (course.attendanceCount || 0),
      0
    );
  };

  const getAttendancePercentage = (count) => {
    if (!attendedCourses.length) return 0;
    const maxAttendance = Math.max(
      ...attendedCourses.map((c) => c.attendanceCount || 0),
      1
    );
    if (maxAttendance === 0) return 0;
    return (count / maxAttendance) * 100;
  };

  const SortIcon = ({ direction }) => (
    <span className="ml-1">{direction === "asc" ? "↑" : "↓"}</span>
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-green-50 to-green-100">
      <StudentSideBar />
      <div className="flex-1 overflow-y-auto">
        <Header title="Attended Courses" />
        <main className="p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Dashboard Header */}
              <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-green-900">
                      Your Course Attendance
                    </h1>
                    <p className="text-green-700">
                      Track your attendance across all courses
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search courses..."
                        className="pl-10 pr-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 w-full md:w-64 bg-white/70 shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 text-green-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl shadow-lg p-6 text-white transform hover:scale-[1.02] transition-transform">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-100">
                        Total Courses
                      </p>
                      <p className="text-3xl font-bold">
                        {attendedCourses.length}
                      </p>
                    </div>
                    <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm">
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
                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-[1.02] transition-transform">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-yellow-100">
                        Total Attendance
                      </p>
                      <p className="text-3xl font-bold">
                        {getTotalAttendance()}
                      </p>
                    </div>
                    <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm">
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
                <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-xl shadow-lg p-6 text-white transform hover:scale-[1.02] transition-transform">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-100">
                        Highest Attendance
                      </p>
                      <p className="text-3xl font-bold">
                        {attendedCourses.length > 0
                          ? Math.max(
                              ...attendedCourses.map(
                                (c) => c.attendanceCount || 0
                              )
                            )
                          : 0}
                      </p>
                    </div>
                    <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm">
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
                          d="M12 8v4l3 3"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="mb-6 bg-white rounded-lg p-1 shadow-inner border border-green-100 inline-flex">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "all"
                      ? "bg-green-600 text-white"
                      : "text-green-700 hover:bg-green-50"
                  }`}
                >
                  All Courses
                </button>
                <button
                  onClick={() => setActiveTab("high")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "high"
                      ? "bg-green-600 text-white"
                      : "text-green-700 hover:bg-green-50"
                  }`}
                >
                  High Attendance
                </button>
                <button
                  onClick={() => setActiveTab("medium")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "medium"
                      ? "bg-yellow-500 text-white"
                      : "text-yellow-700 hover:bg-yellow-50"
                  }`}
                >
                  Medium
                </button>
                <button
                  onClick={() => setActiveTab("low")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "low"
                      ? "bg-red-600 text-white"
                      : "text-red-700 hover:bg-red-50"
                  }`}
                >
                  Needs Improvement
                </button>
              </div>

              {/* Attendance Overview */}
              <div className="mb-12 bg-white rounded-xl shadow-lg p-6 border border-green-100">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-green-900">
                    Attendance Overview
                  </h2>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-green-700">
                      {filteredCourses.length} courses
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.length === 0 ? (
                    <div className="col-span-full text-center py-8">
                      <svg
                        className="mx-auto h-12 w-12 text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="mt-2 text-green-700">
                        No courses found matching your criteria
                      </p>
                    </div>
                  ) : (
                    filteredCourses.map((course) => {
                      const totalAttendance = getTotalAttendance();
                      const attendanceCount = course.attendanceCount || 0;
                      const percentage =
                        totalAttendance === 0
                          ? 0
                          : (attendanceCount / totalAttendance) * 100;

                      const dashArray = 2 * Math.PI * 45;
                      const dashOffset = dashArray * (1 - percentage / 100);

                      return (
                        <div
                          key={course._id}
                          className="bg-gradient-to-br from-green-50 to-white rounded-xl shadow p-5 border border-green-100 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              <svg
                                width="80"
                                height="80"
                                viewBox="0 0 100 100"
                                className="mr-4"
                              >
                                <circle
                                  cx="50"
                                  cy="50"
                                  r="40"
                                  fill="none"
                                  stroke="#bfdbfe"
                                  strokeWidth="8"
                                />
                                <circle
                                  cx="50"
                                  cy="50"
                                  r="40"
                                  fill="none"
                                  stroke="#f59e0b"
                                  strokeWidth="8"
                                  strokeDasharray={dashArray}
                                  strokeDashoffset={dashOffset}
                                  strokeLinecap="round"
                                  transform="rotate(-90 50 50)"
                                />
                                <text
                                  x="50"
                                  y="55"
                                  textAnchor="middle"
                                  fontSize="20"
                                  fill="#1e40af"
                                  fontWeight="bold"
                                >
                                  {Math.round(percentage)}%
                                </text>
                              </svg>
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-green-900">
                                {course.code}
                              </h3>
                              <p className="text-green-700 text-sm mb-2">
                                {course.name}
                              </p>
                              <div className="flex items-center">
                                <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800">
                                  {attendanceCount} sessions
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Course List with Progress Bars */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-green-900">
                    Detailed Course Attendance
                  </h2>
                  <div className="text-sm text-green-600">
                    Sorted by:{" "}
                    {sortConfig.key.replace(/([A-Z])/g, " $1").toLowerCase()} (
                    {sortConfig.direction})
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead className="bg-green-900 text-white">
                      <tr>
                        <th
                          className="cursor-pointer p-3 text-left rounded-tl-lg"
                          onClick={() => handleSort("code")}
                        >
                          <div className="flex items-center">
                            Course Code
                            {sortConfig.key === "code" && (
                              <SortIcon direction={sortConfig.direction} />
                            )}
                          </div>
                        </th>
                        <th
                          className="cursor-pointer p-3 text-left"
                          onClick={() => handleSort("name")}
                        >
                          <div className="flex items-center">
                            Course Name
                            {sortConfig.key === "name" && (
                              <SortIcon direction={sortConfig.direction} />
                            )}
                          </div>
                        </th>
                        <th
                          className="cursor-pointer p-3 text-left"
                          onClick={() => handleSort("attendanceCount")}
                        >
                          <div className="flex items-center">
                            Attendance
                            {sortConfig.key === "attendanceCount" && (
                              <SortIcon direction={sortConfig.direction} />
                            )}
                          </div>
                        </th>
                        <th className="p-3 text-left rounded-tr-lg">
                          Progress
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCourses.length === 0 ? (
                        <tr>
                          <td
                            colSpan="4"
                            className="text-center p-6 text-green-700"
                          >
                            <div className="flex flex-col items-center justify-center py-8">
                              <svg
                                className="h-12 w-12 text-green-400 mb-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <p>No courses match your current filters</p>
                              <button
                                onClick={() => {
                                  setActiveTab("all");
                                  setSearchTerm("");
                                }}
                                className="mt-2 text-sm text-green-600 hover:text-green-800 underline"
                              >
                                Clear filters
                              </button>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredCourses.map((course, index) => {
                          const attendanceCount = course.attendanceCount || 0;
                          const percentage =
                            getAttendancePercentage(attendanceCount);
                          return (
                            <tr
                              key={course._id}
                              className={`${
                                index % 2 === 0 ? "bg-green-50" : "bg-white"
                              } hover:bg-green-100 transition-colors`}
                            >
                              <td className="p-3 border-b border-green-100 text-green-900 font-medium">
                                <div className="font-semibold">
                                  {course.code}
                                </div>
                              </td>
                              <td className="p-3 border-b border-green-100 text-green-800">
                                {course.name}
                              </td>
                              <td className="p-3 border-b border-green-100 text-green-900 font-medium">
                                <div className="flex items-center">
                                  <span className="mr-2">
                                    {attendanceCount}
                                  </span>
                                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                    {Math.round(percentage)}%
                                  </span>
                                </div>
                              </td>
                              <td className="p-3 border-b border-green-100">
                                <div className="flex items-center">
                                  <div className="w-full bg-green-200 rounded-full h-2.5 mr-2">
                                    <div
                                      className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-2.5 rounded-full transition-all"
                                      style={{ width: `${percentage}%` }}
                                    />
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Logout Button */}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg shadow hover:from-red-700 hover:to-red-800 transition-all flex items-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
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
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AttendedCoursesDashboard;
