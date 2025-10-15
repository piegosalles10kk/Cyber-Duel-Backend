const express = require('express');
const router = express.Router();
const payloadMapController = require('../controllers/payloadMap.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router.post('/generate', authenticate, authorize(['admin', 'vendor']), payloadMapController.generateWithAI);
router.post('/', authenticate, authorize(['admin', 'vendor']), payloadMapController.createPayloadMap);
router.get('/edr/:edrId', payloadMapController.getPayloadMapByEDR);
router.get('/:id', payloadMapController.getPayloadMapById);
router.put('/:id', authenticate, authorize(['admin', 'vendor']), payloadMapController.updatePayloadMap);
router.delete('/:id', authenticate, authorize(['admin']), payloadMapController.deletePayloadMap);
router.post('/:id/validate', authenticate, authorize(['admin', 'vendor']), payloadMapController.validatePayloadMap);

module.exports = router;