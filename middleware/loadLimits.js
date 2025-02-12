import { existsSync, readFileSync } from 'node:fs';

const BUDGET_LIMIT = 'budget.json';

// Función para leer el arcivo de limites
export const loadLimits = () => {
  if (!existsSync(BUDGET_LIMIT)) return [];
  const data = readFileSync(BUDGET_LIMIT, 'utf-8');
  return JSON.parse(data);
};
