"use client";
import React, { useState } from 'react';

const ClassCreate = () => {
  const [className, setClassName] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [message, setMessage] = useState("");

  // Dummy options. Replace with fetched data in real use.
  const studentOptions = [
    { id: 1, name: "Student A" },
    { id: 2, name: "Student B" }
  ];

  const courseOptions = [
    { id: 1, name: "Course 101" },
    { id: 2, name: "Course 102" }
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
          className,
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
    <div>
      <h1>Create New Class</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Class Name:
            <input 
              type="text" 
              value={className} 
              onChange={(e) => setClassName(e.target.value)} 
              required 
            />
          </label>
        </div>
        <div>
          <h3>Select Students:</h3>
          {studentOptions.map(student => (
            <label key={student.id}>
              <input 
                type="checkbox" 
                value={student.id} 
                onChange={() => toggleSelection(student.id, selectedStudents, setSelectedStudents)}
                checked={selectedStudents.includes(student.id)}
              />
              {student.name}
            </label>
          ))}
        </div>
        <div>
          <h3>Select Courses:</h3>
          {courseOptions.map(course => (
            <label key={course.id}>
              <input 
                type="checkbox" 
                value={course.id} 
                onChange={() => toggleSelection(course.id, selectedCourses, setSelectedCourses)}
                checked={selectedCourses.includes(course.id)}
              />
              {course.name}
            </label>
          ))}
        </div>
        <button type="submit">Create Class</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ClassCreate;