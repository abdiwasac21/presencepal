"use client";
import React, { useEffect, useState } from "react";

const StudentClassPage = () => {
  const [studentClass, setStudentClass] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchStudentClass = async () => {
      try {
        const token = localStorage.getItem("authToken");
        // Get student info (assuming backend provides /api/student/me)
        const studentRes = await fetch("http://192.168.8.33:80/student/data", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const studentData = await studentRes.json();
        if (!studentData.className) {
          setMessage("You are not registered in any class.");
          setLoading(false);
          return;
        }

        // Get class details
        const classRes = await fetch(`/api/teacher/class/${studentData.className}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const classData = await classRes.json();
        setStudentClass(classData);

        // Get all courses to map course IDs to names
        const coursesRes = await fetch("/api/teacher/courses", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const coursesData = await coursesRes.json();
        const courseMap = {};
        (Array.isArray(coursesData) ? coursesData : (coursesData.courses || [])).forEach(course => {
          courseMap[course._id] = course.name;
        });

        setCourses((classData.courses || []).map(id => ({
          id,
          name: courseMap[id] || "Unknown Course"
        })));
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
    <div className="max-w-xl mx-auto mt-10 bg-white shadow rounded p-8">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">My Class</h1>
      <div className="mb-6">
        <span className="font-semibold text-lg">Class Name:</span>{" "}
        <span className="text-gray-800">{studentClass.name}</span>
      </div>
      <div>
        <span className="font-semibold text-lg">Courses:</span>
        <ul className="list-disc ml-6 mt-2">
          {courses.length > 0 ? (
            courses.map(course => (
              <li key={course.id} className="text-gray-800">{course.name}</li>
            ))
          ) : (
            <li className="text-gray-400 italic">No courses assigned</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default StudentClassPage;