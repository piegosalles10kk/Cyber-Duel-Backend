const { EDR } = require('../models/EDR');
const { DeploymentMap } = require('../models/DeploymentMap');


exports.createDeploymentMap = async (req, res) => {
  try {
    const edr = await EDR.findById(req.body.edrId);
    if (!edr) return res.status(404).json({ success: false, error: 'EDR not found' });
    const deploymentMap = new DeploymentMap(req.body);
    await deploymentMap.save();
    res.status(201).json({ success: true, data: deploymentMap });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getDeploymentMapByEDR = async (req, res) => {
  try {
    const deploymentMap = await DeploymentMap.findOne({ edrId: req.params.edrId }).populate('edrId').populate('validatedBy', 'name email');
    if (!deploymentMap) return res.status(404).json({ success: false, error: 'Deployment map not found' });
    res.json({ success: true, data: deploymentMap });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getDeploymentMapById = async (req, res) => {
  try {
    const deploymentMap = await DeploymentMap.findById(req.params.id).populate('edrId').populate('validatedBy', 'name email');
    if (!deploymentMap) return res.status(404).json({ success: false, error: 'Deployment map not found' });
    res.json({ success: true, data: deploymentMap });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateDeploymentMap = async (req, res) => {
  try {
    const deploymentMap = await DeploymentMap.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!deploymentMap) return res.status(404).json({ success: false, error: 'Deployment map not found' });
    res.json({ success: true, data: deploymentMap });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.deleteDeploymentMap = async (req, res) => {
  try {
    const deploymentMap = await DeploymentMap.findByIdAndDelete(req.params.id);
    if (!deploymentMap) return res.status(404).json({ success: false, error: 'Deployment map not found' });
    res.json({ success: true, message: 'Deployment map deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.validateDeploymentMap = async (req, res) => {
  try {
    const deploymentMap = await DeploymentMap.findByIdAndUpdate(req.params.id, { validated: true, validatedAt: new Date(), validatedBy: req.user._id }, { new: true });
    if (!deploymentMap) return res.status(404).json({ success: false, error: 'Deployment map not found' });
    res.json({ success: true, data: deploymentMap });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};