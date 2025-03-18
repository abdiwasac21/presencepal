"use client";
import { useEffect, useState } from "react";

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

        const response = await fetch("http://localhost:80/student/data", {
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-3xl p-6 bg-white rounded-lg shadow-md">
        <h2 className="mb-4 text-2xl font-bold">Student Dashboard</h2>
        {studentData ? (
          <div>
            <h3 className="text-lg font-semibold">Welcome, {studentData.name}</h3>
            {studentData.email ? (
              <p>Email: {studentData.email}</p>
            ) : (
              <p>Email: N/A</p>
            )}
            <p>University ID: {studentData.universityId}</p>
          </div>
        ) : (
          <p>Loading student data...</p>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
