const mongoose = require('mongoose');

const payloadMapSchema = new mongoose.Schema({
  edrId: { type: mongoose.Schema.Types.ObjectId, ref: 'EDR', required: true },
  logFormat: { type: String, enum: ['JSON', 'Syslog', 'CEF', 'LEEF', 'XML', 'Custom'], required: true },
  fieldMapping: {
    timestamp_utc: { jsonpath: String, type: { type: String, enum: ['unix_epoch', 'iso8601', 'custom_format'], default: 'unix_epoch' }, format: String, fallback: mongoose.Schema.Types.Mixed },
    host_id: { jsonpath: String, type: String, fallback: mongoose.Schema.Types.Mixed },
    mitre_technique: { jsonpath: String, type: String, fallback: String },
    detection_flag: { jsonpath: String, condition: { type: { type: String, enum: ['equals', 'contains', 'regex', 'in', 'exists'] }, value: mongoose.Schema.Types.Mixed, pattern: String, values: [String], caseInsensitive: Boolean } },
    block_flag: { jsonpath: String, condition: { type: { type: String, enum: ['equals', 'contains', 'regex', 'in', 'exists'] }, value: mongoose.Schema.Types.Mixed, pattern: String, values: [String], caseInsensitive: Boolean } },
    response_time_sec: { calculation: { type: String, enum: ['subtract', 'extract', 'static'] }, fields: [String], jsonpath: String, value: Number },
    severity_level: { jsonpath: String, mapping: { type: Map, of: String }, fallback: { type: String, default: 'Medium' } },
    customFields: { type: Map, of: mongoose.Schema.Types.Mixed }
  },
  logSamples: { detectionLog: mongoose.Schema.Types.Mixed, responseLog: mongoose.Schema.Types.Mixed },
  confidenceScore: { type: Number, min: 0, max: 1, default: 0 },
  validatedByUser: { type: Boolean, default: false },
  validationNotes: String,
  version: { type: Number, default: 1 },
  generatedByAI: { type: Boolean, default: true },
  aiModel: String,
  aiPromptVersion: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

payloadMapSchema.index({ edrId: 1 });
payloadMapSchema.index({ validatedByUser: 1 });

module.exports = mongoose.model('PayloadMap', payloadMapSchema);