'use client';
import { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { BrowserMultiFormatReader } from '@zxing/library';
import Sidebar from '@/components/sideBar';
import Header from '@/components/Header';

export default function StudentScanPage() {
  const [scanResult, setScanResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const videoRef = useRef(null);
  const router = useRouter();

  const codeReader = useMemo(() => new BrowserMultiFormatReader(), []);

  useEffect(() => {
    let active = true;
    if (videoRef.current) {
      codeReader.decodeFromVideoDevice(null, videoRef.current, (result, error) => {
        if (!active) return;
        if (result) {
          setScanResult(result.getText());
          handleSendAttendance(result.getText());
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
  }, [codeReader]);

  const handleSendAttendance = async (sessionId) => {
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch('http://localhost:80/student/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sessionId }),
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
            {!scanResult && (
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
            {scanResult && (
              <div className="text-center">
                <p className="text-xl font-semibold text-green-700">Session ID Scanned:</p>
                <p className="break-all text-gray-800">{scanResult}</p>
                <p className="text-center mt-4 text-blue-600">Submitting attendance...</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}