'use client';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import StudentSideBar from '@/components/StudentSideBar';

const baseUrl = "https://presencepalbackend-1.onrender.com";
export default function ViewAttendancePage() {
  const [attendedCourses, setAttendedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendedCourses = async () => {
      try {
        const token = localStorage.getItem('studentAuthToken');
        if (!token) {
          window.location.href = '/student/login';
          return;
        }
        const res = await fetch(`${baseUrl}/student/attended-courses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setAttendedCourses(data.courses || []);
      } catch {
        setAttendedCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendedCourses();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <StudentSideBar />
      <div className="flex-1 flex flex-col">
        <Header title="Attended Courses" />
        <main className="flex-1 p-8">
          <h1 className="text-2xl font-bold mb-6">Courses You Attended</h1>
          {loading ? (
            <p>Loading...</p>
          ) : attendedCourses.length === 0 ? (
            <p className="text-gray-500">You haven't attended any courses yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {attendedCourses.map(course => (
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
                  <div className="text-xs text-green-700 mt-2">
                    Sessions attended: <span className="font-semibold">{course.sessionsAttended || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}