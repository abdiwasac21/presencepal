"use client";
import { useEffect, useState } from "react";
import StudentSideBar from "@/components/StudentSideBar";
import Header from "@/components/Header";

const baseUrl = "https://presencepalbackend-1.onrender.com";

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState(null);
  const [currentSemester, setCurrentSemester] = useState(null);
  const [semesterList, setSemesterList] = useState([]);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isStudentLoggedIn");
    if (!isLoggedIn) {
      window.location.href = "/student/login";
      return;
    }

    const fetchStudentData = async () => {
      try {
        const authToken = localStorage.getItem("studentAuthToken");
        if (!authToken) {
          console.error("No authToken found in localStorage");
          return;
        }

        const response = await fetch(`${baseUrl}/student/data`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setStudentData(data);
        } else {
          const errorText = await response.text();
          console.error(`Failed to fetch student data. Status: ${response.status}`, errorText);
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    fetchStudentData();
  }, []);

  useEffect(() => {
    if (studentData?.class?.courses) {
      const semesters = Array.from(
        new Set(studentData.class.courses.map((c) => c.semester))
      ).sort((a, b) => a - b);
      setSemesterList(semesters);
      if (semesters.length > 0 && currentSemester === null) {
        setCurrentSemester(semesters[0]);
      }
    }
  }, [studentData]);

  const handleLogout = () => {
    localStorage.removeItem("isStudentLoggedIn");
    localStorage.removeItem("studentAuthToken");
    window.location.href = "/student/login";
  };

  return (
    <div className="flex">
      <StudentSideBar />
      <div className="flex-1">
        <Header title="Student Dashboard" />
        <div className="p-8 bg-gray-50 min-h-screen">
          <h1 className="text-3xl font-bold mb-4">Student Dashboard</h1>
          {studentData ? (
            <>
              <div className="mb-6 flex flex-col md:flex-row gap-6">
                {/* Attendance Card */}
                <div className="bg-white rounded-xl shadow-md p-6 flex-1">
                  <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 018 0v2M9 17a4 4 0 01-8 0v-2a4 4 0 018 0v2zm0 0v2a4 4 0 008 0v-2m-8 0h8" />
                    </svg>
                    Attendance
                  </h2>
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-3xl font-bold text-blue-600">
                      {studentData.attendance?.percentage ?? "N/A"}%
                    </span>
                    <span className="text-gray-500">This Month</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div
                      className="bg-blue-500 h-3 rounded-full transition-all"
                      style={{ width: `${studentData.attendance?.percentage ?? 0}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600">
                    Present: <span className="font-semibold">{studentData.attendance?.present ?? "--"}</span> / 
                    Absent: <span className="font-semibold">{studentData.attendance?.absent ?? "--"}</span>
                  </div>
                </div>
                {/* Profile Card */}
                <div className="bg-white rounded-xl shadow-md p-6 flex-1 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
                      {studentData.student?.name?.[0] || "S"}
                    </div>
                    <div>
                      <div className="font-semibold">{studentData.student?.name}</div>
                      <div className="text-gray-500 text-sm">{studentData.student?.email}</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-700">
                    <div>Grade: <span className="font-semibold">{studentData.class?.name || "N/A"}</span></div>
                    <div>Roll Number: <span className="font-semibold">{studentData.student?.universityId}</span></div>
                  </div>
                </div>
              </div>
              {/* Courses Section */}
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Courses</h2>
                {/* Semester Pagination */}
                <div className="flex gap-2 mb-6 flex-wrap">
                  {semesterList.map((semester) => (
                    <button
                      key={semester}
                      className={`px-4 py-2 rounded-md border ${
                        currentSemester === semester
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-blue-600 border-blue-300"
                      } transition`}
                      onClick={() => setCurrentSemester(semester)}
                    >
                      Semester {semester}
                    </button>
                  ))}
                </div>
                {/* Courses for current semester */}
                {studentData.class?.courses && studentData.class.courses.length > 0 ? (
                  <div>
                    <h3 className="text-lg font-bold mb-3 text-blue-700">
                      Semester {currentSemester}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {studentData.class.courses
                        .filter((course) => course.semester === currentSemester)
                        .map((course) => (
                          <div
                            key={course._id}
                            className="bg-white rounded-xl shadow hover:shadow-lg transition p-5 flex flex-col gap-2 border-l-4 border-blue-500"
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m0 0H6m6 0h6" />
                                </svg>
                              </div>
                              <div>
                                <div className="font-bold">{course.name}</div>
                                <div className="text-xs text-gray-500">{course.code}</div>
                              </div>
                            </div>
                            <div className="text-gray-600 text-sm">{course.description || "No description available."}</div>
                          </div>
                        ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-400 italic">No courses assigned</div>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 mt-10"
              >
                Logout
              </button>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;