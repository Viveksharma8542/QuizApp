// src/components/teacher/QuizList.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Edit, Trash2, Users, Eye, BookOpen } from 'lucide-react';
import AssignQuiz from './AssignQuiz';

const QuizList = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  useEffect(() => {
    fetchQuizzes();
    
    // Listen for quiz creation events
    const handleQuizCreated = () => {
      fetchQuizzes();
    };
    
    window.addEventListener('quizCreated', handleQuizCreated);
    
    return () => {
      window.removeEventListener('quizCreated', handleQuizCreated);
    };
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filterSubject, quizzes]);

  const fetchQuizzes = async () => {
    // Get quizzes from localStorage
    const teacherQuizzes = JSON.parse(localStorage.getItem('teacherQuizzes') || '[]');
    setQuizzes(teacherQuizzes);
    setFilteredQuizzes(teacherQuizzes);
  };

  const applyFilters = () => {
    let filtered = [...quizzes];

    if (searchTerm) {
      filtered = filtered.filter(quiz =>
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterSubject) {
      filtered = filtered.filter(quiz => quiz.subject === filterSubject);
    }

    setFilteredQuizzes(filtered);
  };

  const handleDelete = async (quizId) => {
    if (window.confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
      // Remove from state
      const updatedQuizzes = quizzes.filter(quiz => quiz.id !== quizId);
      setQuizzes(updatedQuizzes);
      
      // Update localStorage
      localStorage.setItem('teacherQuizzes', JSON.stringify(updatedQuizzes));
      
      // Dispatch event
      window.dispatchEvent(new Event('quizCreated'));
    }
  };

  const handleAssignStudents = (quiz) => {
    setSelectedQuiz(quiz);
    setShowAssignModal(true);
  };

  const handleAssignComplete = (studentIds) => {
    // Update quiz with assigned students
    const updatedQuizzes = quizzes.map(quiz => {
      if (quiz.id === selectedQuiz.id) {
        return {
          ...quiz,
          assignedStudents: studentIds
        };
      }
      return quiz;
    });
    
    // Save to localStorage
    localStorage.setItem('teacherQuizzes', JSON.stringify(updatedQuizzes));
    setQuizzes(updatedQuizzes);
    
    // Dispatch events to update dashboard and student panel
    window.dispatchEvent(new Event('quizCreated'));
    window.dispatchEvent(new Event('quizAssigned'));
    
    // Show success message
    alert(`Quiz "${selectedQuiz.title}" assigned to ${studentIds.length} student(s) successfully!`);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <BookOpen className="mr-3 text-blue-500" size={32} />
          <h1 className="text-3xl font-bold text-gray-800">My Quizzes</h1>
        </div>
        <button
          onClick={() => navigate('/teacher/create-quiz')}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Create New Quiz
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search quizzes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="md:w-48">
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Subjects</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
            </select>
          </div>
        </div>

        {/* Quizzes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => (
            <div key={quiz.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{quiz.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{quiz.description}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  quiz.status === 'active' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {quiz.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium w-24">Subject:</span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                    {quiz.subject}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium w-24">Duration:</span>
                  <span>{quiz.duration} minutes</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium w-24">Questions:</span>
                  <span>{quiz.questions.length}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium w-24">Assigned:</span>
                  <span>{Array.isArray(quiz.assignedStudents) ? quiz.assignedStudents.length : 0} students</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium w-24">Attempts:</span>
                  <span className="font-semibold text-blue-600">{quiz.attempts}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleAssignStudents(quiz)}
                  className="flex-1 px-3 py-2 bg-green-50 text-green-700 rounded hover:bg-green-100 transition flex items-center justify-center text-sm"
                  title="Assign Students"
                >
                  <Users size={16} className="mr-1" />
                  Assign
                </button>
                <button
                  onClick={() => navigate('/teacher/results')}
                  className="flex-1 px-3 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition flex items-center justify-center text-sm"
                  title="View Results"
                >
                  <Eye size={16} className="mr-1" />
                  Results
                </button>
                <button
                  className="px-3 py-2 bg-yellow-50 text-yellow-700 rounded hover:bg-yellow-100 transition"
                  title="Edit Quiz"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(quiz.id)}
                  className="px-3 py-2 bg-red-50 text-red-700 rounded hover:bg-red-100 transition"
                  title="Delete Quiz"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredQuizzes.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <BookOpen size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-lg">No quizzes found</p>
            <p className="text-sm">Create your first quiz to get started</p>
          </div>
        )}
      </div>

      {/* Assignment Modal */}
      {showAssignModal && (
        <AssignQuiz
          quiz={selectedQuiz}
          onClose={() => setShowAssignModal(false)}
          onAssign={handleAssignComplete}
        />
      )}
    </div>
  );
};

export default QuizList;