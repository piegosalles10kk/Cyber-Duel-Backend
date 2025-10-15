const jp = require('jsonpath');
const { PayloadMap, ScoreResult, TestSession } = require('../models');

/**
 * Processa um log coletado e calcula a pontuação
 */
exports.processLog = async (collectedLog) => {
  try {
    // Busca o PayloadMap do EDR
    const payloadMap = await PayloadMap.findOne({ edrId: collectedLog.edrId });
    
    if (!payloadMap) {
      console.warn(`⚠️  PayloadMap não encontrado para EDR: ${collectedLog.edrId}`);
      collectedLog.processed = false;
      collectedLog.processingErrors.push('PayloadMap not found');
      await collectedLog.save();
      return;
    }

    // Normaliza o log usando o mapeamento
    const normalizedLog = normalizeLog(collectedLog.rawLog, payloadMap.fieldMapping);
    
    // Atualiza o log com dados normalizados
    collectedLog.normalizedLog = normalizedLog;
    collectedLog.processed = true;
    await collectedLog.save();

    // Calcula pontuação
    const score = calculateScore(normalizedLog, collectedLog);
    
    // Salva resultado
    const scoreResult = new ScoreResult({
      sessionId: collectedLog.sessionId,
      edrId: collectedLog.edrId,
      attackInfo: {
        mitreProtocol: normalizedLog.mitre_technique || 'Unknown',
        attackDescription: `Attack detected at ${normalizedLog.timestamp_utc}`
      },
      scoring: score,
      damage: {
        dealt: 0,
        received: score.blockPoints > 0 ? 0 : 25,
        blocked: score.blockPoints > 0
      },
      relatedLogIds: [collectedLog._id],
      timestamp: new Date()
    });

    await scoreResult.save();

    // Atualiza a sessão
    await updateSession(collectedLog.sessionId, collectedLog.edrId, scoreResult);

    console.log(`✅ Log processado e pontuado: ${collectedLog._id}`);

  } catch (error) {
    console.error('❌ Erro ao processar log:', error.message);
    collectedLog.processed = false;
    collectedLog.processingErrors.push(error.message);
    await collectedLog.save();
  }
};

/**
 * Normaliza log usando JSONPath
 */
function normalizeLog(rawLog, fieldMapping) {
  const normalized = {};

  try {
    // Timestamp
    if (fieldMapping.timestamp_utc?.jsonpath) {
      const timestamp = jp.query(rawLog, fieldMapping.timestamp_utc.jsonpath)[0];
      normalized.timestamp_utc = new Date(timestamp * 1000);
    }

    // Host ID
    if (fieldMapping.host_id?.jsonpath) {
      normalized.host_id = jp.query(rawLog, fieldMapping.host_id.jsonpath)[0];
    }

    // MITRE Technique
    if (fieldMapping.mitre_technique?.jsonpath) {
      normalized.mitre_technique = jp.query(rawLog, fieldMapping.mitre_technique.jsonpath)[0];
    }

    // Detection Flag
    if (fieldMapping.detection_flag?.jsonpath) {
      const value = jp.query(rawLog, fieldMapping.detection_flag.jsonpath)[0];
      normalized.detection_flag = evaluateCondition(value, fieldMapping.detection_flag.condition);
    }

    // Block Flag
    if (fieldMapping.block_flag?.jsonpath) {
      const value = jp.query(rawLog, fieldMapping.block_flag.jsonpath)[0];
      normalized.block_flag = evaluateCondition(value, fieldMapping.block_flag.condition);
    }

    // Severity Level
    if (fieldMapping.severity_level?.jsonpath) {
      const value = jp.query(rawLog, fieldMapping.severity_level.jsonpath)[0];
      normalized.severity_level = fieldMapping.severity_level.mapping?.[value] || 'Medium';
    }

  } catch (error) {
    console.error('Erro ao normalizar log:', error.message);
  }

  return normalized;
}

/**
 * Avalia condições do mapeamento
 */
function evaluateCondition(value, condition) {
  if (!condition) return false;

  switch (condition.type) {
    case 'equals':
      return value === condition.value;
    case 'contains':
      return String(value).toLowerCase().includes(String(condition.value).toLowerCase());
    case 'in':
      return condition.values.includes(value);
    case 'regex':
      return new RegExp(condition.pattern, condition.caseInsensitive ? 'i' : '').test(value);
    case 'exists':
      return value !== undefined && value !== null;
    default:
      return false;
  }
}

/**
 * Calcula pontuação baseada no log normalizado
 */
function calculateScore(normalizedLog) {
  const scoring = {
    detectionPoints: normalizedLog.detection_flag ? 10 : 0,
    blockPoints: normalizedLog.block_flag ? 20 : 0,
    responseTimePoints: 0,
    falsePositivePenalty: 0,
    systemImpactPenalty: 0,
    totalPoints: 0
  };

  scoring.totalPoints = scoring.detectionPoints + scoring.blockPoints + scoring.responseTimePoints - scoring.falsePositivePenalty - scoring.systemImpactPenalty;

  return scoring;
}

/**
 * Atualiza sessão com novos pontos
 */
async function updateSession(sessionId, edrId, scoreResult) {
  try {
    const session = await TestSession.findById(sessionId);
    if (!session) return;

    const isEdrA = session.edrA.edrId.toString() === edrId.toString();
    const targetField = isEdrA ? 'edrA' : 'edrB';

    session[targetField].defensePoints += scoreResult.scoring.totalPoints;
    session[targetField].currentHP -= scoreResult.damage.received;

    await session.save();
  } catch (error) {
    console.error('Erro ao atualizar sessão:', error.message);
  }
}