const express = require('express');
const router = express.Router();
const mitreProtocolController = require('../controllers/mitreProtocol.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router.post('/', authenticate, authorize(['admin']), mitreProtocolController.createProtocol);
router.get('/', mitreProtocolController.listProtocols);
router.get('/:id', mitreProtocolController.getProtocolById);
router.get('/technique/:techniqueId', mitreProtocolController.getProtocolByTechniqueId);
router.put('/:id', authenticate, authorize(['admin']), mitreProtocolController.updateProtocol);
router.delete('/:id', authenticate, authorize(['admin']), mitreProtocolController.deleteProtocol);
router.patch('/:id/toggle', authenticate, authorize(['admin']), mitreProtocolController.toggleActive);

module.exports = router;