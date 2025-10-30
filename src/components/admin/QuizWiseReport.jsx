// src/components/admin/QuizWiseReport.jsx
import { useState, useEffect } from 'react';
import { Search, Download } from 'lucide-react';

const QuizWiseReport = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);

  useEffect(() => {
    fetchQuizReports();
  }, []);

  useEffect(() => {
    const filtered = quizzes.filter(quiz =>
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredQuizzes(filtered);
  }, [searchTerm, quizzes]);

  const fetchQuizReports = async () => {
    // Mock data - Replace with actual API call
    const mockData = [
      {
        id: '1',
        title: 'Mathematics Final Quiz',
        subject: 'Mathematics',
        teacher: 'John Doe',
        totalAttempts: 45,
        averageScore: 78.5,
        highestScore: 95,
        lowestScore: 45,
        passRate: 82.2
      },
      {
        id: '2',
        title: 'Physics Chapter 1',
        subject: 'Physics',
        teacher: 'Jane Smith',
        totalAttempts: 38,
        averageScore: 72.3,
        highestScore: 98,
        lowestScore: 38,
        passRate: 76.3
      },
      {
        id: '3',
        title: 'Chemistry Basics',
        subject: 'Chemistry',
        teacher: 'Mike Johnson',
        totalAttempts: 52,
        averageScore: 81.7,
        highestScore: 100,
        lowestScore: 52,
        passRate: 88.5
      }
    ];
    setQuizzes(mockData);
    setFilteredQuizzes(mockData);
  };

  const downloadReport = () => {
    // Generate CSV and download
    const csv = convertToCSV(filteredQuizzes);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quiz-wise-report.csv';
    a.click();
  };

  const convertToCSV = (data) => {
    const headers = ['Quiz Title', 'Subject', 'Teacher', 'Attempts', 'Avg Score', 'Highest', 'Lowest', 'Pass Rate'];
    const rows = data.map(q => [
      q.title,
      q.subject,
      q.teacher,
      q.totalAttempts,
      q.averageScore,
      q.highestScore,
      q.lowestScore,
      q.passRate + '%'
    ]);
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search quizzes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={downloadReport}
          className="ml-4 flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          <Download size={18} className="mr-2" />
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Quiz Title</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Subject</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Teacher</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Attempts</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Avg Score</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Highest</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Lowest</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Pass Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredQuizzes.map((quiz) => (
              <tr key={quiz.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-800">{quiz.title}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{quiz.subject}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{quiz.teacher}</td>
                <td className="px-4 py-3 text-sm text-center text-gray-800">{quiz.totalAttempts}</td>
                <td className="px-4 py-3 text-sm text-center font-medium text-blue-600">
                  {quiz.averageScore.toFixed(1)}%
                </td>
                <td className="px-4 py-3 text-sm text-center text-green-600">{quiz.highestScore}%</td>
                <td className="px-4 py-3 text-sm text-center text-red-600">{quiz.lowestScore}%</td>
                <td className="px-4 py-3 text-sm text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    quiz.passRate >= 80 ? 'bg-green-100 text-green-700' : 
                    quiz.passRate >= 60 ? 'bg-yellow-100 text-yellow-700' : 
                    'bg-red-100 text-red-700'
                  }`}>
                    {quiz.passRate}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredQuizzes.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No quizzes found matching your search.
        </div>
      )}
    </div>
  );
};

export default QuizWiseReport;