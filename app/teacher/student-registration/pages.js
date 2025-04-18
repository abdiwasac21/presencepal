"use client";
import React, { useState } from 'react';

const StudentRegister = () => {
  const [students, setStudents] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Split the entered text by newline and filter out empty lines
      const studentList = students.split('\n').filter(s => s.trim() !== '');
      const response = await fetch('/teacher/student/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ students: studentList })
      });
      const data = await response.json();
      setMessage(data.message || "Registration successful");
    } catch (error) {
      console.error("Error registering students:", error);
      setMessage("Registration failed");
    }
  };

  return (
    <div>
      <h1>Batch Student Registration</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Students <br />
          (enter one student per line):
          <br />
          <textarea 
            value={students} 
            onChange={(e) => setStudents(e.target.value)} 
            rows="10" 
            cols="50" 
            placeholder="Student1&#10;Student2&#10;Student3"
          />
        </label>
        <br />
        <button type="submit">Register Students</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default StudentRegister;