"use client";
import { useEffect, useState } from "react";
import StudentSideBar from "@/components/StudentSideBar";
import Header from "@/components/Header";

const baseUrl = "https://presencepalbackend-1.onrender.com";
// const baseUrl = "http://localhost:80"; // Adjust this to your actual base URL

const AttendedCoursesDashboard = () => {
  const [attendedCourses, setAttendedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "attendanceCount", direction: "desc" });
  const [searchTerm, setSearchTerm] = useState("");

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
            "Authorization": `Bearer ${authToken}`,
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

  const filteredCourses = sortedCourses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTotalAttendance = () => {
    return attendedCourses.reduce((sum, course) => sum + (course.attendanceCount || 0), 0);
  };

  const getAttendancePercentage = (count) => {
    if (!attendedCourses.length) return 0;
    const maxAttendance = Math.max(...attendedCourses.map(c => c.attendanceCount || 0), 1);
    if (maxAttendance === 0) return 0;
    return (count / maxAttendance) * 100;
  };

  const SortIcon = ({ direction }) => (
    <span className="ml-1">
      {direction === "asc" ? "↑" : "↓"}
    </span>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <StudentSideBar />
      <div className="flex-1 overflow-y-auto">
        <Header title="Attended Courses" />
        <main className="p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
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
                    <h1 className="text-2xl font-bold text-gray-800">Your Course Attendance</h1>
                    <p className="text-gray-600">Track your attendance across all courses</p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search courses..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Courses</p>
                      <p className="text-3xl font-bold text-gray-900">{attendedCourses.length}</p>
                    </div>
                    <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Attendance</p>
                      <p className="text-3xl font-bold text-gray-900">{getTotalAttendance()}</p>
                    </div>
                    <div className="p-3 rounded-full bg-green-100 text-green-600">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
<div className="bg-white rounded-lg shadow p-6"> <div className="flex items-center justify-between"> <div> <p className="text-sm font-medium text-gray-500">Highest Attendance</p> <p className="text-3xl font-bold text-gray-900"> {attendedCourses.length > 0 ? Math.max(...attendedCourses.map(c => c.attendanceCount || 0)) : 0} </p> </div> <div className="p-3 rounded-full bg-yellow-100 text-yellow-600"> <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3" /> </svg> </div> </div> </div> </div>
php-template
Copy
Edit
          {/* Attendance Overview Pie Chart */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Attendance Overview</h2>
            <div className="flex flex-wrap gap-4">
              {attendedCourses.length === 0 ? (
                <p className="text-gray-600">No attendance data available.</p>
              ) : (
                attendedCourses.map((course) => {
                  const totalAttendance = getTotalAttendance();
                  const attendanceCount = course.attendanceCount || 0;
                  const percentage = totalAttendance === 0 ? 0 : (attendanceCount / totalAttendance) * 100;

                  // For the pie chart slices
                  const dashArray = 2 * Math.PI * 45; // circumference of circle with r=45
                  const dashOffset = dashArray * (1 - percentage / 100);

                  return (
                    <div key={course._id} className="w-40 p-4 bg-white rounded-lg shadow text-center">
                      <svg width="100" height="100" viewBox="0 0 100 100" className="mx-auto mb-2">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="10"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="10"
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
                          fill="#3b82f6"
                          fontWeight="bold"
                        >
                          {Math.round(percentage)}%
                        </text>
                      </svg>
                      <p className="text-gray-700 font-semibold">{course.code}</p>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Course List with Progress Bars */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Courses Details</h2>
            <table className="w-full table-auto border-collapse border border-gray-200 bg-white rounded-lg shadow">
              <thead className="bg-gray-100">
                <tr>
                  <th
                    className="cursor-pointer p-3 text-left border-b border-gray-200"
                    onClick={() => handleSort("code")}
                  >
                    Course Code {sortConfig.key === "code" && <SortIcon direction={sortConfig.direction} />}
                  </th>
                  <th
                    className="cursor-pointer p-3 text-left border-b border-gray-200"
                    onClick={() => handleSort("name")}
                  >
                    Course Name {sortConfig.key === "name" && <SortIcon direction={sortConfig.direction} />}
                  </th>
                  <th
                    className="cursor-pointer p-3 text-left border-b border-gray-200"
                    onClick={() => handleSort("attendanceCount")}
                  >
                    Attendance Count {sortConfig.key === "attendanceCount" && <SortIcon direction={sortConfig.direction} />}
                  </th>
                  <th className="p-3 text-left border-b border-gray-200">Attendance Progress</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center p-6 text-gray-500">
                      No courses found.
                    </td>
                  </tr>
                ) : (
                  filteredCourses.map((course) => {
                    const attendanceCount = course.attendanceCount || 0;
                    const percentage = getAttendancePercentage(attendanceCount);
                    return (
                      <tr key={course._id} className="hover:bg-gray-50">
                        <td className="border-b border-gray-200 p-3">{course.code}</td>
                        <td className="border-b border-gray-200 p-3">{course.name}</td>
                        <td className="border-b border-gray-200 p-3">{attendanceCount}</td>
                        <td className="border-b border-gray-200 p-3">
                          <div className="w-full bg-gray-200 rounded-full h-4">
                            <div
                              className="bg-blue-600 h-4 rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Logout Button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
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