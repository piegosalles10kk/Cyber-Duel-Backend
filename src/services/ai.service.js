const axios = require('axios');
const config = require('../../config');

/**
 * Gera mapeamento de payload usando IA (Gemini)
 */
exports.generatePayloadMapping = async (edr, logSamples) => {
  try {
    const { detectionLog, responseLog } = logSamples;
    
    const prompt = `
Você é um especialista em parsing de logs de segurança.

Analise os dois samples de logs abaixo e gere um mapeamento JSON que traduza esses logs para o schema de pontuação do CyberDuel.

Schema de Pontuação CyberDuel:
{
  "timestamp_utc": "Unix timestamp ou ISO8601",
  "host_id": "Identificador único do host",
  "mitre_technique": "ID da técnica MITRE ATT&CK",
  "detection_flag": "Boolean - evento foi detectado?",
  "block_flag": "Boolean - ataque foi bloqueado?",
  "response_time_sec": "Tempo entre ataque e resposta",
  "severity_level": "Enum: Low/Medium/High/Critical"
}

EDR: ${edr.name} (${edr.vendor})
Platform: ${edr.platform}

LOG DE DETECÇÃO:
${JSON.stringify(detectionLog, null, 2)}

LOG DE RESPOSTA/BLOQUEIO:
${JSON.stringify(responseLog, null, 2)}

RETORNE APENAS JSON no formato:
{
  "edr_name": "${edr.name}",
  "platform": "${edr.platform}",
  "log_format": "JSON",
  "field_mapping": {
    "timestamp_utc": {
      "jsonpath": "$.timestamp",
      "type": "unix_epoch"
    },
    "host_id": {
      "jsonpath": "$.device_id",
      "type": "string"
    },
    "mitre_technique": {
      "jsonpath": "$.event.technique_id",
      "type": "string",
      "fallback": "Unknown"
    },
    "detection_flag": {
      "jsonpath": "$.event.type",
      "condition": {
        "type": "contains",
        "value": "detection",
        "caseInsensitive": true
      }
    },
    "block_flag": {
      "jsonpath": "$.response.action",
      "condition": {
        "type": "in",
        "values": ["blocked", "quarantined", "terminated"]
      }
    },
    "severity_level": {
      "jsonpath": "$.severity",
      "mapping": {
        "low": "Low",
        "medium": "Medium",
        "high": "High",
        "critical": "Critical"
      }
    }
  },
  "confidence_score": 0.85
}
`;

    // Chamada à API do Gemini (ou OpenAI)
    const apiKey = config.ai.geminiApiKey;
    
    if (!apiKey) {
      // Se não tiver API key, retorna um mapeamento genérico
      console.warn('⚠️  AI API Key não configurada. Retornando mapeamento genérico.');
      return generateGenericMapping(edr, logSamples);
    }

    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
      {
        contents: [{
          parts: [{ text: prompt }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        timeout: 30000
      }
    );

    const generatedText = response.data.candidates[0].content.parts[0].text;
    
    // Extrai JSON da resposta
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('IA não retornou JSON válido');
    }

    const mapping = JSON.parse(jsonMatch[0]);
    
    return {
      ...mapping,
      edrId: edr._id,
      logSamples,
      generatedByAI: true,
      aiModel: 'gemini-pro',
      aiPromptVersion: '1.0'
    };

  } catch (error) {
    console.error('❌ Erro ao gerar mapeamento com IA:', error.message);
    
    // Fallback para mapeamento genérico
    return generateGenericMapping(edr, logSamples);
  }
};

/**
 * Gera mapeamento genérico quando IA não está disponível
 */
function generateGenericMapping(edr, logSamples) {
  return {
    edr_name: edr.name,
    platform: edr.platform,
    log_format: 'JSON',
    field_mapping: {
      timestamp_utc: {
        jsonpath: '$.timestamp',
        type: 'unix_epoch'
      },
      host_id: {
        jsonpath: '$.host_id',
        type: 'string'
      },
      mitre_technique: {
        jsonpath: '$.technique_id',
        type: 'string',
        fallback: 'Unknown'
      },
      detection_flag: {
        jsonpath: '$.event_type',
        condition: {
          type: 'contains',
          value: 'detection',
          caseInsensitive: true
        }
      },
      block_flag: {
        jsonpath: '$.action',
        condition: {
          type: 'in',
          values: ['blocked', 'quarantined', 'terminated']
        }
      },
      severity_level: {
        jsonpath: '$.severity',
        mapping: {
          low: 'Low',
          medium: 'Medium',
          high: 'High',
          critical: 'Critical'
        }
      }
    },
    edrId: edr._id,
    logSamples,
    confidenceScore: 0.5,
    generatedByAI: false,
    aiModel: 'generic-fallback',
    aiPromptVersion: '1.0'
  };
}