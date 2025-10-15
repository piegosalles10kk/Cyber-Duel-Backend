const mongoose = require('mongoose');

const mitreProtocolSchema = new mongoose.Schema({
  techniqueId: { type: String, required: true },
  name: { type: String, required: true },
  tactic: { type: String, required: true },
  description: String,
  payload: { type: String, required: true },
  expectedDamage: { type: Number, required: true, min: 0, max: 100 },
  platform: { type: String, enum: ['Windows', 'Linux', 'MacOS', 'Multi-Platform'], required: true },
  difficulty: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'] },
  stealthLevel: { type: Number, min: 1, max: 5 },
  mitreUrl: String,
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

mitreProtocolSchema.index({ techniqueId: 1 });
mitreProtocolSchema.index({ tactic: 1, platform: 1 });

module.exports = mongoose.model('MITREProtocol', mitreProtocolSchema);