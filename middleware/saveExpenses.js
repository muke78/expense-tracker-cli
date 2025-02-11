import { promises as fs } from 'node:fs';

const EXPENSE_FILE = 'expense.json';

// Función para guardar el archivo de gastos
export const saveExpenses = async (expenses) => {
  await fs.writeFile(EXPENSE_FILE, JSON.stringify(expenses, null, 2));
};
