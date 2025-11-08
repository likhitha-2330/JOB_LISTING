const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { optionalAuth } = require('../middleware/authMiddleware');
const jobController = require('../controllers/jobController');

// Employer's own jobs - MUST be before /:id route
router.get('/my-jobs', auth, jobController.myJobs);

// Public routes
router.get('/', optionalAuth, jobController.list);
router.get('/:id', jobController.getById);

// Protected routes
router.post('/', auth, jobController.create);
router.put('/:id', auth, jobController.update);
router.delete('/:id', auth, jobController.remove);

module.exports = router;
