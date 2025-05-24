"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const baseUrl = "https://presencepalbackend-1.onrender.com";

const StudentLogin = () => {
  const [universityId, setUniversityId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      const response = await fetch(`${baseUrl}/api/auth/student/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
      localStorage.setItem("isStudentLoggedIn", "true");
      localStorage.setItem("studentAuthToken", data.token);
      localStorage.setItem("studentName", data.student.name);
      if (data.student.deviceToken) {
        localStorage.setItem("deviceToken", data.student.deviceToken);
      } else {
        localStorage.setItem("deviceToken", "dummy-device-token");
      }
      router.push("/student/dashboard");
    } catch (error) {
      setErrorMsg(
        "An error occurred while trying to log in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-20 left-10 w-40 h-40 bg-yellow-400 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full filter blur-3xl"></div>
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-green-400 rounded-full filter blur-3xl"></div>
      </div>

      {/* University Logo */}
      <div className="absolute top-6 left-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-8 h-8 text-blue-800"
            >
              <path
                fill="currentColor"
                d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"
              />
            </svg>
          </div>
          <span className="ml-3 text-white font-bold text-xl">
            Amoud University
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden border border-white/20">
            {/* Header with university colors */}
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-6 text-center">
              <h1 className="text-3xl font-bold text-white">PresencePal</h1>
              <p className="text-white/90 mt-1">Student Portal Login</p>
            </div>

            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="universityId"
                    className="block text-sm font-medium text-white mb-1"
                  >
                    University ID
                  </label>
                  <input
                    id="universityId"
                    type="text"
                    placeholder="Enter your AU ID"
                    value={universityId}
                    onChange={(e) => setUniversityId(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                    autoFocus
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-white mb-1"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                  />
                </div>

                {errorMsg && (
                  <div className="text-red-300 text-center font-medium bg-red-900/30 rounded-lg p-3 border border-red-400/50">
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-[1.02] ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Authenticating...
                    </span>
                  ) : (
                    <span>Login to Dashboard</span>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-white/70">
                <a
                  href="#"
                  className="text-yellow-300 hover:text-yellow-200 font-medium transition"
                >
                  Forgot your password?
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-white/50 text-xs">
            © {new Date().getFullYear()} PresencePal - Amoud University. All
            rights reserved.
          </div>
        </div>
      </div>

      {/* Floating campus illustration */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center">
        <svg
          width="400"
          height="100"
          viewBox="0 0 400 100"
          className="opacity-20"
        >
          <path
            d="M0,100 C50,60 150,80 200,50 C250,20 350,40 400,0 L400,100 Z"
            fill="white"
          />
        </svg>
      </div>
    </div>
  );
};

export default StudentLogin;
