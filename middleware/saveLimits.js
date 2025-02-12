import { promises as fs } from 'node:fs';

const BUDGET_LIMIT = 'budget.json';

// Función para guardar el archivo de gastos
export const saveLimits = async (budget) => {
  await fs.writeFile(BUDGET_LIMIT, JSON.stringify(budget, null, 2));
};
