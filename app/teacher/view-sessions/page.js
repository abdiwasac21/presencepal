"use client";
import { useEffect, useState } from "react";
import Sidebar from "@/components/TeacherSidebar";
import Header from "@/components/Header";

const baseUrl = 'http://localhost:80';

export default function TeacherSessionsStartedPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

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
              <div
                key={session.courseId}
                className="border border-gray-200 rounded p-4 mb-6 bg-white shadow"
              >
                <h2 className="text-lg font-semibold mb-2">
                  {session.courseName || "Unknown Course"}
                </h2>
                <p className="mb-2">
                  <strong>Course Code:</strong> {session.courseCode || "N/A"}
                </p>
                  <div className="mb-2">
                    <strong>Student Names:</strong>
                    <ul className="list-disc list-inside">
                      {(session.students || []).map((student) => (
                  <li key={student.studentId}>{student.name}</li>
                     ))}
                    </ul>
                    </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}