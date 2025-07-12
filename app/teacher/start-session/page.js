"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/TeacherSidebar";
import Header from "@/components/Header";
import { BrowserQRCodeSvgWriter } from "@zxing/library";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
// const baseUrl = "http://localhost:80";

export default function TeacherStartSessionPage() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [qrCodeSvg, setQrCodeSvg] = useState("");
  const router = useRouter();

  // Fetch courses only on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const email = localStorage.getItem("email");
        const res = await fetch(
          `${baseUrl}/api/teacher/courses/by-email/${email}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setCourses(data.data || []);
      } catch (err) {
        setCourses([]);
      }
    };
    fetchCourses();
  }, []);

  // Generate QR code SVG whenever sessionId changes
  useEffect(() => {
    if (sessionId) {
      const writer = new BrowserQRCodeSvgWriter();
      const svgElement = writer.write(sessionId, 256, 256);
      setQrCodeSvg(svgElement.outerHTML);
    } else {
      setQrCodeSvg("");
    }
  }, [sessionId]);

  const handleStartSession = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSessionId("");
    try {
      // Get geolocation
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      const { latitude, longitude } = position.coords;

      const token = localStorage.getItem("authToken");
      const res = await fetch(`${baseUrl}/api/teacher/start-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          courseId: selectedCourse,
          location: { lat: latitude, lng: longitude }, // <-- use lat/lng
          durationMinutes: 30,
        }),
      });
      const data = await res.json();
      if (res.ok && data.sessionId) {
        setSessionId(data.sessionId);
      } else {
        setErrorMsg(data.message || "Failed to start session.");
      }
    } catch (err) {
      if (err.code === 1) {
        setErrorMsg(
          "Location permission denied. Please allow location access."
        );
      } else if (err.code === 2) {
        setErrorMsg("Location unavailable. Please check your device settings.");
      } else if (err.code === 3) {
        setErrorMsg("Location request timed out. Try again.");
      } else {
        setErrorMsg("Failed to start session or get location.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Start Attendance Session" />
        <main className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4 text-center text-blue-800">
              Start Attendance Session
            </h1>
            {errorMsg && (
              <div className="mb-4 text-red-600 text-center">{errorMsg}</div>
            )}
            <form
              onSubmit={handleStartSession}
              className="w-full flex flex-col items-center"
            >
              <select
                className="w-full mb-4 p-2 border border-gray-300 rounded"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                required
              >
                <option value="">Select Course</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.name} ({course.code})
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                disabled={loading}
              >
                {loading ? "Starting..." : "Start Session"}
              </button>
            </form>
            {sessionId && (
              <div className="mt-4 flex flex-col items-center">
                <p className="mb-2 text-green-700 font-semibold">
                  Session Started!
                </p>
                <div
                  className="my-2"
                  dangerouslySetInnerHTML={{ __html: qrCodeSvg }}
                />
                <p className="mt-4 text-gray-700 text-sm break-all">
                  Session ID: {sessionId}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
