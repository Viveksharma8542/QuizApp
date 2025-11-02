const Quiz = require('../models/Quiz');
const Attempt = require('../models/Attempt');

// @desc    Get assigned quizzes
// @route   GET /api/student/quizzes
// @access  Private/Student
exports.getAssignedQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({
      assignedStudents: req.user.id
    }).select('-questions.correctAnswer');

    // Get student's attempts
    const attempts = await Attempt.find({ student: req.user.id });
    const attemptedQuizIds = attempts.map(a => a.quiz.toString());

    const quizzesWithStatus = quizzes.map(quiz => ({
      ...quiz.toObject(),
      status: attemptedQuizIds.includes(quiz._id.toString()) ? 'completed' : 'pending'
    }));

    res.status(200).json({
      success: true,
      count: quizzesWithStatus.length,
      quizzes: quizzesWithStatus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single quiz
// @route   GET /api/student/quizzes/:id
// @access  Private/Student
exports.getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({
      _id: req.params.id,
      assignedStudents: req.user.id
    }).select('-questions.correctAnswer');

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found or not assigned to you'
      });
    }

    res.status(200).json({
      success: true,
      quiz
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Submit quiz
// @route   POST /api/student/quizzes/:id/submit
// @access  Private/Student
exports.submitQuiz = async (req, res) => {
  try {
    const { answers, timeTaken } = req.body;

    const quiz = await Quiz.findOne({
      _id: req.params.id,
      assignedStudents: req.user.id
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Calculate score
    let correctAnswers = 0;
    quiz.questions.forEach(question => {
      if (answers[question._id] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = (correctAnswers / quiz.questions.length) * 100;

    // Create attempt
    const attempt = await Attempt.create({
      quiz: quiz._id,
      student: req.user.id,
      answers,
      score,
      correctAnswers,
      totalQuestions: quiz.questions.length,
      timeTaken
    });

    // Update quiz attempts count
    quiz.attempts += 1;
    await quiz.save();

    res.status(201).json({
      success: true,
      attempt: {
        score,
        correctAnswers,
        totalQuestions: quiz.questions.length,
        passed: score >= quiz.passingScore
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get quiz result
// @route   GET /api/student/quizzes/:id/result
// @access  Private/Student
exports.getResult = async (req, res) => {
  try {
    const attempt = await Attempt.findOne({
      quiz: req.params.id,
      student: req.user.id
    }).populate({
      path: 'quiz',
      select: 'title subject questions passingScore'
    });

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'No attempt found for this quiz'
      });
    }

    res.status(200).json({
      success: true,
      attempt
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};