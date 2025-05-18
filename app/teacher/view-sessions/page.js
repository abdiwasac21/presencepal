"use client";
import { useEffect, useState } from "react";
import Sidebar from "@/components/TeacherSidebar";
import Header from "@/components/Header";

const baseUrl = 'http://localhost:80';

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

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <Header title="Started Sessions" />
        <div className="mt-6">
          {loading ? (
            <div>Loading...</div>
          ) : sessions.length === 0 ? (
            <p>No sessions found.</p>
          ) : (
            sessions.map((session) => (
              <div key={session.courseId} className="mb-4">
                <button
                  className="w-full text-left px-4 py-2 bg-gray-100 rounded shadow font-semibold flex justify-between items-center"
                  onClick={() => toggleCourse(session.courseId)}
                >
                  <span>{session.courseName || "Unknown Course"}</span>
                  <span>{openCourses[session.courseId] ? "▲" : "▼"}</span>
                </button>
                {openCourses[session.courseId] && (
                  <div className="border border-gray-200 rounded p-4 bg-white shadow mt-2">
                    <p className="mb-2">
                      <strong>Course Code:</strong> {session.courseCode || "N/A"}
                    </p>
                    <div className="mb-2">
                      <strong>Attended Student Names:</strong>
                      <ul className="list-disc list-inside">
                        {(session.attendedStudents || []).map((student) => (
                          <li key={student.studentId}>{student.name}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="mb-2">
                      <button
                        className="text-blue-600 underline mb-1"
                        onClick={() => toggleDropdown(session.courseId)}
                      >
                        <strong>Missed Students Names</strong>
                        {openDropdowns[session.courseId] ? " ▲" : " ▼"}
                      </button>
                      {openDropdowns[session.courseId] && (
                        <ul className="list-disc list-inside mt-2">
                          {(session.notAttendedStudents || []).map((student) => (
                            <li key={student.studentId} className="text-red-500">{student.name}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}