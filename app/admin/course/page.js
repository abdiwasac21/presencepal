"use client";
import React, { useState } from 'react';
import Sidebar from "@/components/sideBar";
import Header from "@/components/Header";

const baseUrl = "https://presencepalbackend-1.onrender.com";
// const baseUrl = "http://localhost:80";


const CoursesCreate = () => {
  const [batchName, setBatchName] = useState("");
  const [courses, setCourses] = useState([
    { name: "", code: "", teacher: "", semester: "" }
  ]);
  const [message, setMessage] = useState("");

  const handleMultipleCourseChange = (index, field, value) => {
    const updatedCourses = [...courses];
    updatedCourses[index][field] = value;
    setCourses(updatedCourses);
  };

  const addCourseField = () => {
    setCourses([...courses, { name: "", code: "", teacher: "", semester: "" }]);
  };

  const removeCourseField = (index) => {
    if (courses.length === 1) return;
    setCourses(courses.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      const payload = {
        className: batchName,
        courses: courses.map(course => ({
          ...course,
          semester: Number(course.semester)
        }))
      };
      const url = `${baseUrl}/teacher/create/course`;

      const response = await fetch(url, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      setMessage(data.message || "Course(s) added successfully");
      setBatchName("");
      setCourses([{ name: "", code: "", teacher: "", semester: "" }]);
    } catch (error) {
      console.error("Error creating courses:", error);
      setMessage("Failed to add course(s)");
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-blue-200">
      <Sidebar />
      <div className="flex-1 p-0 md:p-8 flex flex-col">
        <Header title="Create Courses" />
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 mt-8 mb-8 border border-blue-100">
            <h1 className="text-4xl font-extrabold text-center mb-8 text-blue-700 tracking-tight drop-shadow">
              Add Multiple Courses
            </h1>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-blue-700 text-lg font-semibold mb-2" htmlFor="batchName">
                  Batch/Class Name
                </label>
                <input 
                  id="batchName"
                  type="text"
                  value={batchName}
                  onChange={(e) => setBatchName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-base bg-blue-50"
                  placeholder="e.g. BSE 2025"
                />
              </div>
              {courses.map((course, index) => (
                <div key={index} className="relative border border-blue-100 bg-blue-50 p-6 rounded-xl mb-6 shadow transition hover:shadow-lg">
                  <div className="absolute top-4 right-4">
                    {courses.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCourseField(index)}
                        className="text-red-500 hover:text-red-700 transition"
                        title="Remove this course"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-blue-700 font-medium mb-1" htmlFor={`course-name-${index}`}>
                        Course Name
                      </label>
                      <input 
                        id={`course-name-${index}`}
                        type="text" 
                        value={course.name}
                        onChange={(e) => handleMultipleCourseChange(index, 'name', e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                        placeholder="e.g. Data Structures"
                      />
                    </div>
                    <div>
                      <label className="block text-blue-700 font-medium mb-1" htmlFor={`course-code-${index}`}>
                        Course Code
                      </label>
                      <input 
                        id={`course-code-${index}`}
                        type="text" 
                        value={course.code}
                        onChange={(e) => handleMultipleCourseChange(index, 'code', e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                        placeholder="e.g. CS101"
                      />
                    </div>
                    <div>
                      <label className="block text-blue-700 font-medium mb-1" htmlFor={`teacher-email-${index}`}>
                        Teacher Email
                      </label>
                      <input 
                        id={`teacher-email-${index}`}
                        type="email" 
                        value={course.teacher}
                        onChange={(e) => handleMultipleCourseChange(index, 'teacher', e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                        placeholder="teacher@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-blue-700 font-medium mb-1" htmlFor={`semester-${index}`}>
                        Semester
                      </label>
                      <input 
                        id={`semester-${index}`}
                        type="number" 
                        value={course.semester}
                        onChange={(e) => handleMultipleCourseChange(index, 'semester', e.target.value)}
                        required
                        min="1"
                        max="8"
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                        placeholder="e.g. 2"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex justify-end">
                <button 
                  type="button" 
                  onClick={addCourseField}
                  className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-2 px-5 rounded-lg shadow transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Another Course
                </button>
              </div>
              <div className="mt-8 text-center">
                <button 
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-bold py-3 px-10 rounded-xl shadow-lg text-lg transition"
                >
                  Submit Courses
                </button>
              </div>
            </form>
            {message && (
              <div className={`mt-8 text-center text-base font-semibold ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesCreate;