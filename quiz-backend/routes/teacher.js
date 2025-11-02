const express = require('express');
const router = express.Router();
const {
  createQuiz,
  getQuizzes,
  assignQuiz,
  getQuizResults,
  deleteQuiz
} = require('../controllers/teacherController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

router.use(protect);
router.use(authorize('teacher'));

router.route('/quizzes')
  .get(getQuizzes)
  .post(createQuiz);

router.delete('/quizzes/:id', deleteQuiz);
router.post('/quizzes/:id/assign', assignQuiz);
router.get('/quizzes/:id/results', getQuizResults);

module.exports = router;