const { PayloadMap } = require('../models/PayloadMap');
const { EDR } = require('../models/EDR');
const aiService = require('../services/ai.service');

exports.generateWithAI = async (req, res) => {
  try {
    const { edrId, logSamples } = req.body;
    const edr = await EDR.findById(edrId);
    if (!edr) return res.status(404).json({ success: false, error: 'EDR not found' });
    const generatedMapping = await aiService.generatePayloadMapping(edr, logSamples);
    res.json({ success: true, data: generatedMapping });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.createPayloadMap = async (req, res) => {
  try {
    const edr = await EDR.findById(req.body.edrId);
    if (!edr) return res.status(404).json({ success: false, error: 'EDR not found' });
    const payloadMap = new PayloadMap({ ...req.body, createdBy: req.user._id });
    await payloadMap.save();
    res.status(201).json({ success: true, data: payloadMap });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getPayloadMapByEDR = async (req, res) => {
  try {
    const payloadMap = await PayloadMap.findOne({ edrId: req.params.edrId }).populate('edrId').populate('createdBy', 'name email');
    if (!payloadMap) return res.status(404).json({ success: false, error: 'Payload map not found' });
    res.json({ success: true, data: payloadMap });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getPayloadMapById = async (req, res) => {
  try {
    const payloadMap = await PayloadMap.findById(req.params.id).populate('edrId').populate('createdBy', 'name email');
    if (!payloadMap) return res.status(404).json({ success: false, error: 'Payload map not found' });
    res.json({ success: true, data: payloadMap });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updatePayloadMap = async (req, res) => {
  try {
    const payloadMap = await PayloadMap.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!payloadMap) return res.status(404).json({ success: false, error: 'Payload map not found' });
    res.json({ success: true, data: payloadMap });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.deletePayloadMap = async (req, res) => {
  try {
    const payloadMap = await PayloadMap.findByIdAndDelete(req.params.id);
    if (!payloadMap) return res.status(404).json({ success: false, error: 'Payload map not found' });
    res.json({ success: true, message: 'Payload map deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.validatePayloadMap = async (req, res) => {
  try {
    const { validationNotes } = req.body;
    const payloadMap = await PayloadMap.findByIdAndUpdate(req.params.id, { validatedByUser: true, validationNotes }, { new: true });
    if (!payloadMap) return res.status(404).json({ success: false, error: 'Payload map not found' });
    await EDR.findByIdAndUpdate(payloadMap.edrId, { status: 'active' });
    res.json({ success: true, data: payloadMap });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};