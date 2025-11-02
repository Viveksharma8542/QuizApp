const express = require('express');
const router = express.Router();
const {
  getAssignedQuizzes,
  getQuiz,
  submitQuiz,
  getResult
} = require('../controllers/studentController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

router.use(protect);
router.use(authorize('student'));

router.get('/quizzes', getAssignedQuizzes);
router.get('/quizzes/:id', getQuiz);
router.post('/quizzes/:id/submit', submitQuiz);
router.get('/quizzes/:id/result', getResult);

module.exports = router;