// src/components/student/StudentQuizList.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, FileText, Play, CheckCircle, AlertCircle } from 'lucide-react';

const StudentQuizList = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [filter, setFilter] = useState('all'); // all, pending, completed

  useEffect(() => {
    fetchQuizzes();
    
    // Listen for quiz assignment events
    const handleQuizAssigned = () => {
      fetchQuizzes();
    };
    
    window.addEventListener('quizAssigned', handleQuizAssigned);
    
    return () => {
      window.removeEventListener('quizAssigned', handleQuizAssigned);
    };
  }, []);

  const fetchQuizzes = async () => {
    // Get current logged-in student ID from localStorage
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const studentId = currentUser.id;
    
    // Get all quizzes from localStorage
    const allQuizzes = JSON.parse(localStorage.getItem('teacherQuizzes') || '[]');
    
    // Filter quizzes assigned to this student
    const assignedQuizzes = allQuizzes.filter(quiz => 
      Array.isArray(quiz.assignedStudents) && quiz.assignedStudents.includes(studentId)
    );
    
    // Get student's attempts to determine completed quizzes
    const studentAttempts = JSON.parse(localStorage.getItem(`attempts_${studentId}`) || '[]');
    const completedQuizIds = studentAttempts.map(attempt => attempt.quizId);
    
    // Get teacher names (mock for now)
    const getTeacherName = (quiz) => {
      return quiz.teacherName || 'Teacher';
    };
    
    // Map quizzes with status
    const quizzesWithStatus = assignedQuizzes.map(quiz => {
      const isCompleted = completedQuizIds.includes(quiz.id);
      const attempt = studentAttempts.find(a => a.quizId === quiz.id);
      
      return {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        subject: quiz.subject,
        duration: quiz.duration,
        questions: quiz.questions.length,
        deadline: quiz.deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: isCompleted ? 'completed' : 'pending',
        score: attempt ? attempt.score : null,
        teacher: getTeacherName(quiz)
      };
    });
    
    setQuizzes(quizzesWithStatus);
  };

  const filteredQuizzes = quizzes.filter(quiz => {
    if (filter === 'all') return true;
    return quiz.status === filter;
  });

  const getDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDeadlineColor = (deadline) => {
    const days = getDaysRemaining(deadline);
    if (days < 0) return 'text-red-600';
    if (days <= 2) return 'text-orange-600';
    return 'text-green-600';
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <BookOpen className="mr-3 text-blue-500" size={32} />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Available Quizzes</h1>
            <p className="text-gray-600">View and take your assigned quizzes</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="flex border-b">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 px-6 py-3 text-center font-medium transition ${
              filter === 'all'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            All Quizzes ({quizzes.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`flex-1 px-6 py-3 text-center font-medium transition ${
              filter === 'pending'
                ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Pending ({quizzes.filter(q => q.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`flex-1 px-6 py-3 text-center font-medium transition ${
              filter === 'completed'
                ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Completed ({quizzes.filter(q => q.status === 'completed').length})
          </button>
        </div>
      </div>

      {/* Quiz Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
          >
            <div className={`h-2 ${
              quiz.status === 'completed' ? 'bg-green-500' : 'bg-orange-500'
            }`}></div>
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {quiz.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {quiz.description}
                  </p>
                </div>
                {quiz.status === 'completed' ? (
                  <CheckCircle className="text-green-500 flex-shrink-0 ml-2" size={24} />
                ) : (
                  <AlertCircle className="text-orange-500 flex-shrink-0 ml-2" size={24} />
                )}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm">
                  <span className="font-medium w-20 text-gray-600">Subject:</span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                    {quiz.subject}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium w-20">Teacher:</span>
                  <span>{quiz.teacher}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock size={14} className="mr-1" />
                  <span className="font-medium w-20">Duration:</span>
                  <span>{quiz.duration} minutes</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FileText size={14} className="mr-1" />
                  <span className="font-medium w-20">Questions:</span>
                  <span>{quiz.questions}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="font-medium w-20 text-gray-600">Deadline:</span>
                  <span className={`font-semibold ${getDeadlineColor(quiz.deadline)}`}>
                    {quiz.deadline} ({getDaysRemaining(quiz.deadline)} days)
                  </span>
                </div>
              </div>

              {quiz.status === 'completed' ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Your Score:</span>
                    <span className={`text-lg font-bold ${
                      quiz.score >= 80 ? 'text-green-600' :
                      quiz.score >= 60 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {quiz.score}%
                    </span>
                  </div>
                  <button
                    onClick={() => navigate(`/student/quiz/${quiz.id}/result`)}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    View Results
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigate(`/student/quiz/${quiz.id}`)}
                  className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center justify-center font-semibold"
                >
                  <Play size={20} className="mr-2" />
                  Start Quiz
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredQuizzes.length === 0 && (
        <div className="text-center py-12">
          <BookOpen size={64} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No quizzes found</h3>
          <p className="text-gray-500">
            {filter === 'all' 
              ? 'You have no assigned quizzes at the moment.'
              : filter === 'pending'
              ? 'You have no pending quizzes.'
              : 'You have not completed any quizzes yet.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentQuizList;