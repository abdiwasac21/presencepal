"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/TeacherSidebar";
import Header from "@/components/Header";

const baseUrl = 'https://presencepalbackend-1.onrender.com';
// const baseUrl = "http://localhost:80";

export default function TeacherCoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teacherEmail, setTeacherEmail] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) {
      setTeacherEmail(email);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!teacherEmail) return;

    const token = localStorage.getItem("authToken");

    async function fetchCourses() {
      try {
        const res = await fetch(`${baseUrl}/api/teacher/courses/by-email/${teacherEmail}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Failed to fetch courses");
        const data = await res.json();
        setCourses(data.data || []);
      } catch (err) {
        setCourses([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, [teacherEmail]);

  // Filter courses based on search input
  const filteredCourses = courses.filter(course =>
    course.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <Header
          title="My Courses"
          searchValue={search}
          onSearchChange={e => setSearch(e.target.value)}
        />
        <main className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-blue-700">Your Courses</h2>
              <input
                type="text"
                placeholder="Search courses..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="border border-blue-200 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
              />
            </div>
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                <span className="ml-4 text-blue-700 font-semibold">Loading courses...</span>
              </div>
            ) : filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {filteredCourses.map((course, idx) => (
                  <div
                    key={course._id || idx}
                    className="bg-white shadow-lg rounded-xl p-6 flex flex-col hover:shadow-2xl transition-shadow border border-blue-100 relative"
                  >
                    <div className="absolute -top-4 -right-4 bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-xs font-bold shadow">
                      {course.code || "No Code"}
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-blue-700">{course.name}</h3>
                    <p className="text-gray-600 mb-4 flex-1">{course.description || "No description available."}</p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="inline-block bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full font-semibold">
                        {course.students?.length ? `${course.students.length} Students` : "No Students"}
                      </span>
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-1.5 rounded-full font-semibold shadow transition"
                        onClick={() => router.push(`/teacher/courses/${course._id}`)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                <span className="text-5xl mb-2">📚</span>
                <p className="text-lg">No courses found.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}