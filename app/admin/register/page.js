"use client";
import React, { useState } from 'react';
import  Sidebar  from '@/components/sideBar';
import Header from '@/components/Header';

const baseUrl = "https://presencepalbackend-1.onrender.com";

const StudentRegister = () => {
  const [form, setForm] = useState({
    name: "",
    universityId: "",
    password: "",
    className: ""
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${baseUrl}/teacher/student/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify([form])
      });

      // Check for non-JSON response (e.g., HTML error page)
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Server error or invalid response");
      }

      setMessage(data.message || "Registration successful");
      setForm({ name: "", universityId: "", password: "", className: "" });
    } catch (error) {
      console.error("Error registering student:", error);
      setMessage("Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-blue-200">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Register Student" />
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8 mt-8 mb-8">
            <h1 className="text-3xl font-bold text-center mb-8 text-blue-700">Register a Student</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 text-lg font-semibold mb-2" htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-lg font-semibold mb-2" htmlFor="universityId">
                  University ID
                </label>
                <input
                  id="universityId"
                  name="universityId"
                  type="text"
                  value={form.universityId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
                  placeholder="12345"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-lg font-semibold mb-2" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
                  placeholder="Enter password"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-lg font-semibold mb-2" htmlFor="className">
                  Class Name
                </label>
                <input
                  id="className"
                  name="className"
                  type="text"
                  value={form.className}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
                  placeholder="BSE"
                />
              </div>
              <div className="flex justify-center">
                <button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-lg shadow transition duration-150"
                >
                  Register Student
                </button>
              </div>
            </form>
            {message && (
              <div className={`mt-6 text-center text-base font-medium ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentRegister;