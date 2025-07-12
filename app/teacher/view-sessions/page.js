"use client";
import { useEffect, useState } from "react";
import Sidebar from "@/components/TeacherSidebar";
import Header from "@/components/Header";

// const baseUrl = 'http://localhost:80';
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

// Helper for student avatar/initials
function StudentAvatar({ name }) {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "NA";
  return (
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold mr-2 text-xs border border-blue-300">
      {initials}
    </span>
  );
}

// Helper to format date as "Monday, May 19, 2025"
function formatDay(dateStr) {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "Invalid date";
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Helper to format time
function formatTime(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TeacherSessionsStartedPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCourses, setOpenCourses] = useState({});
  const [openSessions, setOpenSessions] = useState({});

  const toggleCourse = (courseId) => {
    setOpenCourses((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }));
  };

  const toggleSession = (sessionId) => {
    setOpenSessions((prev) => ({
      ...prev,
      [sessionId]: !prev[sessionId],
    }));
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    async function fetchSessions() {
      try {
        const res = await fetch(`${baseUrl}/api/teacher/session-started`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch sessions");
        const data = await res.json();
        setCourses(data.courses || []);
      } catch (err) {
        setCourses([]);
      } finally {
        setLoading(false);
      }
    }
    fetchSessions();
  }, []);

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 overflow-x-hidden">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <Header title="Started Sessions" />
        <div className="mt-6">
          {loading ? (
            <div className="text-center text-lg text-gray-500">Loading...</div>
          ) : courses.length === 0 ? (
            <div className="text-center text-gray-400 mt-16">
              <span className="text-4xl mb-2 block">📚</span>
              <p className="text-lg">No sessions found.</p>
            </div>
          ) : (
            <div className="grid gap-10">
              {courses.map((course) => (
                <div key={course.courseId} className="mb-8">
                  <button
                    className="w-full flex justify-between items-center px-6 py-5 rounded-t-2xl bg-gradient-to-r from-blue-100 to-blue-200 hover:from-blue-200 transition border-b-2 border-blue-200 shadow"
                    onClick={() => toggleCourse(course.courseId)}
                  >
                    <div>
                      <div className="text-xl font-extrabold text-blue-900 tracking-tight">
                        {course.courseName || (
                          <span className="italic text-gray-400">
                            Unnamed Course
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-blue-700 mt-1">
                        Code:{" "}
                        <span className="font-mono">
                          {course.courseCode || "N/A"}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Total Sessions: {course.totalSessions || 0}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="bg-blue-200 text-blue-800 px-3 py-1 rounded-lg text-xs font-semibold shadow">
                        Sessions: {course.sessions?.length || 0}
                      </span>
                      <span className="ml-4 text-2xl text-blue-700">
                        {openCourses[course.courseId] ? "▲" : "▼"}
                      </span>
                    </div>
                  </button>
                  {openCourses[course.courseId] && (
                    <div className="px-6 py-5 border-t border-blue-100 bg-white rounded-b-2xl shadow-lg">
                      {course.sessions && course.sessions.length > 0 ? (
                        <div className="space-y-6">
                          {course.sessions.map((session) => (
                            <div
                              key={session.sessionId}
                              className="border rounded-xl mb-4 shadow hover:shadow-lg transition"
                            >
                              <button
                                className="w-full flex justify-between items-center px-4 py-4 bg-blue-50 hover:bg-blue-100 rounded-t-xl"
                                onClick={() => toggleSession(session.sessionId)}
                              >
                                <div>
                                  <div className="font-semibold text-blue-700 text-base">
                                    {formatDay(session.date)}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {formatTime(session.date)}
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold shadow">
                                    Attended:{" "}
                                    {session.attendedStudents?.length || 0}
                                  </span>
                                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold shadow">
                                    Missed:{" "}
                                    {session.notAttendedStudents?.length || 0}
                                  </span>
                                  <span className="ml-4 text-xl text-blue-700">
                                    {openSessions[session.sessionId]
                                      ? "▲"
                                      : "▼"}
                                  </span>
                                </div>
                              </button>
                              {openSessions[session.sessionId] && (
                                <div className="p-4 bg-white rounded-b-xl border-t">
                                  <div className="mb-4">
                                    <div className="font-semibold text-gray-700 mb-2 flex items-center">
                                      <span className="mr-2 text-green-600">
                                        ✔️
                                      </span>{" "}
                                      Attended Students
                                      <span className="ml-2 bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-semibold">
                                        {session.attendedStudents?.length || 0}
                                      </span>
                                    </div>
                                    {session.attendedStudents?.length === 0 ? (
                                      <div className="text-gray-400 italic text-sm ml-6">
                                        No students attended.
                                      </div>
                                    ) : (
                                      <ul className="list-none ml-0 mt-2">
                                        {session.attendedStudents.map(
                                          (student) => (
                                            <li
                                              key={student.studentId}
                                              className="flex items-center mb-1"
                                            >
                                              <StudentAvatar
                                                name={student.name}
                                              />
                                              <span className="text-gray-800">
                                                {student.name}
                                              </span>
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    )}
                                  </div>
                                  <div>
                                    <div className="font-semibold text-gray-700 mb-2 flex items-center">
                                      <span className="mr-2 text-red-600">
                                        ❌
                                      </span>{" "}
                                      Missed Students
                                      <span className="ml-2 bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-semibold">
                                        {session.notAttendedStudents?.length ||
                                          0}
                                      </span>
                                    </div>
                                    {session.notAttendedStudents?.length ===
                                    0 ? (
                                      <div className="text-gray-400 italic text-sm ml-6">
                                        No missed students.
                                      </div>
                                    ) : (
                                      <ul className="list-none ml-0 mt-2">
                                        {session.notAttendedStudents.map(
                                          (student) => (
                                            <li
                                              key={student.studentId}
                                              className="flex items-center mb-1"
                                            >
                                              <StudentAvatar
                                                name={student.name}
                                              />
                                              <span className="text-red-600">
                                                {student.name}
                                              </span>
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-gray-400 italic">
                          No sessions for this course.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
