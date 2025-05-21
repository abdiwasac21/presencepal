'use client';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import StudentSideBar from '@/components/StudentSideBar';

const baseUrl = "https://presencepalbackend-1.onrender.com";
// const baseUrl = 'http://localhost:80';

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
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <StudentSideBar />
      <div className="flex-1 flex flex-col">
        <Header title="Attendance Overview" />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-extrabold mb-8 text-blue-800 flex items-center gap-3">
            <svg className="w-9 h-9 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m0 0H6m6 0h6" />
            </svg>
            Your Attendance by Course
          </h1>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <svg className="animate-spin h-10 w-10 text-blue-600 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              <span className="text-blue-700 text-xl font-semibold">Loading...</span>
            </div>
          ) : attendedCourses.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m0 0H6m6 0h6" />
              </svg>
              <p className="text-lg">You haven't attended any courses yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {attendedCourses.map(course => (
                <div
                  key={course._id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition p-6 flex flex-col border-l-4 border-blue-500"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m0 0H6m6 0h6" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-bold text-lg text-blue-800">{course.name}</div>
                      <div className="text-xs text-gray-500">{course.code}</div>
                    </div>
                  </div>
                  <div className="flex-1 text-gray-600 text-sm mb-2">
                    {course.description || "No description available."}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-block bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-semibold">
                      Sessions attended: {course.attendanceCount ?? 0}
                    </span>
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