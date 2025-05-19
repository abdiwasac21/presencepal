"use client";
import { useEffect, useState } from "react";
import Sidebar from "@/components/TeacherSidebar";
import Header from "@/components/Header";

// const baseUrl = 'http://localhost:80';
const baseUrl = "https://presencepalbackend-1.onrender.com";

// Helper for student avatar/initials
function StudentAvatar({ name }) {
  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
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
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Helper to get the latest session date from sessionDates array
function getLatestSessionDate(session) {
  if (!session.sessionDates || session.sessionDates.length === 0) return null;
  // Sort and get the latest date
  return session.sessionDates.slice().sort().reverse()[0];
}

// Group sessions by latest session date's day
function groupByDay(sessions) {
  return sessions.reduce((acc, session) => {
    const latestDate = getLatestSessionDate(session);
    const day = latestDate ? formatDay(latestDate) : "Unknown Date";
    if (!acc[day]) acc[day] = [];
    acc[day].push({ ...session, latestDate });
    return acc;
  }, {});
}

export default function TeacherSessionsStartedPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCourses, setOpenCourses] = useState({});
  const [openDropdowns, setOpenDropdowns] = useState({});

  const toggleCourse = (courseId) => {
    setOpenCourses((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }));
  };

  const toggleDropdown = (courseId) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }));
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    async function fetchSessions() {
      try {
        const res = await fetch(`${baseUrl}/api/teacher/session-started`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Failed to fetch sessions");
        const data = await res.json();
        setSessions(data.courses || []);
      } catch (err) {
        setSessions([]);
      } finally {
        setLoading(false);
      }
    }
    fetchSessions();
  }, []);

  // Group sessions by day using latest session date
  const sessionsByDay = groupByDay(sessions);

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6">
        <Header title="Started Sessions" />
        <div className="mt-6">
          {loading ? (
            <div className="text-center text-lg text-gray-500">Loading...</div>
          ) : sessions.length === 0 ? (
            <div className="text-center text-gray-400 mt-16">
              <span className="text-4xl mb-2 block">📚</span>
              <p className="text-lg">No sessions found.</p>
            </div>
          ) : (
            <div className="grid gap-10">
              {Object.entries(sessionsByDay).map(([day, daySessions]) => (
                <div key={day}>
                  <h2 className="text-xl font-bold text-blue-700 mb-4">{day}</h2>
                  <div className="grid gap-6">
                    {daySessions.map((session) => {
                      const attended = session.attendedStudents?.length || 0;
                      const missed = session.notAttendedStudents?.length || 0;
                      return (
                        <div
                          key={session.courseId}
                          className="bg-white rounded-xl shadow-md border border-gray-200 transition hover:shadow-lg"
                        >
                          <button
                            className="w-full flex justify-between items-center px-6 py-4 rounded-t-xl bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 transition"
                            onClick={() => toggleCourse(session.courseId)}
                          >
                            <div>
                              <div className="text-lg font-bold text-blue-800">
                                {session.courseName || <span className="italic text-gray-400">Unnamed Course</span>}
                              </div>
                              <div className="text-xs text-gray-500">
                                Code: <span className="font-mono">{session.courseCode || "N/A"}</span>
                              </div>
                              {session.latestDate && (
                                <div className="text-xs text-gray-400 mt-1">
                                  Latest Session: {new Date(session.latestDate).toLocaleString(undefined, {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                                Sessions: {session.totalSessions || 0}
                              </span>
                              <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                                Attended: {attended}
                              </span>
                              <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold">
                                Missed: {missed}
                              </span>
                              <span className="ml-4 text-xl">
                                {openCourses[session.courseId] ? "▲" : "▼"}
                              </span>
                            </div>
                          </button>
                          {openCourses[session.courseId] && (
                            <div className="px-6 py-4 border-t border-gray-100">
                              <div className="mb-4">
                                <div className="font-semibold text-gray-700 mb-1 flex items-center">
                                  <span className="mr-2 text-green-600">✔️</span> Attended Students
                                  <span className="ml-2 bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-semibold">
                                    {attended}
                                  </span>
                                </div>
                                {attended === 0 ? (
                                  <div className="text-gray-400 italic text-sm ml-6">No students attended.</div>
                                ) : (
                                  <ul className="list-none ml-0 mt-2">
                                    {session.attendedStudents.map((student) => (
                                      <li key={student.studentId} className="flex items-center mb-1">
                                        <StudentAvatar name={student.name} />
                                        <span className="text-gray-800">{student.name}</span>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                              <div>
                                <button
                                  className="flex items-center text-red-600 hover:text-red-800 font-semibold focus:outline-none"
                                  onClick={() => toggleDropdown(session.courseId)}
                                >
                                  <span className="mr-2">❌</span>
                                  Missed Students
                                  <span className="ml-2 bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-semibold">
                                    {missed}
                                  </span>
                                  <span className="ml-2 text-xs">
                                    {openDropdowns[session.courseId] ? "▲" : "▼"}
                                  </span>
                                </button>
                                {openDropdowns[session.courseId] && (
                                  <div className="mt-2 ml-2">
                                    {missed === 0 ? (
                                      <div className="text-gray-400 italic text-sm">No missed students.</div>
                                    ) : (
                                      <ul className="list-none">
                                        {session.notAttendedStudents.map((student) => (
                                          <li key={student.studentId} className="flex items-center mb-1">
                                            <StudentAvatar name={student.name} />
                                            <span className="text-red-600">{student.name}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}