"use client";
import React, { useState } from 'react';
import Sidebar from "@/components/sideBar";
import Header from "@/components/Header";

const CoursesCreate = () => {
  const [creationType, setCreationType] = useState("single"); // "single" or "multiple"
  const [singleCourse, setSingleCourse] = useState({ name: "", code: "" });
  const [batchName, setBatchName] = useState("");
  const [courses, setCourses] = useState([{ name: "", code: "" }]);
  const [message, setMessage] = useState("");

  // Retrieve auth token from localStorage
  const token = localStorage.getItem("authToken");

  const handleSingleChange = (e) => {
    setSingleCourse({
      ...singleCourse,
      [e.target.name]: e.target.value
    });
  };

  const handleMultipleCourseChange = (index, field, value) => {
    const updatedCourses = [...courses];
    updatedCourses[index][field] = value;
    setCourses(updatedCourses);
  };

  const addCourseField = () => {
    setCourses([...courses, { name: "", code: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let payload;
      let url;
      if (creationType === "single") {
        payload = {
          name: singleCourse.name,
          code: singleCourse.code
        };
        url = "http://localhost:80/teacher/create/single/course";
      } else {
        payload = {
          name: batchName,
          courses: courses
        };
        url = "http://localhost:80/teacher/create/course";
      }
  
      const response = await fetch(url, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // ✅ token is now properly defined
        },
        body: JSON.stringify(payload)
      });
  
      const data = await response.json();
      setMessage(data.message || "Course(s) added successfully");
    } catch (error) {
      console.error("Error creating courses:", error);
      setMessage("Failed to add course(s)");
    }
  };
  

  return (
    <div className="min-h-screen flex">
      {/* Sidebar on the left */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 p-6">
        <Header title="Create Courses" />

        <h1 className="text-3xl font-bold text-center mb-6">
          Add {creationType === "single" ? "Single Course" : "Multiple Courses"}
        </h1>

        <div className="mb-6 flex justify-center space-x-4">
          <button 
            onClick={() => setCreationType("single")}
            className={`px-4 py-2 rounded ${creationType === "single" ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-800"}`}
          >
            Single Course
          </button>
          <button 
            onClick={() => setCreationType("multiple")}
            className={`px-4 py-2 rounded ${creationType === "multiple" ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-800"}`}
          >
            Multiple Courses
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          {creationType === "single" ? (
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Course Name:
                  <input 
                    type="text" 
                    name="name"
                    value={singleCourse.name}
                    onChange={handleSingleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  />
                </label>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Course Code:
                  <input 
                    type="text" 
                    name="code"
                    value={singleCourse.code}
                    onChange={handleSingleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  />
                </label>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Batch/Class Name:
                  <input 
                    type="text"
                    value={batchName}
                    onChange={(e) => setBatchName(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  />
                </label>
              </div>
              {courses.map((course, index) => (
                <div key={index} className="border border-gray-200 p-4 rounded mb-4">
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Course Name:
                      <input 
                        type="text" 
                        value={course.name}
                        onChange={(e) => handleMultipleCourseChange(index, 'name', e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                      />
                    </label>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Course Code:
                      <input 
                        type="text" 
                        value={course.code}
                        onChange={(e) => handleMultipleCourseChange(index, 'code', e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                      />
                    </label>
                  </div>
                </div>
              ))}
              <div className="flex justify-end">
                <button 
                  type="button" 
                  onClick={addCourseField}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                >
                  Add Another Course
                </button>
              </div>
            </div>
          )}
          <div className="mt-6 text-center">
            <button 
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
            >
              Submit {creationType === "single" ? "Course" : "Courses"}
            </button>
          </div>
        </form>
        {message && <p className="text-center text-sm text-gray-700">{message}</p>}
      </div>
    </div>
  );
};

export default CoursesCreate;