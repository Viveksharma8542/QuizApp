// src/components/teacher/AIQuestionGenerator.jsx
import { useState } from 'react';
import { Sparkles, Loader } from 'lucide-react';

const AIQuestionGenerator = ({ onAddQuestions }) => {
  const [formData, setFormData] = useState({
    topic: '',
    subject: '',
    difficulty: 'medium',
    count: 5
  });
  const [generating, setGenerating] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const generateQuestions = async () => {
    if (!formData.topic || !formData.subject) {
      alert('Please fill in topic and subject');
      return;
    }

    setGenerating(true);

    try {
      // Mock AI generation - In production, call your AI API here
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockQuestions = generateMockQuestions(
        formData.topic,
        formData.subject,
        formData.difficulty,
        parseInt(formData.count)
      );

      onAddQuestions(mockQuestions);
    } catch (error) {
      alert('Error generating questions');
    } finally {
      setGenerating(false);
    }
  };

  const generateMockQuestions = (topic, subject, difficulty, count) => {
    const questions = [];
    const templates = [
      {
        question: `What is the basic principle of ${topic}?`,
        options: [`Definition A`, `Definition B`, `Definition C`, `Definition D`],
        correctAnswer: 0
      },
      {
        question: `Which of the following is true about ${topic}?`,
        options: [`Statement A`, `Statement B`, `Statement C`, `Statement D`],
        correctAnswer: 1
      },
      {
        question: `How does ${topic} relate to ${subject}?`,
        options: [`Relation A`, `Relation B`, `Relation C`, `Relation D`],
        correctAnswer: 2
      },
      {
        question: `What is an example of ${topic} in practice?`,
        options: [`Example A`, `Example B`, `Example C`, `Example D`],
        correctAnswer: 0
      },
      {
        question: `What is the main application of ${topic}?`,
        options: [`Application A`, `Application B`, `Application C`, `Application D`],
        correctAnswer: 1
      }
    ];

    for (let i = 0; i < Math.min(count, templates.length); i++) {
      questions.push({
        id: Date.now().toString() + i,
        question: templates[i].question,
        options: templates[i].options,
        correctAnswer: templates[i].correctAnswer,
        subject: subject,
        difficulty: difficulty
      });
    }

    return questions;
  };

  return (
    <div>
      <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <h3 className="font-semibold text-purple-800 mb-2 flex items-center">
          <Sparkles size={18} className="mr-2" />
          AI Question Generation
        </h3>
        <p className="text-sm text-purple-700">
          Let AI generate questions based on your topic and preferences. The AI will create relevant multiple-choice questions automatically.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Topic *
          </label>
          <input
            type="text"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="e.g., Photosynthesis, Newton's Laws, World War II"
            disabled={generating}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject *
            </label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={generating}
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
              Difficulty
            </label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={generating}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Questions
            </label>
            <input
              type="number"
              name="count"
              value={formData.count}
              onChange={handleChange}
              min="1"
              max="20"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={generating}
            />
          </div>
        </div>

        <button
          onClick={generateQuestions}
          disabled={generating}
          className={`w-full flex items-center justify-center py-3 rounded-lg font-semibold transition ${
            generating
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-purple-500 text-white hover:bg-purple-600'
          }`}
        >
          {generating ? (
            <>
              <Loader size={20} className="mr-2 animate-spin" />
              Generating Questions...
            </>
          ) : (
            <>
              <Sparkles size={20} className="mr-2" />
              Generate with AI
            </>
          )}
        </button>
      </div>

      <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-xs text-gray-600">
          <strong>Note:</strong> This is a demo implementation. In production, integrate with OpenAI, Claude, or other AI services for actual question generation.
        </p>
      </div>
    </div>
  );
};

export default AIQuestionGenerator;