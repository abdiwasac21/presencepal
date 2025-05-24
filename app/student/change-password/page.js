"use client";
import { useState } from "react";
import Header from "@/components/Header";
import StudentSideBar from "@/components/StudentSideBar";

const baseUrl = "https://presencepalbackend-1.onrender.com";
// const baseUrl = "http://localhost:80";

export default function ChangePasswordPage() {
  const [oldPassword, setoldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage("");
    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("studentAuthToken");
      const res = await fetch(`${baseUrl}/student/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Password changed successfully!");
        setoldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setMessage(data.message || "Failed to change password.");
      }
    } catch (err) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <StudentSideBar />
      <div className="flex-1 flex flex-col">
        <Header title="Change Password" />
        <main className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-2xl font-bold mb-6 text-blue-800 text-center">
              Change Password
            </h1>
            <form onSubmit={handleChangePassword} className="space-y-6">
              <div>
                <label className="block text-blue-700 font-semibold mb-2">
                  old Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={oldPassword}
                  onChange={(e) => setoldPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-blue-700 font-semibold mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-blue-700 font-semibold mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                disabled={loading}
              >
                {loading ? "Changing..." : "Change Password"}
              </button>
            </form>
            {message && (
              <div
                className={`mt-6 text-center font-medium ${
                  message.includes("success")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {message}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
