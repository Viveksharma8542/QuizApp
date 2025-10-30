// src/components/admin/SubjectWiseReport.jsx
import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

const SubjectWiseReport = () => {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetchSubjectReports();
  }, []);

  const fetchSubjectReports = async () => {
    // Mock data - Replace with actual API call
    const mockData = [
      {
        subject: 'Mathematics',
        totalQuizzes: 15,
        totalAttempts: 180,
        averageScore: 76.5,
        totalStudents: 45
      },
      {
        subject: 'Physics',
        totalQuizzes: 12,
        totalAttempts: 144,
        averageScore: 71.2,
        totalStudents: 38
      },
      {
        subject: 'Chemistry',
        totalQuizzes: 10,
        totalAttempts: 150,
        averageScore: 79.8,
        totalStudents: 42
      },
      {
        subject: 'Biology',
        totalQuizzes: 8,
        totalAttempts: 96,
        averageScore: 82.3,
        totalStudents: 35
      },
      {
        subject: 'English',
        totalQuizzes: 6,
        totalAttempts: 72,
        averageScore: 74.5,
        totalStudents: 40
      }
    ];
    setSubjects(mockData);
  };

  const downloadReport = () => {
    const csv = convertToCSV(subjects);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'subject-wise-report.csv';
    a.click();
  };

  const convertToCSV = (data) => {
    const headers = ['Subject', 'Total Quizzes', 'Total Attempts', 'Avg Score', 'Total Students'];
    const rows = data.map(s => [
      s.subject,
      s.totalQuizzes,
      s.totalAttempts,
      s.averageScore,
      s.totalStudents
    ]);
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Subject Performance Overview</h3>
        <button
          onClick={downloadReport}
          className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          <Download size={18} className="mr-2" />
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {subjects.map((subject) => (
          <div key={subject.subject} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
            <h4 className="text-lg font-bold text-gray-800 mb-3">{subject.subject}</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Quizzes:</span>
                <span className="font-semibold text-gray-800">{subject.totalQuizzes}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Attempts:</span>
                <span className="font-semibold text-gray-800">{subject.totalAttempts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Students:</span>
                <span className="font-semibold text-gray-800">{subject.totalStudents}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-sm text-gray-600">Avg Score:</span>
                <span className={`text-lg font-bold ${
                  subject.averageScore >= 80 ? 'text-green-600' :
                  subject.averageScore >= 60 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {subject.averageScore.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Subject</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Total Quizzes</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Total Attempts</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Total Students</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Average Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {subjects.map((subject) => (
              <tr key={subject.subject} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-800">{subject.subject}</td>
                <td className="px-4 py-3 text-sm text-center text-gray-800">{subject.totalQuizzes}</td>
                <td className="px-4 py-3 text-sm text-center text-gray-800">{subject.totalAttempts}</td>
                <td className="px-4 py-3 text-sm text-center text-gray-800">{subject.totalStudents}</td>
                <td className="px-4 py-3 text-sm text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    subject.averageScore >= 80 ? 'bg-green-100 text-green-700' :
                    subject.averageScore >= 60 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {subject.averageScore.toFixed(1)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubjectWiseReport;