// src/components/student/StudentDashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, CheckCircle, Trophy, Play } from 'lucide-react';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    assignedQuizzes: 0,
    completedQuizzes: 0,
    averageScore: 0,
    totalTime: 0
  });
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [upcomingQuizzes, setUpcomingQuizzes] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    
    // Listen for quiz assignment events
    const handleQuizAssigned = () => {
      fetchDashboardData();
    };
    
    window.addEventListener('quizAssigned', handleQuizAssigned);
    
    return () => {
      window.removeEventListener('quizAssigned', handleQuizAssigned);
    };
  }, []);

  const fetchDashboardData = async () => {
    // Get current logged-in student ID from localStorage
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const studentId = currentUser.id;
    
    // Get all quizzes from localStorage
    const allQuizzes = JSON.parse(localStorage.getItem('teacherQuizzes') || '[]');
    
    // Filter quizzes assigned to this student
    const assignedQuizzes = allQuizzes.filter(quiz => 
      Array.isArray(quiz.assignedStudents) && quiz.assignedStudents.includes(studentId)
    );
    
    // Get completed quiz IDs from student's attempts
    const studentAttempts = JSON.parse(localStorage.getItem(`attempts_${studentId}`) || '[]');
    const completedQuizIds = studentAttempts.map(attempt => attempt.quizId);
    
    // Separate pending and completed quizzes
    const pending = assignedQuizzes.filter(quiz => !completedQuizIds.includes(quiz.id));
    const completed = assignedQuizzes.filter(quiz => completedQuizIds.includes(quiz.id));
    
    // Calculate average score
    const totalScore = studentAttempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0);
    const avgScore = studentAttempts.length > 0 ? totalScore / studentAttempts.length : 0;
    
    setStats({
      assignedQuizzes: assignedQuizzes.length,
      completedQuizzes: completed.length,
      averageScore: avgScore.toFixed(1),
      totalTime: studentAttempts.reduce((sum, attempt) => sum + (attempt.timeTaken || 0), 0)
    });

    // Set upcoming quizzes (pending)
    setUpcomingQuizzes(pending.map(quiz => ({
      id: quiz.id,
      title: quiz.title,
      subject: quiz.subject,
      deadline: quiz.deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      duration: quiz.duration,
      questions: quiz.questions.length
    })));

    // Set recent completed quizzes
    const recentCompleted = completed.slice(0, 3).map(quiz => {
      const attempt = studentAttempts.find(a => a.quizId === quiz.id);
      return {
        id: quiz.id,
        title: quiz.title,
        subject: quiz.subject,
        score: attempt ? attempt.score : 0,
        completedAt: attempt ? attempt.completedAt : new Date().toISOString().split('T')[0],
        status: attempt && attempt.score >= (quiz.passingScore || 60) ? 'passed' : 'failed'
      };
    });
    
    setRecentQuizzes(recentCompleted);
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
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Student Dashboard</h1>
        <p className="text-gray-600">Track your quiz performance and upcoming assignments</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={BookOpen}
          title="Assigned Quizzes"
          value={stats.assignedQuizzes}
          color="bg-blue-500"
        />
        <StatCard
          icon={CheckCircle}
          title="Completed"
          value={stats.completedQuizzes}
          color="bg-green-500"
        />
        <StatCard
          icon={Trophy}
          title="Average Score"
          value={`${stats.averageScore}%`}
          color="bg-purple-500"
        />
        <StatCard
          icon={Clock}
          title="Total Time"
          value={`${stats.totalTime}m`}
          color="bg-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Quizzes */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Upcoming Quizzes</h2>
            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
              {upcomingQuizzes.length} Pending
            </span>
          </div>
          <div className="space-y-3">
            {upcomingQuizzes.map((quiz) => (
              <div 
                key={quiz.id}
                className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 hover:shadow-md transition cursor-pointer"
                onClick={() => navigate(`/student/quiz/${quiz.id}`)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{quiz.title}</h3>
                    <p className="text-sm text-gray-600">{quiz.subject}</p>
                  </div>
                  <button className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition">
                    <Play size={16} />
                  </button>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    {quiz.duration} mins
                  </span>
                  <span>{quiz.questions} questions</span>
                  <span className="text-orange-600 font-medium">Due: {quiz.deadline}</span>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate('/student/quizzes')}
            className="w-full mt-4 py-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"
          >
            View All Quizzes
          </button>
        </div>

        {/* Recent Results */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Results</h2>
          <div className="space-y-3">
            {recentQuizzes.map((quiz) => (
              <div 
                key={quiz.id}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                onClick={() => navigate(`/student/quiz/${quiz.id}/result`)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{quiz.title}</h3>
                    <p className="text-sm text-gray-500">{quiz.subject} • {quiz.completedAt}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${
                      quiz.score >= 80 ? 'text-green-600' :
                      quiz.score >= 60 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {quiz.score}%
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      quiz.status === 'passed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {quiz.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate('/student/history')}
            className="w-full mt-4 py-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"
          >
            View All Results
          </button>
        </div>
      </div>

      {/* Performance Chart Placeholder */}
      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Performance Overview</h2>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-center text-gray-500">
            <Trophy size={48} className="mx-auto mb-2 text-gray-300" />
            <p>Performance chart will be displayed here</p>
            <p className="text-sm">Install recharts library to view charts</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;