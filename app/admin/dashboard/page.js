"use client";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/sideBar';
import Header from '@/components/Header';
import { Users, Calendar, CheckSquare } from "lucide-react";
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const baseUrl = 'http://localhost:80';

const attendanceData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  datasets: [
    {
      label: 'Attendance %',
      data: [95, 97, 93, 98, 96],
      borderColor: '#2563eb',
      backgroundColor: 'rgba(37,99,235,0.2)',
      tension: 0.4,
    },
  ],
};

const TeacherDashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalClasses, setTotalClasses] = useState(0);
  const [recentStudents, setRecentStudents] = useState([]);
  const [engagementData, setEngagementData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const loggedIn = localStorage.getItem('loggedIn');
    const email = localStorage.getItem('email');
    if (loggedIn && email) {
      setUser({ email });
    } else {
      router.push('/teacher/login');
    }
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const fetchStats = async () => {
      try {
        const [studentsRes, classesRes] = await Promise.all([
          fetch(`${baseUrl}/teacher/student`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${baseUrl}/teacher/classes`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const studentsData = await studentsRes.json();
        const classesData = await classesRes.json();

        const studentsArray = Array.isArray(studentsData)
          ? studentsData
          : studentsData.students || [];

        const classesArray = Array.isArray(classesData)
          ? classesData
          : classesData.classes || [];

        setTotalStudents(studentsArray.length);
        setRecentStudents(studentsArray.slice(0, 5));
        setTotalClasses(classesArray.length);

        // Generate engagement chart from class data
        const labels = classesArray.map(cls => cls.name || cls.className || 'Unnamed Class');
        const studentCounts = classesArray.map(cls => cls.students?.length || 0);
        const colors = ['#6366f1', '#0ea5e9', '#22d3ee', '#38bdf8', '#4ade80', '#facc15', '#f87171'];

        setEngagementData({
          labels,
          datasets: [
            {
              label: 'Students per Class',
              data: studentCounts,
              backgroundColor: colors.slice(0, labels.length),
              borderRadius: 8,
            },
          ],
        });

      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setTotalStudents(0);
        setTotalClasses(0);
        setRecentStudents([]);
        setEngagementData({ labels: [], datasets: [] });
      }
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('email');
    localStorage.removeItem('authToken');
    router.push('/teacher/login');
  };

  const stats = [
    { label: "Total Students", value: totalStudents, icon: <Users className="w-8 h-8 text-blue-500" /> },
    { label: "Active Classes", value: totalClasses, icon: <Calendar className="w-8 h-8 text-emerald-500" /> },
    { label: "Attendance Today", value: "97%", icon: <CheckSquare className="w-8 h-8 text-indigo-500" /> },
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-50 to-blue-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Admin Dashboard" />
        <div className="p-6 md:p-10 flex-1">
          <h1 className="text-3xl font-extrabold text-blue-700 mb-8 tracking-tight drop-shadow">Admin Dashboard</h1>

          {/* Stats Panel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center">
                <div className="mb-2">{stat.icon}</div>
                <span className="text-4xl font-bold">{stat.value}</span>
                <span className="text-gray-500 mt-2">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="font-semibold text-blue-700 mb-4">Attendance Trends</div>
              <Line
                data={attendanceData}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                  scales: { y: { min: 80, max: 100 } },
                }}
              />
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="font-semibold text-blue-700 mb-4">Students per Class</div>
              <Bar
                data={engagementData}
                options={{
                  responsive: true,
                  plugins: { legend: { display: true } },
                  scales: { y: { beginAtZero: true } },
                }}
              />
            </div>
          </div>

          {/* Recent Students */}
          <div className="mt-12 bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">Recent Students</h2>
            {recentStudents.length > 0 ? (
              <ul>
                {recentStudents.map((student, index) => (
                  <li key={index} className="text-gray-700 py-1 border-b last:border-none">
                    {student.name || 'Unnamed'} – {student.universityId}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No students found.</p>
            )}
          </div>

          {/* User Info & Logout */}
          <div className="mt-12 bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center">
            {user ? (
              <>
                <p className="mb-2 text-lg">Welcome, <span className="font-semibold">{user.email}</span>!</p>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 text-white bg-red-600 rounded-xl hover:bg-red-700 transition font-semibold mt-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <p>Please log in first.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
