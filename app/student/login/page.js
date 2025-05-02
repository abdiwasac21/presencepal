"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const baseUrl = 'https://presencepalbackend-1.onrender.com';

const StudentLogin = () => {
    const [universityId, setUniversityId] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');
        try {
            const response = await fetch(`${baseUrl}/api/auth/student/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    universityId,
                    password,
                }),
            });

            if (!response.ok) {
                let errorMsg = "Invalid university ID or password.";
                try {
                    const errorData = await response.json();
                    if (errorData && errorData.message) {
                        errorMsg = errorData.message;
                    }
                } catch {}
                setErrorMsg(errorMsg);
                setLoading(false);
                return;
            }

            const data = await response.json();
            localStorage.setItem('isStudentLoggedIn', 'true');
            localStorage.setItem('studentAuthToken', data.token);
            localStorage.setItem('studentName', data.student.name);
            if (data.student.deviceToken) {
                localStorage.setItem('deviceToken', data.student.deviceToken);
            } else {
                localStorage.setItem('deviceToken', 'dummy-device-token');
            }
            router.push('/student/dashboard');
        } catch (error) {
            setErrorMsg('An error occurred while trying to log in. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 via-green-200 to-green-300">
            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl flex flex-col items-center">
                <div className="mb-6 flex flex-col items-center">
                    <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-lg mb-2">
                        PP
                    </div>
                    <h2 className="text-3xl font-extrabold text-green-700 mb-1">PresencePal</h2>
                    <p className="text-gray-500 text-sm">Student Login</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5 w-full">
                    <input
                        type="text"
                        placeholder="University ID"
                        value={universityId}
                        onChange={(e) => setUniversityId(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                        autoFocus
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                    />
                    {errorMsg && (
                        <div className="text-red-600 text-center font-semibold bg-red-50 rounded p-2">{errorMsg}</div>
                    )}
                    <button
                        type="submit"
                        className={`w-full py-3 text-white bg-green-600 rounded-lg font-semibold shadow hover:bg-green-700 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <div className="mt-6 text-gray-400 text-xs text-center">
                    &copy; {new Date().getFullYear()} PresencePal. All rights reserved.
                </div>
            </div>
        </div>
    );
};

export default StudentLogin;