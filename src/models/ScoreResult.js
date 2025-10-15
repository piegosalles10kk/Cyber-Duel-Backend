const mongoose = require('mongoose');

const scoreResultSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'TestSession', required: true, index: true },
  edrId: { type: mongoose.Schema.Types.ObjectId, ref: 'EDR', required: true, index: true },
  attackInfo: { mitreProtocol: { type: String, required: true }, attackDescription: String, expectedDamage: Number, attackerEdrId: { type: mongoose.Schema.Types.ObjectId, ref: 'EDR' } },
  scoring: { detectionPoints: { type: Number, default: 0 }, blockPoints: { type: Number, default: 0 }, responseTimePoints: { type: Number, default: 0 }, falsePositivePenalty: { type: Number, default: 0 }, systemImpactPenalty: { type: Number, default: 0 }, totalPoints: { type: Number, default: 0 } },
  damage: { dealt: { type: Number, default: 0 }, received: { type: Number, default: 0 }, blocked: { type: Boolean, default: false } },
  performance: { responseTimeMs: Number, cpuUsagePercent: Number, ramUsageMB: Number },
  relatedLogIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CollectedLog' }],
  timestamp: { type: Date, default: Date.now, index: true }
}, { timestamps: true });

scoreResultSchema.index({ sessionId: 1, edrId: 1, timestamp: -1 });
scoreResultSchema.index({ 'attackInfo.mitreProtocol': 1 });

module.exports = mongoose.model('ScoreResult', scoreResultSchema);