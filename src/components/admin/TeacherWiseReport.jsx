// src/components/admin/TeacherWiseReport.jsx
import { useState, useEffect } from 'react';
import { Download, TrendingUp, TrendingDown } from 'lucide-react';

const TeacherWiseReport = () => {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    fetchTeacherReports();
  }, []);

  const fetchTeacherReports = async () => {
    // Mock data - Replace with actual API call
    const mockData = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        department: 'Mathematics',
        totalQuizzes: 8,
        totalStudents: 45,
        totalAttempts: 120,
        averageScore: 78.5,
        trend: 'up'
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        department: 'Physics',
        totalQuizzes: 6,
        totalStudents: 38,
        totalAttempts: 95,
        averageScore: 72.3,
        trend: 'down'
      },
      {
        id: '3',
        name: 'Mike Johnson',
        email: 'mike@example.com',
        department: 'Chemistry',
        totalQuizzes: 7,
        totalStudents: 42,
        totalAttempts: 110,
        averageScore: 81.7,
        trend: 'up'
      },
      {
        id: '4',
        name: 'Sarah Williams',
        email: 'sarah@example.com',
        department: 'Biology',
        totalQuizzes: 5,
        totalStudents: 35,
        totalAttempts: 87,
        averageScore: 79.2,
        trend: 'up'
      }
    ];
    setTeachers(mockData);
  };

  const downloadReport = () => {
    const csv = convertToCSV(teachers);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'teacher-wise-report.csv';
    a.click();
  };

  const convertToCSV = (data) => {
    const headers = ['Teacher Name', 'Email', 'Department', 'Total Quizzes', 'Total Students', 'Total Attempts', 'Avg Score'];
    const rows = data.map(t => [
      t.name,
      t.email,
      t.department,
      t.totalQuizzes,
      t.totalStudents,
      t.totalAttempts,
      t.averageScore
    ]);
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Teacher Performance Overview</h3>
        <button
          onClick={downloadReport}
          className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          <Download size={18} className="mr-2" />
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Teacher</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Department</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Quizzes</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Students</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Attempts</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Avg Score</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {teachers.map((teacher) => (
              <tr key={teacher.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{teacher.name}</p>
                    <p className="text-xs text-gray-500">{teacher.email}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{teacher.department}</td>
                <td className="px-4 py-3 text-sm text-center text-gray-800">{teacher.totalQuizzes}</td>
                <td className="px-4 py-3 text-sm text-center text-gray-800">{teacher.totalStudents}</td>
                <td className="px-4 py-3 text-sm text-center text-gray-800">{teacher.totalAttempts}</td>
                <td className="px-4 py-3 text-sm text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    teacher.averageScore >= 80 ? 'bg-green-100 text-green-700' :
                    teacher.averageScore >= 60 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {teacher.averageScore.toFixed(1)}%
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  {teacher.trend === 'up' ? (
                    <TrendingUp className="inline text-green-500" size={20} />
                  ) : (
                    <TrendingDown className="inline text-red-500" size={20} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {teachers.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No teacher data available.
        </div>
      )}
    </div>
  );
};

export default TeacherWiseReport;