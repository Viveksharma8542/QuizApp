const User = require('../models/User');
const Quiz = require('../models/Quiz');
const Attempt = require('../models/Attempt');

// @desc    Register new user
// @route   POST /api/admin/register
// @access  Private/Admin
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role, rollNo, phone, department } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
      rollNo,
      phone,
      department
    });

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        rollNo: user.rollNo,
        department: user.department
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const { role } = req.query;

    let query = {};
    if (role) {
      query.role = role;
    }

    const users = await User.find(query).select('-password');

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get quiz-wise reports
// @route   GET /api/admin/reports/quiz
// @access  Private/Admin
exports.getQuizReports = async (req, res) => {
  try {
    const quizzes = await Quiz.find()
      .populate('createdBy', 'name')
      .lean();

    const reports = await Promise.all(quizzes.map(async (quiz) => {
      const attempts = await Attempt.find({ quiz: quiz._id });
      
      const scores = attempts.map(a => a.score);
      const averageScore = scores.length > 0 
        ? scores.reduce((a, b) => a + b, 0) / scores.length 
        : 0;
      const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
      const lowestScore = scores.length > 0 ? Math.min(...scores) : 0;
      const passRate = attempts.filter(a => a.score >= quiz.passingScore).length / attempts.length * 100 || 0;

      return {
        quizId: quiz._id,
        title: quiz.title,
        subject: quiz.subject,
        teacher: quiz.createdBy.name,
        totalAttempts: attempts.length,
        averageScore: averageScore.toFixed(2),
        highestScore,
        lowestScore,
        passRate: passRate.toFixed(2)
      };
    }));

    res.status(200).json({
      success: true,
      reports
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};