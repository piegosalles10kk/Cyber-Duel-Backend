const mongoose = require('mongoose');

const testSessionSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: String,
  edrA: { edrId: { type: mongoose.Schema.Types.ObjectId, ref: 'EDR', required: true }, name: String, vmIp: String, vmId: String, currentHP: { type: Number, default: 100, min: 0, max: 100 }, defensePoints: { type: Number, default: 0 }, deploymentVariables: { type: Map, of: String } },
  edrB: { edrId: { type: mongoose.Schema.Types.ObjectId, ref: 'EDR', required: true }, name: String, vmIp: String, vmId: String, currentHP: { type: Number, default: 100, min: 0, max: 100 }, defensePoints: { type: Number, default: 0 }, deploymentVariables: { type: Map, of: String } },
  arenaConfig: { weightClass: { type: String, enum: ['lightweight', 'standard', 'heavyweight', 'team'], default: 'standard' }, vCPU: Number, ramMB: Number, attackProtocols: [String], simultaneousAttacks: { type: Boolean, default: true } },
  status: { type: String, enum: ['pending', 'provisioning', 'ready', 'running', 'paused', 'completed', 'failed', 'cancelled'], default: 'pending' },
  infrastructureReady: { type: Boolean, default: false },
  startedAt: Date,
  completedAt: Date,
  result: { winner: { type: String, enum: ['edrA', 'edrB', 'draw'] }, winReason: { type: String, enum: ['knockout', 'points', 'technical'] }, finalScores: { edrA: { hp: Number, defensePoints: Number, totalDamageDealt: Number, totalDamageReceived: Number }, edrB: { hp: Number, defensePoints: Number, totalDamageDealt: Number, totalDamageReceived: Number } } },
  errorLogs: [{ timestamp: Date, severity: { type: String, enum: ['info', 'warning', 'error', 'critical'] }, message: String, stackTrace: String }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isPublic: { type: Boolean, default: false },
  tags: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

testSessionSchema.index({ status: 1, createdAt: -1 });
testSessionSchema.index({ 'edrA.edrId': 1, 'edrB.edrId': 1 });
testSessionSchema.index({ createdBy: 1 });

module.exports = mongoose.model('TestSession', testSessionSchema);