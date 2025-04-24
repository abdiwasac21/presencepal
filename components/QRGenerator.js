'use client';

import { useState } from 'react';

export default function QRGenerator({ classId, courseId }) {
  const [qrImage, setQrImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

const token = localStorage.getItem('authToken');


  const generateQR = async () => {
    setLoading(true);
    setError('');
    try {
        const token = localStorage.getItem('authToken');;

      const res = await fetch('http://localhost:80/teacher/generate-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ classId, courseId }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'QR generation failed');

      setQrImage(data.qrImage);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-xl shadow-md bg-white mt-6">
      <h2 className="text-xl font-semibold mb-2">Generate Attendance QR</h2>

      <button
        onClick={generateQR}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate QR Code'}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {qrImage && (
        <div className="mt-4 text-center">
          <img src={qrImage} alt="QR Code" className="mx-auto w-40" />
          <p className="text-sm text-gray-500 mt-2">Scan to mark attendance</p>
        </div>
      )}
    </div>
  );
}
