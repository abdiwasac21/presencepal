"use client";
import React, { useState } from "react";
import Sidebar from "@/components/sideBar";
import Header from "@/components/Header";

const baseUrl = "https://presencepalbackend-1.onrender.com";
// const baseUrl = "http://localhost:80";

const StudentTeacherRegister = () => {
  const [role, setRole] = useState("student"); // 'student' or 'teacher'
  const [form, setForm] = useState({
    name: "",
    universityId: "",
    password: "",
    className: "",
    email: "",
  });
  const [message, setMessage] = useState("");

  const handleRoleChange = (roleValue) => {
    setRole(roleValue);
    setForm({
      name: "",
      universityId: "",
      password: "",
      className: "",
      email: "",
    });
    setMessage("");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    if (!token) {
      setMessage("You are not logged in. Please log in and try again.");
      return;
    }
    try {
      let endpoint = "";
      let payload = {};
      if (role === "student") {
        endpoint = "/teacher/student/register";
        payload = [
          {
            name: form.name,
            universityId: form.universityId,
            password: form.password,
            className: form.className,
          },
        ];
      } else {
        endpoint = "/teacher/create/teacher";
        payload = {
          username: form.name,
          password: form.password,
          email: form.email,
        };
      }

      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Server error or invalid response");
      }

      if (!response.ok) {
        setMessage(data.message || "Registration failed");
      } else {
        setMessage(data.message || "Registration successful");
        setForm({
          name: "",
          universityId: "",
          password: "",
          className: "",
          email: "",
        });
      }
    } catch (error) {
      console.error("Error registering:", error);
      setMessage("Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-blue-200">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Register Student/Teacher" />
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8 mt-8 mb-8">
            <h1 className="text-3xl font-bold text-center mb-8 text-blue-700">
              Register a {role === "student" ? "Student" : "Teacher"}
            </h1>
            <div className="flex justify-center mb-6">
              <button
                type="button"
                className={`px-4 py-2 rounded-l-lg font-semibold border ${
                  role === "student"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
                onClick={() => handleRoleChange("student")}
              >
                Student
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded-r-lg font-semibold border ${
                  role === "teacher"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
                onClick={() => handleRoleChange("teacher")}
              >
                Teacher
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  className="block text-gray-700 text-lg font-semibold mb-2"
                  htmlFor="name"
                >
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
              {role === "student" && (
                <div>
                  <label
                    className="block text-gray-700 text-lg font-semibold mb-2"
                    htmlFor="universityId"
                  >
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
                    placeholder="e.g. 123456"
                  />
                </div>
              )}
              <div>
                <label
                  className="block text-gray-700 text-lg font-semibold mb-2"
                  htmlFor="password"
                >
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
              {role === "student" && (
                <div>
                  <label
                    className="block text-gray-700 text-lg font-semibold mb-2"
                    htmlFor="className"
                  >
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
              )}
              {role === "teacher" && (
                <div>
                  <label
                    className="block text-gray-700 text-lg font-semibold mb-2"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
                    placeholder="teacher@example.com"
                  />
                </div>
              )}
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-lg shadow transition duration-150"
                >
                  Register {role === "student" ? "Student" : "Teacher"}
                </button>
              </div>
            </form>
            {message && (
              <div
                className={`mt-6 text-center text-base font-medium ${
                  message.includes("success")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentTeacherRegister;
