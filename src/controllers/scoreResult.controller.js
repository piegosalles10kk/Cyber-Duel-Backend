const { ScoreResult } = require('../models');

exports.getScoresBySession = async (req, res) => {
  try {
    const scores = await ScoreResult.find({ sessionId: req.params.sessionId }).populate('edrId').sort({ timestamp: -1 });
    res.json({ success: true, data: scores });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getScoresBySessionAndEDR = async (req, res) => {
  try {
    const scores = await ScoreResult.find({ sessionId: req.params.sessionId, edrId: req.params.edrId }).sort({ timestamp: -1 });
    res.json({ success: true, data: scores });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getSessionSummary = async (req, res) => {
  try {
    const summary = await ScoreResult.aggregate([
      { $match: { sessionId: require('mongoose').Types.ObjectId(req.params.sessionId) } },
      { $group: { _id: '$edrId', totalPoints: { $sum: '$scoring.totalPoints' }, detectionPoints: { $sum: '$scoring.detectionPoints' }, blockPoints: { $sum: '$scoring.blockPoints' }, totalDamageDealt: { $sum: '$damage.dealt' }, totalDamageReceived: { $sum: '$damage.received' } } }
    ]);
    res.json({ success: true, data: summary });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getScoreById = async (req, res) => {
  try {
    const score = await ScoreResult.findById(req.params.id).populate('edrId').populate('relatedLogIds');
    if (!score) return res.status(404).json({ success: false, error: 'Score not found' });
    res.json({ success: true, data: score });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};