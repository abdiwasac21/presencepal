'use client';
import { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { BrowserMultiFormatReader } from '@zxing/library';
import Sidebar from '@/components/StudentSideBar';
import Header from '@/components/Header';

const baseUrl = "https://presencepalbackend-1.onrender.com";
// const baseUrl = 'http://localhost:80';

export default function StudentScanPage() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [scanResult, setScanResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const videoRef = useRef(null);
  const router = useRouter();

  const codeReader = useMemo(() => new BrowserMultiFormatReader(), []);

  // Fetch student courses from /student/courses
  useEffect(() => {
    const token = localStorage.getItem('studentAuthToken');
    if (!token) {  
      router.push('/student/login');
      return;
    }

    const fetchCourses = async () => {
      try {
        const response = await fetch(`${baseUrl}/student/courses`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        setCourses(Array.isArray(data) ? data : data.data || []);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
        setCourses([]);
      }
    };

    fetchCourses();
  }, [router]);

  useEffect(() => {
    let active = true;
    if (videoRef.current && selectedCourse) {
      codeReader.decodeFromVideoDevice(null, videoRef.current, (result, error) => {
        if (!active) return;
        if (result) {
          let sessionId = null;
          try {
            // Try to parse as JSON first
            const qrData = JSON.parse(result.getText());
            sessionId = qrData.sessionId;
          } catch (e) {
            // If not JSON, treat as plain sessionId
            sessionId = result.getText();
          }
          if (!sessionId) {
            setErrorMsg('QR code missing session ID.');
            codeReader.reset();
            return;
          }
          setScanResult(`Session: ${sessionId}`);
          handleSendAttendance(sessionId, selectedCourse);
          codeReader.reset();
        }
        if (error && !(error instanceof Error)) {
          setErrorMsg('Scanning error.');
        }
      }).catch((err) => {
        setErrorMsg('Could not access camera or start scanner.');
      });
    }
    return () => {
      active = false;
      codeReader.reset();
    };
    // eslint-disable-next-line
  }, [codeReader, selectedCourse]);

  const handleSendAttendance = async (sessionId, courseId) => {
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      // Get geolocation
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      const { latitude, longitude } = position.coords;

      // Get deviceToken
      const deviceToken = localStorage.getItem('deviceToken');
      if (!deviceToken) {
        setErrorMsg('Device token not found. Please log in again.');
        setLoading(false);
        return;
      }
      const token = localStorage.getItem('studentAuthToken');

      const res = await fetch(`${baseUrl}/student/scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sessionId,
          courseId,
          location: { lat: latitude, lng: longitude },
          deviceToken,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg('Attendance marked successfully!');
        setTimeout(() => router.push('/student/dashboard'), 1500);
      } else {
        setErrorMsg(data.message || 'Failed to mark attendance.');
      }
    } catch (err) {
      setErrorMsg('Failed to mark attendance.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Scan Attendance QR" />
        <main className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4 text-center">Scan Attendance QR</h1>
            {errorMsg && (
              <div className="mb-4 text-red-600 text-center">{errorMsg}</div>
            )}
            {successMsg && (
              <div className="mb-4 text-green-600 text-center">{successMsg}</div>
            )}
            <select
              className="w-full mb-4 p-2 border border-gray-300 rounded"
              value={selectedCourse}
              onChange={e => setSelectedCourse(e.target.value)}
              required
            >
              <option value="">Select Course</option>
              {courses.map(course => (
                <option key={course._id} value={course._id}>
                  {course.name} ({course.code})
                </option>
              ))}
            </select>
            {!scanResult && selectedCourse && (
              <div className="w-full flex flex-col items-center">
                <video
                  ref={videoRef}
                  className="w-full h-64 rounded border border-gray-300 bg-black"
                  autoPlay
                  muted
                />
                <p className="mt-4 text-center text-gray-600">Scanning...</p>
              </div>
            )}
            {!selectedCourse && (
              <div className="text-gray-500 mb-4">Please select a course to start scanning.</div>
            )}
            {scanResult && (
              <div className="text-center">
                <p className="text-xl font-semibold text-green-700">QR Data Scanned:</p>
                <p className="break-all text-gray-800">{scanResult}</p>
                {loading ? (
                  <p className="text-center mt-4 text-blue-600">Submitting attendance...</p>
                ) : null}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}