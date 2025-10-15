const express = require('express');
const router = express.Router();
const edrController = require('../controllers/edr.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router.post('/', authenticate, authorize(['admin', 'vendor']), edrController.createEDR);
router.get('/', edrController.listEDRs);
router.get('/:id', edrController.getEDRById);
router.put('/:id', authenticate, authorize(['admin', 'vendor']), edrController.updateEDR);
router.delete('/:id', authenticate, authorize(['admin']), edrController.deleteEDR);
router.patch('/:id/status', authenticate, authorize(['admin', 'vendor']), edrController.updateStatus);

module.exports = router;