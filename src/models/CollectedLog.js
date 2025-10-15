const mongoose = require('mongoose');

const collectedLogSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'TestSession', required: true, index: true },
  edrId: { type: mongoose.Schema.Types.ObjectId, ref: 'EDR', required: true, index: true },
  rawLog: { type: mongoose.Schema.Types.Mixed, required: true },
  normalizedLog: { timestamp_utc: Date, host_id: String, mitre_technique: String, detection_flag: Boolean, block_flag: Boolean, response_time_sec: Number, severity_level: String, customFields: mongoose.Schema.Types.Mixed },
  processed: { type: Boolean, default: false },
  processingErrors: [String],
  collectedAt: { type: Date, default: Date.now, index: true }
}, { timestamps: true });

collectedLogSchema.index({ sessionId: 1, edrId: 1, collectedAt: -1 });
collectedLogSchema.index({ processed: 1 });

module.exports = mongoose.model('CollectedLog', collectedLogSchema);