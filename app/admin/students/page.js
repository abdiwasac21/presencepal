"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import Sidebar from "@/components/sideBar";
import Header from "@/components/Header";

const DEFAULT_PASSWORD = "default_password";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL; // Adjust this to your actual base URL

const CSVUpload = () => {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [csvError, setCsvError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true, // Assumes the CSV file has headers: name, universityId, class
      skipEmptyLines: true,
      complete: (results) => {
        console.log("Parsed CSV:", results.data);
        setStudents(results.data);
        setCsvError(""); // Clear any previous error
      },
      error: (error) => {
        setCsvError("Error parsing CSV file: " + error.message);
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (students.length === 0) {
      setCsvError("No students to register");
      setLoading(false);
      return;
    }

    try {
      // Create the payload based on the parsed CSV
      const payload = students.map((s) => ({
        name: s.name,
        universityId: s.universityId, // Assuming CSV column header "universityId"
        class: s.class || "BSE", // Default to "BSE" if no class is provided
        password: DEFAULT_PASSWORD,
      }));

      console.log("Payload being sent:", JSON.stringify(payload, null, 2));

      // Send a POST request with an array of student objects.
      const response = await fetch(`${baseUrl}/teacher/student/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (err) {
          errorData = {
            message: "Registration failed with status " + response.status,
          };
        }
        console.error("Registration failed:", errorData);
        setCsvError(errorData.message || "Batch registration failed");
      } else {
        router.push("/teacher/dashboard");
      }
    } catch (error) {
      console.error("Batch registration error:", error);
      setCsvError("Error submitting registration: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex">
      {/* Sidebar on the left */}
      <Sidebar />
      {/* Main content with Header and Upload Form */}
      <div className="flex-1">
        <Header title="Batch Student Registration" />
        <div className="p-8 bg-gray-50 min-h-screen">
          <h1 className="text-2xl font-bold mb-4">
            Batch Student Registration
          </h1>
          {csvError && <p className="text-red-500 mb-4">{csvError}</p>}
          <div className="mb-4">
            <label htmlFor="csv-upload" className="block mb-2 font-semibold">
              Upload CSV File:
            </label>
            <input
              id="csv-upload"
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="p-2 border border-gray-300 rounded-md"
            />
          </div>
          {students.length > 0 && (
            <div>
              <h2 className="text-xl mb-2">Parsed Students</h2>
              <ul>
                {students.map((s, index) => (
                  <li key={index}>
                    name= {s.name} id=- {s.universityId} class= - {s.class}
                  </li>
                ))}
              </ul>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {loading ? "Registering..." : "Submit Batch Registration"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CSVUpload;
