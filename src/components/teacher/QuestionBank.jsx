// src/components/teacher/QuestionBank.jsx
import { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';

const QuestionBank = ({ onAddQuestions }) => {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [filters, setFilters] = useState({
    subject: '',
    difficulty: '',
    search: ''
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, questions]);

  const fetchQuestions = async () => {
    // Mock data - Replace with actual API call
    const mockQuestions = [
      {
        id: '1',
        question: 'What is the derivative of x²?',
        options: ['x', '2x', 'x²', '2'],
        correctAnswer: 1,
        subject: 'Mathematics',
        difficulty: 'easy'
      },
      {
        id: '2',
        question: 'What is Newton\'s second law of motion?',
        options: ['F = ma', 'E = mc²', 'V = IR', 'P = W/t'],
        correctAnswer: 0,
        subject: 'Physics',
        difficulty: 'medium'
      },
      {
        id: '3',
        question: 'What is the chemical formula for water?',
        options: ['CO2', 'H2O', 'O2', 'N2'],
        correctAnswer: 1,
        subject: 'Chemistry',
        difficulty: 'easy'
      },
      {
        id: '4',
        question: 'What is the integral of 2x?',
        options: ['2', 'x²', 'x² + C', '2x + C'],
        correctAnswer: 2,
        subject: 'Mathematics',
        difficulty: 'medium'
      },
      {
        id: '5',
        question: 'What is the speed of light in vacuum?',
        options: ['3 × 10⁸ m/s', '3 × 10⁶ m/s', '3 × 10⁹ m/s', '3 × 10⁷ m/s'],
        correctAnswer: 0,
        subject: 'Physics',
        difficulty: 'hard'
      }
    ];
    setQuestions(mockQuestions);
    setFilteredQuestions(mockQuestions);
  };

  const applyFilters = () => {
    let filtered = [...questions];

    if (filters.subject) {
      filtered = filtered.filter(q => q.subject === filters.subject);
    }

    if (filters.difficulty) {
      filtered = filtered.filter(q => q.difficulty === filters.difficulty);
    }

    if (filters.search) {
      filtered = filtered.filter(q =>
        q.question.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredQuestions(filtered);
  };

  const handleFilterChange = (name, value) => {
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const toggleQuestionSelection = (question) => {
    const isSelected = selectedQuestions.find(q => q.id === question.id);
    if (isSelected) {
      setSelectedQuestions(selectedQuestions.filter(q => q.id !== question.id));
    } else {
      setSelectedQuestions([...selectedQuestions, question]);
    }
  };

  const handleAddSelected = () => {
    if (selectedQuestions.length > 0) {
      onAddQuestions(selectedQuestions);
      setSelectedQuestions([]);
    }
  };

  return (
    <div>
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search questions..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <select
          value={filters.subject}
          onChange={(e) => handleFilterChange('subject', e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Subjects</option>
          <option value="Mathematics">Mathematics</option>
          <option value="Physics">Physics</option>
          <option value="Chemistry">Chemistry</option>
          <option value="Biology">Biology</option>
        </select>

        <select
          value={filters.difficulty}
          onChange={(e) => handleFilterChange('difficulty', e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      {/* Questions List */}
      <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
        {filteredQuestions.map((question) => {
          const isSelected = selectedQuestions.find(q => q.id === question.id);
          return (
            <div
              key={question.id}
              onClick={() => toggleQuestionSelection(question)}
              className={`border rounded-lg p-4 cursor-pointer transition ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <p className="font-medium text-gray-800 flex-1">{question.question}</p>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => {}}
                  className="mt-1 ml-2"
                />
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">
                  {question.subject}
                </span>
                <span className={`px-2 py-1 rounded ${
                  question.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                  question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {question.difficulty}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredQuestions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No questions found matching your filters.
        </div>
      )}

      {/* Add Button */}
      <button
        onClick={handleAddSelected}
        disabled={selectedQuestions.length === 0}
        className={`w-full py-3 rounded-lg font-semibold transition flex items-center justify-center ${
          selectedQuestions.length > 0
            ? 'bg-blue-500 text-white hover:bg-blue-600'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        <Plus size={20} className="mr-2" />
        Add {selectedQuestions.length} Selected Question{selectedQuestions.length !== 1 ? 's' : ''}
      </button>
    </div>
  );
};

export default QuestionBank;