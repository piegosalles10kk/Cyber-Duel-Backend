const express = require('express');
const router = express.Router();
const deploymentMapController = require('../controllers/deploymentMap.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router.post('/', authenticate, authorize(['admin', 'vendor']), deploymentMapController.createDeploymentMap);
router.get('/edr/:edrId', deploymentMapController.getDeploymentMapByEDR);
router.get('/:id', deploymentMapController.getDeploymentMapById);
router.put('/:id', authenticate, authorize(['admin', 'vendor']), deploymentMapController.updateDeploymentMap);
router.delete('/:id', authenticate, authorize(['admin']), deploymentMapController.deleteDeploymentMap);
router.post('/:id/validate', authenticate, authorize(['admin', 'vendor']), deploymentMapController.validateDeploymentMap);

module.exports = router;