// src/components/admin/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, GraduationCap, BookOpen, FileText } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalTeachers: 0,
    totalStudents: 0,
    totalQuizzes: 0,
    totalAttempts: 0
  });

  useEffect(() => {
    // Fetch dashboard stats from API
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    // Get real user counts from localStorage
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const teachers = registeredUsers.filter(user => user.role === 'teacher');
    const students = registeredUsers.filter(user => user.role === 'student');
    
    // Mock data - Replace with actual API call
    setStats({
      totalTeachers: teachers.length + 3, // +3 for default mock teachers
      totalStudents: students.length + 3, // +3 for default mock students
      totalQuizzes: 45,
      totalAttempts: 650
    });
  };

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="text-white" size={24} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={GraduationCap}
          title="Total Teachers"
          value={stats.totalTeachers}
          color="bg-blue-500"
        />
        <StatCard
          icon={Users}
          title="Total Students"
          value={stats.totalStudents}
          color="bg-green-500"
        />
        <StatCard
          icon={BookOpen}
          title="Total Quizzes"
          value={stats.totalQuizzes}
          color="bg-purple-500"
        />
        <StatCard
          icon={FileText}
          title="Total Attempts"
          value={stats.totalAttempts}
          color="bg-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/admin/register')}
              className="w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
            >
              <p className="font-medium text-gray-800">Register New User</p>
              <p className="text-sm text-gray-600">Add teachers or students to the system</p>
            </button>
            <button 
              onClick={() => navigate('/admin/users')}
              className="w-full text-left px-4 py-3 bg-green-50 hover:bg-green-100 rounded-lg transition"
            >
              <p className="font-medium text-gray-800">View All Users</p>
              <p className="text-sm text-gray-600">Manage teachers and students</p>
            </button>
            <button 
              onClick={() => navigate('/admin/reports')}
              className="w-full text-left px-4 py-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition"
            >
              <p className="font-medium text-gray-800">Generate Reports</p>
              <p className="text-sm text-gray-600">View quiz, subject, and teacher reports</p>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center py-2 border-b">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <p className="text-sm text-gray-600">New teacher registered</p>
            </div>
            <div className="flex items-center py-2 border-b">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <p className="text-sm text-gray-600">Quiz created by John Teacher</p>
            </div>
            <div className="flex items-center py-2 border-b">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
              <p className="text-sm text-gray-600">50 quiz attempts completed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;