const { CollectedLog } = require('../models/CollectedLog');
const scoreEngine = require('../services/scoreEngine.service');

exports.ingestLog = async (req, res) => {
  try {
    const { sessionId, edrId, rawLog } = req.body;
    const collectedLog = new CollectedLog({ sessionId, edrId, rawLog });
    await collectedLog.save();
    scoreEngine.processLog(collectedLog);
    res.status(201).json({ success: true, data: collectedLog });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getLogsBySession = async (req, res) => {
  try {
    const logs = await CollectedLog.find({ sessionId: req.params.sessionId }).sort({ collectedAt: -1 });
    res.json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getLogsBySessionAndEDR = async (req, res) => {
  try {
    const logs = await CollectedLog.find({ sessionId: req.params.sessionId, edrId: req.params.edrId }).sort({ collectedAt: -1 });
    res.json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getLogById = async (req, res) => {
  try {
    const log = await CollectedLog.findById(req.params.id);
    if (!log) return res.status(404).json({ success: false, error: 'Log not found' });
    res.json({ success: true, data: log });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.ingestLogBatch = async (req, res) => {
  try {
    const { logs } = req.body;
    const collectedLogs = await CollectedLog.insertMany(logs);
    collectedLogs.forEach(log => scoreEngine.processLog(log));
    res.status(201).json({ success: true, data: collectedLogs });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};