const { TestSession } = require('../models/TestSession');
const { EDR } = require('../models/EDR');

const orchestrationService = require('../services/orchestration.service');

exports.createSession = async (req, res) => {
  try {
    const { edrA, edrB } = req.body;
    const edrADoc = await EDR.findById(edrA.edrId);
    const edrBDoc = await EDR.findById(edrB.edrId);
    if (!edrADoc || !edrBDoc) return res.status(404).json({ success: false, error: 'One or both EDRs not found' });
    if (edrADoc.status !== 'active' || edrBDoc.status !== 'active') return res.status(400).json({ success: false, error: 'Both EDRs must be active' });
    const session = new TestSession({ ...req.body, createdBy: req.user._id, 'edrA.name': edrADoc.name, 'edrB.name': edrBDoc.name });
    await session.save();
    res.status(201).json({ success: true, data: session });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.listSessions = async (req, res) => {
  try {
    const { status, createdBy } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (createdBy) filter.createdBy = createdBy;
    const sessions = await TestSession.find(filter).populate('edrA.edrId edrB.edrId').populate('createdBy', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, data: sessions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getSessionById = async (req, res) => {
  try {
    const session = await TestSession.findById(req.params.id).populate('edrA.edrId edrB.edrId').populate('createdBy', 'name email');
    if (!session) return res.status(404).json({ success: false, error: 'Session not found' });
    res.json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateSession = async (req, res) => {
  try {
    const session = await TestSession.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!session) return res.status(404).json({ success: false, error: 'Session not found' });
    res.json({ success: true, data: session });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.deleteSession = async (req, res) => {
  try {
    const session = await TestSession.findByIdAndDelete(req.params.id);
    if (!session) return res.status(404).json({ success: false, error: 'Session not found' });
    res.json({ success: true, message: 'Session deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.provisionInfrastructure = async (req, res) => {
  try {
    const session = await TestSession.findById(req.params.id);
    if (!session) return res.status(404).json({ success: false, error: 'Session not found' });
    await orchestrationService.provisionInfrastructure(session);
    res.json({ success: true, message: 'Infrastructure provisioning started' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.startSession = async (req, res) => {
  try {
    const session = await TestSession.findById(req.params.id);
    if (!session) return res.status(404).json({ success: false, error: 'Session not found' });
    if (!session.infrastructureReady) return res.status(400).json({ success: false, error: 'Infrastructure not ready' });
    await orchestrationService.startAttacks(session);
    res.json({ success: true, message: 'Session started' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.pauseSession = async (req, res) => {
  try {
    const session = await TestSession.findByIdAndUpdate(req.params.id, { status: 'paused' }, { new: true });
    if (!session) return res.status(404).json({ success: false, error: 'Session not found' });
    res.json({ success: true, data: session });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.stopSession = async (req, res) => {
  try {
    const session = await TestSession.findByIdAndUpdate(req.params.id, { status: 'completed', completedAt: new Date() }, { new: true });
    if (!session) return res.status(404).json({ success: false, error: 'Session not found' });
    res.json({ success: true, data: session });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getSessionStatus = async (req, res) => {
  try {
    const session = await TestSession.findById(req.params.id).select('status infrastructureReady edrA.currentHP edrA.defensePoints edrB.currentHP edrB.defensePoints');
    if (!session) return res.status(404).json({ success: false, error: 'Session not found' });
    res.json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getLiveScores = async (req, res) => {
  try {
    const { ScoreResult } = require('../models');
    const scores = await ScoreResult.find({ sessionId: req.params.id }).sort({ timestamp: -1 }).limit(50);
    res.json({ success: true, data: scores });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
