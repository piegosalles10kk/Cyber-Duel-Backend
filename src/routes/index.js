const express = require('express');
const router = express.Router();

router.use('/edrs', require('./edr.routes'));
router.use('/deployment-maps', require('./deploymentMap.routes'));
router.use('/payload-maps', require('./payloadMap.routes'));
router.use('/sessions', require('./testSession.routes'));
router.use('/logs', require('./collectedLog.routes'));
router.use('/scores', require('./scoreResult.routes'));
router.use('/mitre-protocols', require('./mitreProtocol.routes'));
router.use('/users', require('./user.routes'));

module.exports = router;