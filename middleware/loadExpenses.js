import { existsSync, readFileSync } from 'node:fs';

const EXPENSE_FILE = 'expense.json';

// Función para leer el archivo de gastos
export const loadExpenses = () => {
  if (!existsSync(EXPENSE_FILE)) return [];
  const data = readFileSync(EXPENSE_FILE, 'utf-8');
  return JSON.parse(data);
};
