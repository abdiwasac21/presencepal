"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const baseUrl = 'https://presencepalbackend-1.onrender.com'; // Adjust this to your actual base URL

const StudentLogin = () => {
    const [universityId, setUniversityId] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); // Loading state
    const router = useRouter();




    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
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
                // Try to get error message from backend
                let errorMsg = "Invalid university ID or password.";
                try {
                    const errorData = await response.json();
                    if (errorData && errorData.message) {
                        errorMsg = errorData.message;
                    }
                } catch {
                    // If response is not JSON, keep default errorMsg
                }
                alert(errorMsg);
                setLoading(false);
                return;
            }
    
            const data = await response.json();
            console.log('Login successful:', data);
    
            // Save the token and login state in localStorage
            localStorage.setItem('isStudentLoggedIn', 'true');
            localStorage.setItem('studentAuthToken', data.token); // Store the auth token
            localStorage.setItem('studentName', data.student.name);
            if (data.student.deviceToken) {
                localStorage.setItem('deviceToken', data.student.deviceToken);
            } else {
                localStorage.setItem('deviceToken', 'dummy-device-token');
            }
            // Redirect to the student dashboard
            router.push('/student/dashboard');
        } catch (error) {
            console.error('Error logging in:', error);
            alert('An error occurred while trying to log in. Please try again.');
        } finally {
            setLoading(false); // Stop loading state
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-xs p-6 bg-white rounded-lg shadow-md">
                <h2 className="mb-4 text-2xl font-bold text-center">Student Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="University ID"
                        value={universityId}
                        onChange={(e) => setUniversityId(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                        type="submit"
                        className={`w-full py-2 text-white bg-green-600 rounded-md hover:bg-green-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default StudentLogin;
