// src/components/teacher/CreateQuiz.jsx
import { useState } from 'react';
import { Plus, BookOpen, Upload, Database, Sparkles } from 'lucide-react';
import QuestionBank from './QuestionBank';
import UploadQuestion from './UploadQuestion';
import UploadQuestionsFile from './UploadQuestionsFile';
import AIQuestionGenerator from './AIQuestionGenerator';

const CreateQuiz = () => {
  const [quizDetails, setQuizDetails] = useState({
    title: '',
    description: '',
    subject: '',
    duration: 30,
    passingScore: 60
  });
  const [questions, setQuestions] = useState([]);
  const [activeSource, setActiveSource] = useState('bank');
  const [message, setMessage] = useState({ type: '', text: '' });

  const sources = [
    { id: 'bank', label: 'Question Bank', icon: Database },
    { id: 'upload', label: 'Upload Question', icon: Plus },
    { id: 'file', label: 'Upload File', icon: Upload },
    { id: 'ai', label: 'AI Generate', icon: Sparkles }
  ];

  const handleQuizChange = (e) => {
    setQuizDetails({
      ...quizDetails,
      [e.target.name]: e.target.value
    });
  };

  const handleAddQuestions = (newQuestions) => {
    setQuestions([...questions, ...newQuestions]);
    setMessage({ type: 'success', text: `${newQuestions.length} question(s) added successfully!` });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleRemoveQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSaveQuiz = async () => {
    if (!quizDetails.title || !quizDetails.subject) {
      setMessage({ type: 'error', text: 'Please fill in quiz title and subject' });
      return;
    }
    if (questions.length === 0) {
      setMessage({ type: 'error', text: 'Please add at least one question' });
      return;
    }

    try {
      // Get existing quizzes from localStorage
      const existingQuizzes = JSON.parse(localStorage.getItem('teacherQuizzes') || '[]');
      
      // Create new quiz object
      const newQuiz = {
        id: Date.now().toString(),
        ...quizDetails,
        questions: questions,
        createdAt: new Date().toISOString().split('T')[0],
        assignedStudents: [],
        attempts: 0,
        status: 'active'
      };
      
      // Add to existing quizzes
      existingQuizzes.push(newQuiz);
      
      // Save to localStorage
      localStorage.setItem('teacherQuizzes', JSON.stringify(existingQuizzes));
      
      setMessage({ type: 'success', text: 'Quiz created successfully!' });
      
      // Dispatch event to notify other components
      window.dispatchEvent(new Event('quizCreated'));
      
      // Reset form
      setTimeout(() => {
        setQuizDetails({
          title: '',
          description: '',
          subject: '',
          duration: 30,
          passingScore: 60
        });
        setQuestions([]);
        setMessage({ type: '', text: '' });
      }, 2000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to create quiz' });
    }
  };

  const mockSaveQuiz = (data) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 1000);
    });
  };

  // Remove mockSaveQuiz as we're using localStorage now

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <BookOpen className="mr-3 text-blue-500" size={32} />
        <h1 className="text-3xl font-bold text-gray-800">Create New Quiz</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quiz Details Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Quiz Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quiz Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={quizDetails.title}
                  onChange={handleQuizChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter quiz title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={quizDetails.description}
                  onChange={handleQuizChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="Enter description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <select
                  name="subject"
                  value={quizDetails.subject}
                  onChange={handleQuizChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Subject</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="English">English</option>
                  <option value="History">History</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  name="duration"
                  value={quizDetails.duration}
                  onChange={handleQuizChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Passing Score (%)
                </label>
                <input
                  type="number"
                  name="passingScore"
                  value={quizDetails.passingScore}
                  onChange={handleQuizChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  max="100"
                />
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600 mb-2">Questions Added: <span className="font-semibold">{questions.length}</span></p>
                <button
                  onClick={handleSaveQuiz}
                  className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
                >
                  Create Quiz
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Question Sources Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Questions</h2>
            
            <div className="flex space-x-2 mb-6 overflow-x-auto">
              {sources.map((source) => {
                const Icon = source.icon;
                return (
                  <button
                    key={source.id}
                    onClick={() => setActiveSource(source.id)}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                      activeSource === source.id
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <Icon size={18} className="mr-2" />
                    {source.label}
                  </button>
                );
              })}
            </div>

            {message.text && (
              <div className={`mb-4 p-4 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-700' 
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                {message.text}
              </div>
            )}

            <div>
              {activeSource === 'bank' && <QuestionBank onAddQuestions={handleAddQuestions} />}
              {activeSource === 'upload' && <UploadQuestion onAddQuestions={handleAddQuestions} />}
              {activeSource === 'file' && <UploadQuestionsFile onAddQuestions={handleAddQuestions} />}
              {activeSource === 'ai' && <AIQuestionGenerator onAddQuestions={handleAddQuestions} />}
            </div>
          </div>

          {/* Questions Preview */}
          {questions.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Selected Questions ({questions.length})</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {questions.map((question, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-gray-800">Q{index + 1}. {question.question}</p>
                      <button
                        onClick={() => handleRemoveQuestion(index)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="space-y-1 ml-4">
                      {question.options.map((option, optIndex) => (
                        <p key={optIndex} className={`text-sm ${
                          optIndex === question.correctAnswer 
                            ? 'text-green-600 font-medium' 
                            : 'text-gray-600'
                        }`}>
                          {String.fromCharCode(65 + optIndex)}. {option}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz;