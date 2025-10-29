const Quiz = require('../models/Quiz');
const User = require('../models/User');
const Attempt = require('../models/Attempt');

// @desc    Create quiz
// @route   POST /api/teacher/quizzes
// @access  Private/Teacher
exports.createQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.create({
      ...req.body,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      quiz
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get teacher's quizzes
// @route   GET /api/teacher/quizzes
// @access  Private/Teacher
exports.getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ createdBy: req.user.id })
      .populate('assignedStudents', 'name email rollNo')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: quizzes.length,
      quizzes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Assign quiz to students
// @route   POST /api/teacher/quizzes/:id/assign
// @access  Private/Teacher
exports.assignQuiz = async (req, res) => {
  try {
    const { studentIds } = req.body;

    const quiz = await Quiz.findOne({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    quiz.assignedStudents = studentIds;
    await quiz.save();

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

// @desc    Get quiz results
// @route   GET /api/teacher/quizzes/:id/results
// @access  Private/Teacher
exports.getQuizResults = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    const attempts = await Attempt.find({ quiz: req.params.id })
      .populate('student', 'name email rollNo')
      .sort('-submittedAt');

    res.status(200).json({
      success: true,
      quiz: {
        title: quiz.title,
        subject: quiz.subject
      },
      attempts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete quiz
// @route   DELETE /api/teacher/quizzes/:id
// @access  Private/Teacher
exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    await quiz.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Quiz deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};