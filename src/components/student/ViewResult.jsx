// src/components/student/ViewResult.jsx
import { useLocation, useNavigate } from 'react-router-dom';
import { Trophy, CheckCircle, XCircle, Home } from 'lucide-react';

const ViewResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { score, correctAnswers, totalQuestions, answers, questions } = location.state || {};

  if (!location.state) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No result data available</p>
          <button
            onClick={() => navigate('/student/dashboard')}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isPassed = score >= 60;
  const percentage = score.toFixed(2);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Result Summary Card */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6 text-center">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
            isPassed ? 'bg-green-100' : 'bg-red-100'
          }`}>
            <Trophy size={40} className={isPassed ? 'text-green-500' : 'text-red-500'} />
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {isPassed ? 'Congratulations! 🎉' : 'Keep Trying! 💪'}
          </h1>
          <p className="text-gray-600 mb-6">
            {isPassed 
              ? 'You have successfully passed the quiz!' 
              : 'You need more practice. Don\'t give up!'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Your Score</p>
              <p className="text-3xl font-bold text-blue-600">{percentage}%</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Correct Answers</p>
              <p className="text-3xl font-bold text-green-600">
                {correctAnswers}/{totalQuestions}
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Grade</p>
              <p className="text-3xl font-bold text-purple-600">
                {isPassed ? 'PASS' : 'FAIL'}
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/student/dashboard')}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition flex items-center mx-auto"
          >
            <Home size={20} className="mr-2" />
            Back to Dashboard
          </button>
        </div>

        {/* Detailed Results */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Answer Review</h2>
          
          <div className="space-y-6">
            {questions && questions.map((question, index) => {
              const userAnswer = answers[question.id];
              const isCorrect = userAnswer === question.correctAnswer;
              const wasAnswered = userAnswer !== undefined;

              return (
                <div
                  key={question.id}
                  className={`border-2 rounded-lg p-4 ${
                    !wasAnswered
                      ? 'border-gray-200 bg-gray-50'
                      : isCorrect
                      ? 'border-green-200 bg-green-50'
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-2">
                        Question {index + 1}
                      </h3>
                      <p className="text-gray-700">{question.question}</p>
                    </div>
                    <div>
                      {!wasAnswered ? (
                        <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-medium">
                          Not Answered
                        </span>
                      ) : isCorrect ? (
                        <CheckCircle className="text-green-500" size={24} />
                      ) : (
                        <XCircle className="text-red-500" size={24} />
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {question.options.map((option, optIndex) => {
                      const isUserAnswer = userAnswer === optIndex;
                      const isCorrectAnswer = question.correctAnswer === optIndex;

                      return (
                        <div
                          key={optIndex}
                          className={`p-3 rounded-lg ${
                            isCorrectAnswer
                              ? 'bg-green-100 border-2 border-green-500'
                              : isUserAnswer
                              ? 'bg-red-100 border-2 border-red-500'
                              : 'bg-white border border-gray-200'
                          }`}
                        >
                          <div className="flex items-center">
                            <span className="font-medium text-gray-700 mr-2">
                              {String.fromCharCode(65 + optIndex)}.
                            </span>
                            <span className="text-gray-800">{option}</span>
                            {isCorrectAnswer && (
                              <span className="ml-auto text-green-700 text-sm font-medium">
                                ✓ Correct Answer
                              </span>
                            )}
                            {isUserAnswer && !isCorrectAnswer && (
                              <span className="ml-auto text-red-700 text-sm font-medium">
                                ✗ Your Answer
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewResult;