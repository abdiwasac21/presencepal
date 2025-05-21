"use client";
import React, { useState, useEffect } from 'react';
import Sidebar from "@/components/sideBar";
import Header from "@/components/Header";
import { ChevronDown, ChevronUp } from "lucide-react";

const baseUrl = "https://presencepalbackend-1.onrender.com";

const ClassPage = () => {
  const [className, setClassName] = useState("");
  const [message, setMessage] = useState("");
  const [classes, setClasses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [courseMap, setCourseMap] = useState({});
  const [openCourses, setOpenCourses] = useState({}); // Track which class cards are open

  useEffect(() => {
    fetchClasses();
    fetchCourses();
  }, []);

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${baseUrl}/teacher/classes`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseErr) {
        setMessage("Invalid server response");
        setClasses([]);
        return;
      }
      setClasses(Array.isArray(data) ? data : []);
    } catch (err) {
      setMessage("Failed to fetch classes");
      setClasses([]);
    }
  };

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${baseUrl}/teacher/courses`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      const map = {};
      (Array.isArray(data) ? data : (data.courses || [])).forEach(course => {
        map[course._id] = course.name;
      });
      setCourseMap(map);
    } catch (err) {
      console.error("Failed to fetch courses", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${baseUrl}/teacher/create/class`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name: className })
      });
      const data = await res.json();
      setMessage(data.message || "Class created successfully");
      setClassName("");
      fetchClasses();
    } catch (err) {
      setMessage("Failed to create class");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this class?")) return;
    try {
      const token = localStorage.getItem("authToken");
      await fetch(`${baseUrl}/teacher/class/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      setMessage("Class deleted");
      fetchClasses();
    } catch (err) {
      setMessage("Failed to delete class");
    }
  };

  const startEdit = (id, name) => {
    setEditingId(id);
    setEditName(name);
  };

  const handleUpdate = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      await fetch(`${baseUrl}/teacher/class/${id}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name: editName })
      });
      setEditingId(null);
      setEditName("");
      setMessage("Class updated");
      fetchClasses();
    } catch (err) {
      setMessage("Failed to update class");
    }
  };

  // Toggle open/close for courses in a class card
  const toggleCourses = (id) => {
    setOpenCourses(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="h-screen flex bg-gradient-to-br from-indigo-50 to-blue-100">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <Header title="Manage Classes" />
        <div className="max-w-2xl mx-auto bg-white p-8 shadow-2xl rounded-2xl mb-10 mt-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-blue-700 text-lg font-semibold mb-2">
                Class Name
              </label>
              <input 
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-base bg-blue-50"
                placeholder="Enter new class name"
              />
            </div>
            <div className="text-center">
              <button 
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-bold py-3 px-10 rounded-xl shadow-lg text-lg transition"
              >
                Create Class
              </button>
            </div>
          </form>
          {message && <p className="mt-6 text-center text-base font-semibold text-blue-600">{message}</p>}
        </div>

        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-extrabold mb-8 text-blue-700 tracking-tight">All Classes</h2>
          {classes.length === 0 && <p className="text-gray-500">No classes found.</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map(cls => (
              <div key={cls._id} className="bg-white rounded-xl shadow-lg p-5 flex flex-col border border-blue-100">
                {editingId === cls._id ? (
                  <div className="flex flex-col gap-4">
                    <input
                      type="text"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      className="px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdate(cls._id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-semibold transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="font-semibold text-lg text-blue-800 mb-2">{cls.name}</span>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => startEdit(cls._id, cls.name)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg font-semibold transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(cls._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
                <button
                  className="flex items-center gap-2 mt-4 text-blue-600 hover:text-blue-800 transition text-sm font-medium focus:outline-none"
                  onClick={() => toggleCourses(cls._id)}
                >
                  {openCourses[cls._id] ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      Hide Courses
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      Show Courses
                    </>
                  )}
                </button>
                {openCourses[cls._id] && (
                  <div className="mt-3">
                    <span className="font-medium text-gray-700">Courses:</span>
                    <ul className="list-disc ml-6 mt-1">
                      {(cls.courses && cls.courses.length > 0) ? (
                        cls.courses.map(courseId => (
                          <li key={courseId} className="text-gray-800">
                            {courseMap[courseId] || <span className="text-gray-400 italic">Unknown Course</span>}
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-400 italic">No courses assigned</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassPage;