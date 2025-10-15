const express = require('express');
const router = express.Router();
const testSessionController = require('../controllers/testSession.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.post('/', authenticate, testSessionController.createSession);
router.get('/', testSessionController.listSessions);
router.get('/:id', testSessionController.getSessionById);
router.put('/:id', authenticate, testSessionController.updateSession);
router.delete('/:id', authenticate, testSessionController.deleteSession);
router.post('/:id/provision', authenticate, testSessionController.provisionInfrastructure);
router.post('/:id/start', authenticate, testSessionController.startSession);
router.post('/:id/pause', authenticate, testSessionController.pauseSession);
router.post('/:id/stop', authenticate, testSessionController.stopSession);
router.get('/:id/status', testSessionController.getSessionStatus);
router.get('/:id/live-scores', testSessionController.getLiveScores);

module.exports = router;