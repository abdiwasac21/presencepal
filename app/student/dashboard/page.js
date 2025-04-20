"use client";
import { Component } from "lucide-react";
import { useEffect, useState } from "react";
import StudentSideBar from "@/components/StudentSideBar";
import Header from "@/components/Header";

const baseUrl = "http://localhost:80";

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isStudentLoggedIn");
    if (!isLoggedIn) {
      window.location.href = "/student/login";
      return;
    }

    const fetchStudentData = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        console.log("Auth Token:", authToken); // Log the token to make sure it's correct
        
        if (!authToken) {
          console.error("No authToken found in localStorage");
          return;
        }

        const response = await fetch(`${baseUrl}student/data`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`, // Send the token in the Authorization header
          },
        });

        console.log("Response status:", response.status); // Log the response status
        
        if (response.ok) {
          const data = await response.json();
          console.log("Data received:", data); // Log the data
          setStudentData(data);
        } else {
          const errorText = await response.text();
          console.error(`Failed to fetch student data. Status: ${response.status}`, errorText);
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    fetchStudentData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isStudentLoggedIn");
    localStorage.removeItem("authToken");
    window.location.href = "/student/login";
  }

  return (
    <div className="flex">
      <StudentSideBar />
      <div className="flex-1">
        <Header title="Student Dashboard" />
        <div className="p-8 bg-gray-50 min-h-screen">
          <h1 className="text-3xl font-bold mb-4">Student Dashboard</h1>
          {studentData ? (
            <>
              <p className="mb-4">Welcome, {studentData.email}!</p>
              <p>Name: {studentData.name}</p>
              <p>Grade: {studentData.class}</p>
              <p>Roll Number: {studentData.universityId}</p>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>

    </div>
      
  );
};

export default StudentDashboard;
