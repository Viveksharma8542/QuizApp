const express = require('express');
const router = express.Router();
const {
  registerUser,
  getUsers,
  deleteUser,
  getQuizReports
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

router.use(protect);
router.use(authorize('admin'));

router.post('/register', registerUser);
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.get('/reports/quiz', getQuizReports);

module.exports = router;