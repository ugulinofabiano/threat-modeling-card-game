#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.resolve(__dirname, '..', 'public', 'security_details.json');
const backupPath = path.resolve(__dirname, '..', 'public', `security_details.backup.${Date.now()}.json`);

function makeTechDesc(name) {
  return `Descrição técnica gerada automaticamente para ${name}. Revise e expanda conforme necessário.`;
}

function makeWhenOccurs(name) {
  return [`Ocorrência típica relacionada a ${name}.`, `Cenário comum onde ${name} pode ocorrer.`];
}

function makeHowToIdentify(name) {
  return [`Verificar logs e padrões de acesso relacionados a ${name}.`, `Monitorar anomalias e picos que indiquem ${name}.`];
}

function makeHowToPrevent(name) {
  return [`Implementar controles específicos para mitigar ${name}.`, `Aplicar validações e políticas de segurança.`];
}

function makeRisk(name) {
  return [`Risco potencial associado a ${name}.`, `Impacto operacional e de dados se explorado.`];
}

try {
  if (!fs.existsSync(filePath)) {
    console.error('Arquivo não encontrado:', filePath);
    process.exit(1);
  }

  const raw = fs.readFileSync(filePath, 'utf8');
  const json = JSON.parse(raw);
  const details = json.security_details || {};

  // Backup
  fs.writeFileSync(backupPath, JSON.stringify(json, null, 2), 'utf8');
  console.log('Backup criado em', backupPath);

  let changed = false;
  Object.keys(details).forEach((k) => {
    const entry = details[k] || {};
    const name = entry.name || k;

    if (!entry.name) { entry.name = name; changed = true; }
    if (!entry.technical_description || !entry.technical_description.trim()) { entry.technical_description = makeTechDesc(name); changed = true; }

    if (!Array.isArray(entry.when_it_occurs) || entry.when_it_occurs.length === 0) {
      entry.when_it_occurs = makeWhenOccurs(name); changed = true;
    }
    if (!Array.isArray(entry.how_to_identify) || entry.how_to_identify.length === 0) {
      entry.how_to_identify = makeHowToIdentify(name); changed = true;
    }
    if (!Array.isArray(entry.how_to_prevent) || entry.how_to_prevent.length === 0) {
      entry.how_to_prevent = makeHowToPrevent(name); changed = true;
    }
    if (!Array.isArray(entry.qual_o_risco) || entry.qual_o_risco.length === 0) {
      entry.qual_o_risco = makeRisk(name); changed = true;
    }

    // Assign back
    details[k] = entry;
  });

  if (changed) {
    json.security_details = details;
    fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
    console.log('Arquivo enriquecido e salvo em', filePath);
  } else {
    console.log('Nenhuma alteração necessária. Arquivo já estava completo.');
  }
} catch (err) {
  console.error('Erro ao enriquecer o JSON:', err);
  process.exit(1);
}
