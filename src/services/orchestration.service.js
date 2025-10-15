const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const { TestSession, DeploymentMap } = require('../models');
const config = require('../../config');

/**
 * Provisiona infraestrutura usando Terraform
 */
exports.provisionInfrastructure = async (session) => {
  try {
    console.log(`🚀 Iniciando provisionamento para sessão: ${session._id}`);

    // Atualiza status
    session.status = 'provisioning';
    await session.save();

    // Busca deployment maps
    const deploymentA = await DeploymentMap.findOne({ edrId: session.edrA.edrId });
    const deploymentB = await DeploymentMap.findOne({ edrId: session.edrB.edrId });

    if (!deploymentA || !deploymentB) {
      throw new Error('Deployment maps não encontrados');
    }

    // Executa Terraform (simulado por enquanto)
    console.log('📦 Executando Terraform apply...');
    
    // Em produção, aqui você executaria:
    // const { stdout } = await execPromise(`cd ${config.terraform.workdir} && terraform apply -auto-approve`);
    
    // Simulação:
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Atualiza sessão
    session.infrastructureReady = true;
    session.status = 'ready';
    session.edrA.vmIp = '192.168.1.10';
    session.edrB.vmIp = '192.168.1.20';
    await session.save();

    console.log(`✅ Infraestrutura provisionada para sessão: ${session._id}`);

  } catch (error) {
    console.error('❌ Erro ao provisionar infraestrutura:', error.message);
    session.status = 'failed';
    session.errorLogs.push({
      timestamp: new Date(),
      severity: 'critical',
      message: error.message
    });
    await session.save();
    throw error;
  }
};

/**
 * Inicia execução de ataques
 */
exports.startAttacks = async (session) => {
  try {
    console.log(`⚔️  Iniciando ataques para sessão: ${session._id}`);

    session.status = 'running';
    session.startedAt = new Date();
    await session.save();

    // Aqui você chamaria o script Python ou executaria os ataques
    console.log('🎯 Ataques iniciados (implementar integração com Orquestrador Python)');

    // Por enquanto, apenas loga
    console.log(`✅ Sessão ${session._id} em execução`);

  } catch (error) {
    console.error('❌ Erro ao iniciar ataques:', error.message);
    session.status = 'failed';
    session.errorLogs.push({
      timestamp: new Date(),
      severity: 'critical',
      message: error.message
    });
    await session.save();
    throw error;
  }
};