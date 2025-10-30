// src/components/teacher/QuizResults.jsx
import { useState, useEffect } from 'react';
import { Search, Download, Eye, ClipboardList } from 'lucide-react';

const QuizResults = () => {
  const [selectedQuiz, setSelectedQuiz] = useState('');
  const [quizzes, setQuizzes] = useState([]);
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchQuizzes();
  }, []);

  useEffect(() => {
    if (selectedQuiz) {
      fetchResults(selectedQuiz);
    }
  }, [selectedQuiz]);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, results]);

  const fetchQuizzes = async () => {
    // Mock data - Replace with actual API call
    const mockQuizzes = [
      { id: '1', title: 'Mathematics Final Quiz' },
      { id: '2', title: 'Physics Chapter 1' },
      { id: '3', title: 'Chemistry Basics' }
    ];
    setQuizzes(mockQuizzes);
    if (mockQuizzes.length > 0) {
      setSelectedQuiz(mockQuizzes[0].id);
    }
  };

  const fetchResults = async (quizId) => {
    // Mock data - Replace with actual API call
    const mockResults = [
      {
        id: '1',
        studentName: 'Alice Johnson',
        studentEmail: 'alice@example.com',
        score: 85,
        totalQuestions: 20,
        correctAnswers: 17,
        timeTaken: '25:30',
        submittedAt: '2024-10-22 10:30 AM',
        status: 'passed'
      },
      {
        id: '2',
        studentName: 'Bob Wilson',
        studentEmail: 'bob@example.com',
        score: 72,
        totalQuestions: 20,
        correctAnswers: 14,
        timeTaken: '28:45',
        submittedAt: '2024-10-22 11:15 AM',
        status: 'passed'
      },
      {
        id: '3',
        studentName: 'Charlie Brown',
        studentEmail: 'charlie@example.com',
        score: 55,
        totalQuestions: 20,
        correctAnswers: 11,
        timeTaken: '30:00',
        submittedAt: '2024-10-22 02:20 PM',
        status: 'failed'
      },
      {
        id: '4',
        studentName: 'Diana Prince',
        studentEmail: 'diana@example.com',
        score: 92,
        totalQuestions: 20,
        correctAnswers: 18,
        timeTaken: '22:15',
        submittedAt: '2024-10-22 03:45 PM',
        status: 'passed'
      },
      {
        id: '5',
        studentName: 'Ethan Hunt',
        studentEmail: 'ethan@example.com',
        score: 48,
        totalQuestions: 20,
        correctAnswers: 9,
        timeTaken: '29:30',
        submittedAt: '2024-10-22 04:10 PM',
        status: 'failed'
      }
    ];
    setResults(mockResults);
    setFilteredResults(mockResults);
  };

  const applyFilters = () => {
    let filtered = [...results];

    if (searchTerm) {
      filtered = filtered.filter(result =>
        result.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.studentEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredResults(filtered);
  };

  const downloadResults = () => {
    const csv = convertToCSV(filteredResults);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quiz-results.csv';
    a.click();
  };

  const convertToCSV = (data) => {
    const headers = ['Student Name', 'Email', 'Score (%)', 'Correct Answers', 'Total Questions', 'Time Taken', 'Submitted At', 'Status'];
    const rows = data.map(r => [
      r.studentName,
      r.studentEmail,
      r.score,
      r.correctAnswers,
      r.totalQuestions,
      r.timeTaken,
      r.submittedAt,
      r.status
    ]);
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const calculateStats = () => {
    if (results.length === 0) return { average: 0, highest: 0, lowest: 0, passRate: 0 };

    const scores = results.map(r => r.score);
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;
    const highest = Math.max(...scores);
    const lowest = Math.min(...scores);
    const passed = results.filter(r => r.status === 'passed').length;
    const passRate = (passed / results.length) * 100;

    return { average, highest, lowest, passRate };
  };

  const stats = calculateStats();

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <ClipboardList className="mr-3 text-purple-500" size={32} />
        <h1 className="text-3xl font-bold text-gray-800">Quiz Results</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        {/* Quiz Selection and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="md:w-64">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Quiz
            </label>
            <select
              value={selectedQuiz}
              onChange={(e) => setSelectedQuiz(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {quizzes.map((quiz) => (
                <option key={quiz.id} value={quiz.id}>
                  {quiz.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Students
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="md:w-auto flex items-end">
            <button
              onClick={downloadResults}
              className="flex items-center px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              <Download size={18} className="mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Statistics */}
        {results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Average Score</p>
              <p className="text-2xl font-bold text-blue-600">{stats.average.toFixed(1)}%</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Highest Score</p>
              <p className="text-2xl font-bold text-green-600">{stats.highest}%</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Lowest Score</p>
              <p className="text-2xl font-bold text-red-600">{stats.lowest}%</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Pass Rate</p>
              <p className="text-2xl font-bold text-purple-600">{stats.passRate.toFixed(1)}%</p>
            </div>
          </div>
        )}

        {/* Results Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Student</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Score</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Correct</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Time Taken</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Submitted</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredResults.map((result) => (
                <tr key={result.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{result.studentName}</p>
                      <p className="text-xs text-gray-500">{result.studentEmail}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-lg font-bold ${
                      result.score >= 80 ? 'text-green-600' :
                      result.score >= 60 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {result.score}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-800">
                    {result.correctAnswers}/{result.totalQuestions}
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600">
                    {result.timeTaken}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {result.submittedAt}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      result.status === 'passed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {result.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredResults.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No results found for this quiz.
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizResults;