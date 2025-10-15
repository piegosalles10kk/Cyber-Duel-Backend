// models/EDR.js
const mongoose = require('mongoose');

const edrSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  vendor: { type: String, required: true, trim: true },
  platform: { type: String, enum: ['Windows', 'Linux', 'MacOS', 'Multi-Platform'], required: true },
  status: { type: String, enum: ['draft', 'active', 'deprecated'], default: 'draft' },
  description: { type: String, maxlength: 1000 },
  logoUrl: String,
  website: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

edrSchema.index({ name: 1, vendor: 1 });
edrSchema.index({ status: 1 });

module.exports = mongoose.model('EDR', edrSchema);


// models/DeploymentMap.js
const mongoose = require('mongoose');

const deploymentMapSchema = new mongoose.Schema({
  edrId: { type: mongoose.Schema.Types.ObjectId, ref: 'EDR', required: true },
  terraformTemplate: { type: String, required: true },
  installCommand: { type: String, required: true },
  activationCommand: { type: String, required: true },
  requiredVariables: [{
    name: { type: String, required: true },
    description: String,
    type: { type: String, enum: ['string', 'number', 'boolean', 'secret'], default: 'string' },
    example: String,
    required: { type: Boolean, default: true }
  }],
  validationScript: String,
  preInstallScript: String,
  postInstallScript: String,
  version: { type: Number, default: 1 },
  validated: { type: Boolean, default: false },
  validatedAt: Date,
  validatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

deploymentMapSchema.index({ edrId: 1 });

module.exports = mongoose.model('DeploymentMap', deploymentMapSchema);


// models/PayloadMap.js
const mongoose = require('mongoose');

const payloadMapSchema = new mongoose.Schema({
  edrId: { type: mongoose.Schema.Types.ObjectId, ref: 'EDR', required: true },
  logFormat: { type: String, enum: ['JSON', 'Syslog', 'CEF', 'LEEF', 'XML', 'Custom'], required: true },
  fieldMapping: {
    timestamp_utc: {
      jsonpath: String,
      type: { type: String, enum: ['unix_epoch', 'iso8601', 'custom_format'], default: 'unix_epoch' },
      format: String,
      fallback: mongoose.Schema.Types.Mixed
    },
    host_id: {
      jsonpath: String,
      type: String,
      fallback: mongoose.Schema.Types.Mixed
    },
    mitre_technique: {
      jsonpath: String,
      type: String,
      fallback: String
    },
    detection_flag: {
      jsonpath: String,
      condition: {
        type: { type: String, enum: ['equals', 'contains', 'regex', 'in', 'exists'] },
        value: mongoose.Schema.Types.Mixed,
        pattern: String,
        values: [String],
        caseInsensitive: Boolean
      }
    },
    block_flag: {
      jsonpath: String,
      condition: {
        type: { type: String, enum: ['equals', 'contains', 'regex', 'in', 'exists'] },
        value: mongoose.Schema.Types.Mixed,
        pattern: String,
        values: [String],
        caseInsensitive: Boolean
      }
    },
    response_time_sec: {
      calculation: { type: String, enum: ['subtract', 'extract', 'static'] },
      fields: [String],
      jsonpath: String,
      value: Number
    },
    severity_level: {
      jsonpath: String,
      mapping: { type: Map, of: String },
      fallback: { type: String, default: 'Medium' }
    },
    customFields: { type: Map, of: mongoose.Schema.Types.Mixed }
  },
  logSamples: {
    detectionLog: mongoose.Schema.Types.Mixed,
    responseLog: mongoose.Schema.Types.Mixed
  },
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


// models/TestSession.js
const mongoose = require('mongoose');

const testSessionSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: String,
  edrA: {
    edrId: { type: mongoose.Schema.Types.ObjectId, ref: 'EDR', required: true },
    name: String,
    vmIp: String,
    vmId: String,
    currentHP: { type: Number, default: 100, min: 0, max: 100 },
    defensePoints: { type: Number, default: 0 },
    deploymentVariables: { type: Map, of: String }
  },
  edrB: {
    edrId: { type: mongoose.Schema.Types.ObjectId, ref: 'EDR', required: true },
    name: String,
    vmIp: String,
    vmId: String,
    currentHP: { type: Number, default: 100, min: 0, max: 100 },
    defensePoints: { type: Number, default: 0 },
    deploymentVariables: { type: Map, of: String }
  },
  arenaConfig: {
    weightClass: { type: String, enum: ['lightweight', 'standard', 'heavyweight', 'team'], default: 'standard' },
    vCPU: Number,
    ramMB: Number,
    attackProtocols: [String],
    simultaneousAttacks: { type: Boolean, default: true }
  },
  status: { type: String, enum: ['pending', 'provisioning', 'ready', 'running', 'paused', 'completed', 'failed', 'cancelled'], default: 'pending' },
  infrastructureReady: { type: Boolean, default: false },
  startedAt: Date,
  completedAt: Date,
  result: {
    winner: { type: String, enum: ['edrA', 'edrB', 'draw'] },
    winReason: { type: String, enum: ['knockout', 'points', 'technical'] },
    finalScores: {
      edrA: {
        hp: Number,
        defensePoints: Number,
        totalDamageDealt: Number,
        totalDamageReceived: Number
      },
      edrB: {
        hp: Number,
        defensePoints: Number,
        totalDamageDealt: Number,
        totalDamageReceived: Number
      }
    }
  },
  errorLogs: [{
    timestamp: Date,
    severity: { type: String, enum: ['info', 'warning', 'error', 'critical'] },
    message: String,
    stackTrace: String
  }],
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


// models/CollectedLog.js
const mongoose = require('mongoose');

const collectedLogSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'TestSession', required: true, index: true },
  edrId: { type: mongoose.Schema.Types.ObjectId, ref: 'EDR', required: true, index: true },
  rawLog: { type: mongoose.Schema.Types.Mixed, required: true },
  normalizedLog: {
    timestamp_utc: Date,
    host_id: String,
    mitre_technique: String,
    detection_flag: Boolean,
    block_flag: Boolean,
    response_time_sec: Number,
    severity_level: String,
    customFields: mongoose.Schema.Types.Mixed
  },
  processed: { type: Boolean, default: false },
  processingErrors: [String],
  collectedAt: { type: Date, default: Date.now, index: true }
}, { timestamps: true });

collectedLogSchema.index({ sessionId: 1, edrId: 1, collectedAt: -1 });
collectedLogSchema.index({ processed: 1 });

module.exports = mongoose.model('CollectedLog', collectedLogSchema);


// models/ScoreResult.js
const mongoose = require('mongoose');

const scoreResultSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'TestSession', required: true, index: true },
  edrId: { type: mongoose.Schema.Types.ObjectId, ref: 'EDR', required: true, index: true },
  attackInfo: {
    mitreProtocol: { type: String, required: true },
    attackDescription: String,
    expectedDamage: Number,
    attackerEdrId: { type: mongoose.Schema.Types.ObjectId, ref: 'EDR' }
  },
  scoring: {
    detectionPoints: { type: Number, default: 0 },
    blockPoints: { type: Number, default: 0 },
    responseTimePoints: { type: Number, default: 0 },
    falsePositivePenalty: { type: Number, default: 0 },
    systemImpactPenalty: { type: Number, default: 0 },
    totalPoints: { type: Number, default: 0 }
  },
  damage: {
    dealt: { type: Number, default: 0 },
    received: { type: Number, default: 0 },
    blocked: { type: Boolean, default: false }
  },
  performance: {
    responseTimeMs: Number,
    cpuUsagePercent: Number,
    ramUsageMB: Number
  },
  relatedLogIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CollectedLog' }],
  timestamp: { type: Date, default: Date.now, index: true }
}, { timestamps: true });

