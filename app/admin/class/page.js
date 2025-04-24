"use client";
import React, { useState, useEffect } from 'react';
import Sidebar from "@/components/sideBar";
import Header from "@/components/Header";
import QRGenerator from "@/components/QRGenerator"; // Assuming you have a QRGenerator component

const baseUrl = "http://localhost:80"; // Adjust this to your actual base URL


const ClassPage = () => {
  const [className, setClassName] = useState("");
  const [message, setMessage] = useState("");
  const [classes, setClasses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [courseMap, setCourseMap] = useState({});

  useEffect(() => {
    fetchClasses();
    fetchCourses();
  }, []);

const fetchClasses = async () => {
  try {
    const token = localStorage.getItem("authToken");
    const res = await fetch("http://localhost:80/teacher/classes", {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseErr) {
      setMessage("Invalid server response");
      setClasses([]); // Ensure classes is always an array
      return;
    }
    setClasses(Array.isArray(data) ? data : []); // Always set as array
  } catch (err) {
    setMessage("Failed to fetch classes");
    setClasses([]); // Always set as array
  }
};
// ...existing code...


  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch("http://localhost:80/teacher/courses", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      // data should be an array of courses
      const map = {};
      (Array.isArray(data) ? data : (data.courses || [])).forEach(course => {
        map[course._id] = course.name;
      });
      setCourseMap(map);
    } catch (err) {
      console.error("Failed to fetch courses", err);
    }
  };

  // Create a new class
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch("http://localhost:80/teacher/create/class", {
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

  // ...rest of your code remains unchanged...

  // Delete a class
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

  // Start editing a class
  const startEdit = (id, name) => {
    setEditingId(id);
    setEditName(name);
  };

  // Save class name update
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

    // ...existing code...
    return (
      <div className="min-h-screen flex">
        <Sidebar />
        <div className="flex-1 p-6">
          <Header title="Manage Classes" />
          <div className="max-w-2xl mx-auto bg-white p-8 shadow rounded mb-8">
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
                  placeholder="Enter new class name"
                />
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
  
          <div className="max-w-3xl mx-auto bg-white p-8 shadow rounded">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">All Classes</h2>
            {classes.length === 0 && <p className="text-gray-500">No classes found.</p>}
            <ul className="space-y-6">
              {classes.map(cls => (
                <li key={cls._id} className="border-b pb-4">
                  <div className="flex items-center justify-between">
                    {editingId === cls._id ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                          className="px-2 py-1 border rounded"
                        />
                        <button
                          onClick={() => handleUpdate(cls._id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="font-semibold text-lg">{cls.name}</span>
                        <div className="space-x-2">
                          <button
                            onClick={() => startEdit(cls._id, cls.name)}
                            className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(cls._id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="mt-2 ml-2">
                    <span className="font-medium text-gray-700">Courses:</span>
                    <ul className="list-disc ml-6">
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
                  {/* QRGenerator for this class */}
                  <div className="mt-4">
                    <QRGenerator
                      classId={cls._id}
                      courseId={cls.courses && cls.courses.length > 0 ? cls.courses[0] : null}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  // ...existing code...
};

export default ClassPage;