"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/TeacherSidebar";
import Header from "@/components/Header";

const baseUrl = "http://localhost:80";

export default function CourseDetailsPage() {
  const { courseId } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    async function fetchCourse() {
      try {
        const res = await fetch(`${baseUrl}/api/teacher/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch course");
        const data = await res.json();
        setCourse(data.data || null);
      } catch {
        setCourse(null);
      } finally {
        setLoading(false);
      }
    }
    if (courseId) fetchCourse();
  }, [courseId]);

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6">
        <Header title="Course Details" />
        <div className="max-w-3xl mx-auto mt-8">
          {loading ? (
            <div className="text-center text-lg text-blue-600">Loading...</div>
          ) : !course ? (
            <div className="text-center text-gray-400 mt-16">
              <span className="text-5xl mb-2 block">📚</span>
              <p className="text-lg">Course not found.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-8 border border-blue-100">
              <h1 className="text-2xl font-bold text-blue-800 mb-2">{course.name}</h1>
              <div className="mb-2 text-sm text-gray-500 flex items-center gap-4">
                <span className="font-mono bg-blue-50 px-2 py-1 rounded">{course.code || "No Code"}</span>
                <span className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                  Semester: {course.semester || "N/A"}
                </span>
              </div>
              <div className="mb-4 text-sm text-gray-600">
                <span className="font-semibold text-blue-700">Teacher:</span>{" "}
                {course.teacher?.username} ({course.teacher?.email})
              </div>
              <p className="mb-4 text-gray-700">{course.description || "No description available."}</p>
              <div className="mb-6">
                <h2 className="text-lg font-bold text-blue-700 mb-2">Students ({course.students?.length || 0})</h2>
                {course.students && course.students.length > 0 ? (
                  <ul className="divide-y divide-blue-50 border rounded-lg bg-blue-50">
                    {course.students.map((student) => (
                      <li key={student._id} className="flex items-center px-4 py-2">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-200 text-blue-800 font-bold mr-3 text-xs border border-blue-300">
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </span>
                        <span className="text-gray-800">{student.name}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-gray-400 italic">No students enrolled.</div>
                )}
              </div>
              <button
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold shadow transition"
                onClick={() => router.back()}
              >
                ← Back
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}