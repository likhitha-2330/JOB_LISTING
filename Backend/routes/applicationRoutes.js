const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const applicationController = require('../controllers/applicationController');

router.post('/', auth, applicationController.apply);
router.get('/', auth, applicationController.list);
router.get('/:id', auth, applicationController.get);
router.put('/:id', auth, applicationController.update);
router.delete('/:id', auth, applicationController.delete);

module.exports = router;
