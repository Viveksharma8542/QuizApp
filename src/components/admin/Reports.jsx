// src/components/admin/Reports.jsx
import { useState } from 'react';
import { BarChart3, BookOpen, GraduationCap, FileText } from 'lucide-react';
import QuizWiseReport from './QuizWiseReport';
import SubjectWiseReport from './SubjectWiseReport';
import TeacherWiseReport from './TeacherWiseReport';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('quiz');

  const tabs = [
    { id: 'quiz', label: 'Quiz-wise Report', icon: FileText },
    { id: 'subject', label: 'Subject-wise Report', icon: BookOpen },
    { id: 'teacher', label: 'Teacher-wise Report', icon: GraduationCap }
  ];

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <BarChart3 className="mr-3 text-purple-500" size={32} />
        <h1 className="text-3xl font-bold text-gray-800">Reports & Analytics</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <div className="flex space-x-2 p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition ${
                    activeTab === tab.id
                      ? 'bg-purple-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={18} className="mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'quiz' && <QuizWiseReport />}
          {activeTab === 'subject' && <SubjectWiseReport />}
          {activeTab === 'teacher' && <TeacherWiseReport />}
        </div>
      </div>
    </div>
  );
};

export default Reports;