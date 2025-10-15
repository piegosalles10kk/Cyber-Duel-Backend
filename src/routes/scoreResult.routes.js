const express = require('express');
const router = express.Router();
const scoreResultController = require('../controllers/scoreResult.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.get('/session/:sessionId', authenticate, scoreResultController.getScoresBySession);
router.get('/session/:sessionId/edr/:edrId', authenticate, scoreResultController.getScoresBySessionAndEDR);
router.get('/session/:sessionId/summary', authenticate, scoreResultController.getSessionSummary);
router.get('/:id', authenticate, scoreResultController.getScoreById);

module.exports = router;