"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import StudentSideBar from "@/components/StudentSideBar";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const StudentClassPage = () => {
  const [studentClass, setStudentClass] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchStudentClass = async () => {
      try {
        const token = localStorage.getItem("studentAuthToken");
        // Get student info
        const studentRes = await fetch(`${baseUrl}/student/data`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const studentData = await studentRes.json();
        if (!studentData.className) {
          setMessage("You are not registered in any class.");
          setLoading(false);
          return;
        }

        // Get class details
        const classRes = await fetch(
          `/api/teacher/class/${studentData.className}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const classData = await classRes.json();
        setStudentClass(classData);

        // Get all courses to map course IDs to names
        const coursesRes = await fetch("/api/teacher/courses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const coursesData = await coursesRes.json();
        const courseMap = {};
        (Array.isArray(coursesData)
          ? coursesData
          : coursesData.courses || []
        ).forEach((course) => {
          courseMap[course._id] = course.name;
        });

        setCourses(
          (classData.courses || []).map((id) => ({
            id,
            name: courseMap[id] || "Unknown Course",
          }))
        );
        setLoading(false);
      } catch (err) {
        setMessage("Failed to load class information.");
        setLoading(false);
      }
    };

    fetchStudentClass();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-lg">Loading...</div>;
  }

  if (message) {
    return <div className="p-8 text-center text-red-600">{message}</div>;
  }

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      <Header title="PresencePal - Student Portal" />
      <div className="flex flex-1">
        <StudentSideBar />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-10">
            <h2 className="text-2xl font-bold mb-6 text-blue-800">My Class</h2>
            <div className="mb-4">
              <span className="font-semibold text-lg">Class Name:</span>{" "}
              <span className="text-gray-700">{studentClass.name}</span>
            </div>
            <div>
              <span className="font-semibold text-lg">Courses:</span>
              <ul className="list-disc ml-6 mt-2">
                {courses.length > 0 ? (
                  courses.map((course) => (
                    <li key={course.id} className="text-gray-800">
                      {course.name}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-400 italic">No courses assigned</li>
                )}
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentClassPage;
