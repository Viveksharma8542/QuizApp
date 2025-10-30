// src/components/student/TakeQuiz.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, AlertCircle, CheckCircle } from 'lucide-react';
import QuizTimer from './QuizTimer';

const TakeQuiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuiz();
  }, [quizId]);

  const fetchQuiz = async () => {
    // Get quiz from localStorage
    const allQuizzes = JSON.parse(localStorage.getItem('teacherQuizzes') || '[]');
    const foundQuiz = allQuizzes.find(q => q.id === quizId);
    
    if (foundQuiz) {
      setQuiz(foundQuiz);
      setTimeRemaining(foundQuiz.duration * 60); // Convert to seconds
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    setAnswers({
      ...answers,
      [questionId]: answerIndex
    });
  };

  const goToQuestion = (index) => {
    setCurrentQuestion(index);
  };

  const nextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleTimeUp = () => {
    handleSubmitQuiz();
  };

  const handleSubmitQuiz = async () => {
    // Calculate score
    let correctAnswers = 0;
    quiz.questions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = (correctAnswers / quiz.questions.length) * 100;
    const timeTaken = (quiz.duration * 60) - timeRemaining;

    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const studentId = currentUser.id;

    // Save attempt to localStorage
    const attempt = {
      quizId: quiz.id,
      studentId: studentId,
      answers: answers,
      score: score,
      correctAnswers: correctAnswers,
      totalQuestions: quiz.questions.length,
      timeTaken: timeTaken,
      completedAt: new Date().toISOString().split('T')[0],
      submittedAt: new Date().toISOString()
    };

    // Get existing attempts
    const existingAttempts = JSON.parse(localStorage.getItem(`attempts_${studentId}`) || '[]');
    existingAttempts.push(attempt);
    localStorage.setItem(`attempts_${studentId}`, JSON.stringify(existingAttempts));

    // Update quiz attempt count
    const allQuizzes = JSON.parse(localStorage.getItem('teacherQuizzes') || '[]');
    const updatedQuizzes = allQuizzes.map(q => {
      if (q.id === quiz.id) {
        return {
          ...q,
          attempts: (q.attempts || 0) + 1
        };
      }
      return q;
    });
    localStorage.setItem('teacherQuizzes', JSON.stringify(updatedQuizzes));

    // Dispatch events
    window.dispatchEvent(new Event('quizAssigned'));
    window.dispatchEvent(new Event('quizCreated'));

    // Navigate to results page
    navigate(`/student/quiz/${quiz.id}/result`, { 
      state: { 
        score, 
        correctAnswers, 
        totalQuestions: quiz.questions.length,
        answers,
        questions: quiz.questions
      } 
    });
  };

  const mockSubmitQuiz = (data) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 500);
    });
  };

  // Remove mockSubmitQuiz as we're using localStorage now

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
          <p className="text-gray-600">Quiz not found</p>
        </div>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{quiz.title}</h1>
              <p className="text-sm text-gray-600">{quiz.description}</p>
            </div>
            <QuizTimer 
              initialTime={timeRemaining}
              onTimeUpdate={setTimeRemaining}
              onTimeUp={handleTimeUp}
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Navigation Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 sticky top-6">
              <h3 className="font-semibold text-gray-800 mb-4">Question Navigation</h3>
              <div className="grid grid-cols-5 gap-2 mb-4">
                {quiz.questions.map((q, index) => (
                  <button
                    key={q.id}
                    onClick={() => goToQuestion(index)}
                    className={`w-10 h-10 rounded-lg font-medium transition ${
                      currentQuestion === index
                        ? 'bg-blue-500 text-white'
                        : answers[q.id] !== undefined
                        ? 'bg-green-100 text-green-700 border-2 border-green-500'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Questions:</span>
                  <span className="font-semibold">{quiz.questions.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Answered:</span>
                  <span className="font-semibold text-green-600">{getAnsweredCount()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Not Answered:</span>
                  <span className="font-semibold text-orange-600">
                    {quiz.questions.length - getAnsweredCount()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Question Display */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="mb-4">
                <span className="text-sm text-gray-500">
                  Question {currentQuestion + 1} of {quiz.questions.length}
                </span>
              </div>

              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                {currentQ.question}
              </h2>

              <div className="space-y-3">
                {currentQ.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(currentQ.id, index)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition ${
                      answers[currentQ.id] === index
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${
                        answers[currentQ.id] === index
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {answers[currentQ.id] === index && (
                          <CheckCircle size={16} className="text-white" />
                        )}
                      </div>
                      <span className="font-medium text-gray-700 mr-2">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <span className="text-gray-800">{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <button
                onClick={previousQuestion}
                disabled={currentQuestion === 0}
                className={`px-6 py-3 rounded-lg font-semibold transition ${
                  currentQuestion === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Previous
              </button>

              <div className="flex gap-3">
                {currentQuestion === quiz.questions.length - 1 ? (
                  <button
                    onClick={() => setShowSubmitModal(true)}
                    className="px-8 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition"
                  >
                    Submit Quiz
                  </button>
                ) : (
                  <button
                    onClick={nextQuestion}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Submit Quiz?</h3>
            <p className="text-gray-600 mb-2">
              You have answered {getAnsweredCount()} out of {quiz.questions.length} questions.
            </p>
            {getAnsweredCount() < quiz.questions.length && (
              <p className="text-orange-600 text-sm mb-4">
                <AlertCircle size={16} className="inline mr-1" />
                You have {quiz.questions.length - getAnsweredCount()} unanswered question(s).
              </p>
            )}
            <p className="text-gray-600 mb-6">
              Are you sure you want to submit your quiz? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitQuiz}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TakeQuiz;