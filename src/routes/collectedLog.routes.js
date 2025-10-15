const express = require('express');
const router = express.Router();
const collectedLogController = require('../controllers/collectedLog.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.post('/', authenticate, collectedLogController.ingestLog);
router.get('/session/:sessionId', authenticate, collectedLogController.getLogsBySession);
router.get('/session/:sessionId/edr/:edrId', authenticate, collectedLogController.getLogsBySessionAndEDR);
router.get('/:id', authenticate, collectedLogController.getLogById);
router.post('/batch', authenticate, collectedLogController.ingestLogBatch);

module.exports = router;