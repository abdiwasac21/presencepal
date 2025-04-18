"use client";
import React, { useState } from 'react';
import Sidebar from "@/components/sideBar";
import Header from "@/components/Header";

const ClassCreate = () => {
  const [className, setClassName] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [message, setMessage] = useState("");

  // Dummy options with example IDs (replace with real data as necessary)
  const studentOptions = [
    { id: "67d81341caa4ea3c365bae9c", name: "Student A" },
    { id: "67dff353efddae447470683a", name: "Student B" },
    { id: "67dff354efddae447470683d", name: "Student C" },
    { id: "67dffc675a5ef5fd4c952926", name: "Student D" }
  ];

  const courseOptions = [
    { id: "67e3ec63aeefe8ca531ef5cf", name: "Course 101" },
    { id: "67e3ec63aeefe8ca531ef5d1", name: "Course 102" },
    { id: "67e3ec63aeefe8ca531ef5d3", name: "Course 103" },
    { id: "67e3ec63aeefe8ca531ef5d5", name: "Course 104" },
    { id: "67e3ec63aeefe8ca531ef5d7", name: "Course 105" }
  ];

  const toggleSelection = (id, selection, setSelection) => {
    setSelection(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/teacher/class/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: className,
          students: selectedStudents,
          courses: selectedCourses
        })
      });
      const data = await response.json();
      setMessage(data.message || "Class created successfully");
    } catch (error) {
      console.error("Error creating class:", error);
      setMessage("Failed to create class");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <Header title="Create New Class" />
        <div className="max-w-2xl mx-auto bg-white p-8 shadow rounded">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Class Name:
              </label>
              <input 
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-2">Select Students:</h3>
              <div className="grid grid-cols-2 gap-2">
                {studentOptions.map(student => (
                  <label key={student.id} className="flex items-center space-x-2">
                    <input 
                      type="checkbox"
                      value={student.id}
                      onChange={() => toggleSelection(student.id, selectedStudents, setSelectedStudents)}
                      checked={selectedStudents.includes(student.id)}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <span className="text-gray-700">{student.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-2">Select Courses:</h3>
              <div className="grid grid-cols-2 gap-2">
                {courseOptions.map(course => (
                  <label key={course.id} className="flex items-center space-x-2">
                    <input 
                      type="checkbox"
                      value={course.id}
                      onChange={() => toggleSelection(course.id, selectedCourses, setSelectedCourses)}
                      checked={selectedCourses.includes(course.id)}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <span className="text-gray-700">{course.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="text-center">
              <button 
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
              >
                Create Class
              </button>
            </div>
          </form>
          {message && <p className="mt-4 text-center text-sm text-gray-700">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default ClassCreate;
