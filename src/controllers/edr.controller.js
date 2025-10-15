const { EDR } = require('../models');

exports.createEDR = async (req, res) => {
  try {
    const edr = new EDR({ ...req.body, createdBy: req.user._id });
    await edr.save();
    res.status(201).json({ success: true, data: edr });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.listEDRs = async (req, res) => {
  try {
    const { status, platform, vendor } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (platform) filter.platform = platform;
    if (vendor) filter.vendor = new RegExp(vendor, 'i');
    const edrs = await EDR.find(filter).populate('createdBy', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, data: edrs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getEDRById = async (req, res) => {
  try {
    const edr = await EDR.findById(req.params.id).populate('createdBy', 'name email');
    if (!edr) return res.status(404).json({ success: false, error: 'EDR not found' });
    res.json({ success: true, data: edr });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateEDR = async (req, res) => {
  try {
    const edr = await EDR.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!edr) return res.status(404).json({ success: false, error: 'EDR not found' });
    res.json({ success: true, data: edr });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.deleteEDR = async (req, res) => {
  try {
    const edr = await EDR.findByIdAndDelete(req.params.id);
    if (!edr) return res.status(404).json({ success: false, error: 'EDR not found' });
    res.json({ success: true, message: 'EDR deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const edr = await EDR.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!edr) return res.status(404).json({ success: false, error: 'EDR not found' });
    res.json({ success: true, data: edr });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};