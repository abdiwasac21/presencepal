"use client";
import { useEffect, useState } from "react";
import Sidebar from "@/components/TeacherSidebar";
import Header from "@/components/Header";
import { ChevronDown, ChevronUp } from "lucide-react";

const baseUrl = 'https://presencepalbackend-1.onrender.com';

export default function TeacherCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teacherEmail, setTeacherEmail] = useState("");
  const [openCourse, setOpenCourse] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) {
      setTeacherEmail(email);
    } else {
      console.error("No teacher email found in local storage");
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
        console.error(err);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, [teacherEmail]);

  // Filter courses based on search input
  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <Header
          title="My Courses"
          searchValue={search}
          onSearchChange={e => setSearch(e.target.value)}
        />
        <div className="mt-6">
          {loading ? (
            <div>Loading...</div>
          ) : filteredCourses.length === 0 ? (
            <p>No courses found.</p>
          ) : (
            filteredCourses.map((course) => {
              const isOpen = openCourse === course._id;
              return (
                <div
                  key={course._id}
                  className="border border-gray-200 rounded mb-6 bg-white shadow"
                >
                  <button
                    className="w-full flex items-center justify-between p-4 focus:outline-none"
                    onClick={() => setOpenCourse(isOpen ? null : course._id)}
                  >
                    <span className="text-xl font-semibold">{course.name}</span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4">
                      <p className="mb-2">
                        <strong>Teacher:</strong> {course.teacher?.username} ({course.teacher?.email})
                      </p>
                      <h3 className="font-bold mb-1">Enrolled Students:</h3>
                      <ul className="list-disc list-inside mt-2">
                        {(course.students || []).map((student) => (
                          <li key={student._id || student.name} className="text-red-500">{student.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}