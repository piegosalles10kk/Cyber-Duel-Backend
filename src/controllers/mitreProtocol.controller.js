const { MITREProtocol } = require('../models/MITREProtocol');

exports.createProtocol = async (req, res) => {
  try {
    const protocol = new MITREProtocol(req.body);
    await protocol.save();
    res.status(201).json({ success: true, data: protocol });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.listProtocols = async (req, res) => {
  try {
    const { tactic, platform, active } = req.query;
    const filter = {};
    if (tactic) filter.tactic = tactic;
    if (platform) filter.platform = platform;
    if (active !== undefined) filter.active = active === 'true';
    const protocols = await MITREProtocol.find(filter).sort({ techniqueId: 1 });
    res.json({ success: true, data: protocols });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getProtocolById = async (req, res) => {
  try {
    const protocol = await MITREProtocol.findById(req.params.id);
    if (!protocol) return res.status(404).json({ success: false, error: 'Protocol not found' });
    res.json({ success: true, data: protocol });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getProtocolByTechniqueId = async (req, res) => {
  try {
    const protocol = await MITREProtocol.findOne({ techniqueId: req.params.techniqueId });
    if (!protocol) return res.status(404).json({ success: false, error: 'Protocol not found' });
    res.json({ success: true, data: protocol });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateProtocol = async (req, res) => {
  try {
    const protocol = await MITREProtocol.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!protocol) return res.status(404).json({ success: false, error: 'Protocol not found' });
    res.json({ success: true, data: protocol });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.deleteProtocol = async (req, res) => {
  try {
    const protocol = await MITREProtocol.findByIdAndDelete(req.params.id);
    if (!protocol) return res.status(404).json({ success: false, error: 'Protocol not found' });
    res.json({ success: true, message: 'Protocol deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.toggleActive = async (req, res) => {
  try {
    const protocol = await MITREProtocol.findById(req.params.id);
    if (!protocol) return res.status(404).json({ success: false, error: 'Protocol not found' });
    protocol.active = !protocol.active;
    await protocol.save();
    res.json({ success: true, data: protocol });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};