scoreResultSchema.index({ sessionId: 1, edrId: 1, timestamp: -1 });
scoreResultSchema.index({ 'attackInfo.mitreProtocol': 1 });

module.exports = mongoose.model('ScoreResult', scoreResultSchema);


// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  name: { type: String, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin', 'vendor', 'enterprise', 'community'], default: 'community' },
  organization: String,
  permissions: {
    canCreateEDRs: { type: Boolean, default: false },
    canRunTests: { type: Boolean, default: true },
    maxConcurrentSessions: { type: Number, default: 1 }
  },
  subscription: {
    tier: { type: String, enum: ['free', 'starter', 'professional', 'enterprise'], default: 'free' },
    validUntil: Date,
    monthlyTestLimit: Number,
    testsUsedThisMonth: { type: Number, default: 0 }
  },
  createdAt: { type: Date, default: Date.now },
  lastLoginAt: Date
}, { timestamps: true });

userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);


// models/MITREProtocol.js
const mongoose = require('mongoose');

const mitreProtocolSchema = new mongoose.Schema({
  techniqueId: { type: String, required: true, unique: true },
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


// models/index.js
module.exports = {
  EDR: require('./EDR'),
  DeploymentMap: require('./DeploymentMap'),
  PayloadMap: require('./PayloadMap'),
  TestSession: require('./TestSession'),
  CollectedLog: require('./CollectedLog'),
  ScoreResult: require('./ScoreResult'),
  User: require('./User'),
  MITREProtocol: require('./MITREProtocol')
};