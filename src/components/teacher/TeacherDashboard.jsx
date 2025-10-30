// src/components/teacher/TeacherDashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, ClipboardCheck, TrendingUp, PlusCircle } from 'lucide-react';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    activeQuizzes: 0,
    totalStudents: 0,
    totalAttempts: 0
  });
  const [recentQuizzes, setRecentQuizzes] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    
    // Listen for quiz creation events
    const handleQuizCreated = () => {
      fetchDashboardData();
    };
    
    window.addEventListener('quizCreated', handleQuizCreated);
    
    return () => {
      window.removeEventListener('quizCreated', handleQuizCreated);
    };
  }, []);

  const fetchDashboardData = async () => {
    // Get quizzes from localStorage
    const teacherQuizzes = JSON.parse(localStorage.getItem('teacherQuizzes') || '[]');
    
    // Calculate stats
    const activeQuizzes = teacherQuizzes.filter(q => q.status === 'active').length;
    const totalAttempts = teacherQuizzes.reduce((sum, quiz) => sum + (quiz.attempts || 0), 0);
    
    // Calculate total unique assigned students
    const allAssignedStudents = new Set();
    teacherQuizzes.forEach(quiz => {
      if (Array.isArray(quiz.assignedStudents)) {
        quiz.assignedStudents.forEach(studentId => allAssignedStudents.add(studentId));
      }
    });
    
    setStats({
      totalQuizzes: teacherQuizzes.length,
      activeQuizzes: activeQuizzes,
      totalStudents: allAssignedStudents.size,
      totalAttempts: totalAttempts
    });

    // Get recent quizzes (last 3)
    const recentQuizzes = teacherQuizzes
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3)
      .map(quiz => ({
        id: quiz.id,
        title: quiz.title,
        subject: quiz.subject,
        attempts: quiz.attempts || 0,
        averageScore: 78.5, // Mock average - calculate from actual attempts in production
        createdAt: quiz.createdAt,
        assignedCount: Array.isArray(quiz.assignedStudents) ? quiz.assignedStudents.length : 0
      }));
    
    setRecentQuizzes(recentQuizzes);
  };

  const StatCard = ({ icon: Icon, title, value, color, subtext }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
          {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="text-white" size={24} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Teacher Dashboard</h1>
        <button
          onClick={() => navigate('/teacher/create-quiz')}
          className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          <PlusCircle size={20} className="mr-2" />
          Create New Quiz
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={BookOpen}
          title="Total Quizzes"
          value={stats.totalQuizzes}
          color="bg-blue-500"
          subtext={`${stats.activeQuizzes} active`}
        />
        <StatCard
          icon={Users}
          title="Total Students"
          value={stats.totalStudents}
          color="bg-green-500"
        />
        <StatCard
          icon={ClipboardCheck}
          title="Total Attempts"
          value={stats.totalAttempts}
          color="bg-purple-500"
        />
        <StatCard
          icon={TrendingUp}
          title="Avg Performance"
          value="77.5%"
          color="bg-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Quizzes */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Quizzes</h2>
          <div className="space-y-3">
            {recentQuizzes.map((quiz) => (
              <div 
                key={quiz.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition"
                onClick={() => navigate('/teacher/results')}
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">{quiz.title}</h3>
                  <p className="text-sm text-gray-500">{quiz.subject} • {quiz.createdAt}</p>
                  {quiz.assignedCount > 0 && (
                    <p className="text-xs text-blue-600 mt-1">
                      Assigned to {quiz.assignedCount} student{quiz.assignedCount !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{quiz.attempts} attempts</p>
                  <p className={`text-sm font-semibold ${
                    quiz.averageScore >= 80 ? 'text-green-600' :
                    quiz.averageScore >= 60 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    Avg: {quiz.averageScore}%
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate('/teacher/quizzes')}
            className="w-full mt-4 py-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"
          >
            View All Quizzes
          </button>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/teacher/create-quiz')}
              className="w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition flex items-center"
            >
              <PlusCircle size={20} className="mr-3 text-blue-500" />
              <div>
                <p className="font-medium text-gray-800">Create New Quiz</p>
                <p className="text-sm text-gray-500">Build a new quiz for your students</p>
              </div>
            </button>
            <button
              onClick={() => navigate('/teacher/quizzes')}
              className="w-full text-left px-4 py-3 bg-green-50 hover:bg-green-100 rounded-lg transition flex items-center"
            >
              <BookOpen size={20} className="mr-3 text-green-500" />
              <div>
                <p className="font-medium text-gray-800">Manage Quizzes</p>
                <p className="text-sm text-gray-500">Edit or delete existing quizzes</p>
              </div>
            </button>
            <button
              onClick={() => navigate('/teacher/results')}
              className="w-full text-left px-4 py-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition flex items-center"
            >
              <ClipboardCheck size={20} className="mr-3 text-purple-500" />
              <div>
                <p className="font-medium text-gray-800">View Results</p>
                <p className="text-sm text-gray-500">Check student performance</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;