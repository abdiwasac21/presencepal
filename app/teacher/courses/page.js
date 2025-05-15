"use client";
import { useEffect, useState } from "react";
import Sidebar from "@/components/TeacherSidebar";
import Header from "@/components/Header";

const baseUrl = 'https://presencepalbackend-1.onrender.com';

export default function TeacherCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teacherEmail, setTeacherEmail] = useState(""); // FIXED

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
    if (!teacherEmail) return; // Only fetch if email is set

    const token = localStorage.getItem("authToken");

    async function fetchCourses() {
      try {
        const res = await fetch(`${baseUrl}/api/teacher/courses/by-email/${teacherEmail}`, {
            headers: { Authorization: `Bearer ${token}` } 
          });
        if (!res.ok) throw new Error("Failed to fetch courses");
        const data = await res.json();
        console.log("Fetched courses:", data);
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

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <Header title="My Courses" />
        <div className="mt-6">
          {loading ? (
            <div>Loading...</div>
          ) : courses.length === 0 ? (
            <p>No courses found.</p>
          ) : (
            courses.map((course) => (
              <div
                key={course._id}
                className="border border-gray-200 rounded p-4 mb-6 bg-white shadow"
              >
                <h2 className="text-xl font-semibold mb-2">{course.name}</h2>
                <p className="mb-2">
                  <strong>Teacher:</strong> {course.teacher?.username} ({course.teacher?.email})
                </p>
                <h3 className="font-bold mb-1">Enrolled Students:</h3>
                <p className="mb-2">{course.className || "No class"} </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}